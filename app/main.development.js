import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import { concat, isString } from "lodash";
import { initGlobalCfg, appDataDirectory, getHcdPath, validateGlobalCfgFile, setMustOpenForm, clearPreviousWallet} from "./config.js";
import { hcctlCfg, hcdCfg, hcwalletCfg, initWalletCfg, getWalletCfg, newWalletConfigCreation, readHcdConfig, getWalletPath} from "./config.js";
import path from "path";
import fs from "fs-extra";
import os from "os";
import parseArgs from "minimist";
import stringArgv from "string-argv";
import { appLocaleFromElectronLocale, default as locales} from "./i18n/locales";
import { createLogger } from "./logging";
import { Buffer } from "buffer";

let menu;
let template;
let mainWindow = null;
let versionWin = null;
let grpcVersions = {requiredVersion: null, walletVersion: null};
let debug = false;
let hcdPID;
let hcwPID;
let hcwPort;
let hcdConfig = {};
let currentBlockCount;

let hcdLogs = Buffer.from("");
let hcwalletLogs = Buffer.from("");

let MAX_LOG_LENGTH = 50000;

// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log("%s is not a valid option!", arg);
  return;
}

function getExecutablePath(name) {
  let customBinPath = argv.customBinPath;

  let binPath = customBinPath ? customBinPath :
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, "..", "bin")
      : path.join(process.resourcesPath, "bin");
  let execName = os.platform() !== "win32" ? name : name + ".exe";

  return path.join(binPath, execName);
}

function showUsage() {
  console.log(`${app.getName()} version ${app.getVersion()}
Usage
  $ ${app.getName()} [--help] [--version] [--debug] [--testnet|--mainnet]
               [--extrawalletargs=...]

Options
  --help             Show help and exit
  --version          Show version and exit
  --debug  -d        Debug daemon/wallet messages
  --testnet          Connect to testnet
  --mainnet          Connect to mainnet
  --extrawalletargs  Pass extra arguments to hcwallet
  --customBinPath    Custom path for hcd/hcwallet/hcctl binaries
`);
}

// Allowed cmd line options are defined here.
var opts = {
  boolean: ["debug", "testnet", "mainnet", "help", "version"],
  string: ["extrawalletargs", "customBinPath"],
  default: { debug: false },
  alias: { d: "debug" },
  unknown: unknownFn
};

var argv = parseArgs(process.argv.slice(1), opts);
debug = argv.debug || process.env.NODE_ENV === "development";

if (argv.help) {
  showUsage();
  app.exit(0);
}

if (argv.version) {
  console.log(`${app.getName()} version ${app.getVersion()}`);
  app.exit(0);
}

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development") {
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

// Always use reasonable path for save data.
app.setPath("userData", appDataDirectory());

// Check that wallets directory has been created, if not, make it.
let walletsDirectory = path.join(app.getPath("userData"),"wallets");
fs.pathExistsSync(walletsDirectory) || fs.mkdirsSync(walletsDirectory);
fs.pathExistsSync(path.join(walletsDirectory, "mainnet")) || fs.mkdirsSync(path.join(walletsDirectory, "mainnet"));
fs.pathExistsSync(path.join(walletsDirectory, "testnet")) || fs.mkdirsSync(path.join(walletsDirectory, "testnet"));

let defaultMainnetWalletDirectory = path.join(walletsDirectory, "mainnet", "default-wallet");
if (!fs.pathExistsSync(defaultMainnetWalletDirectory)){
  fs.mkdirsSync(defaultMainnetWalletDirectory);

  // check for existing mainnet directories
  if (fs.pathExistsSync(path.join(app.getPath("userData"), "mainnet", "wallet.db"))) {
    fs.mkdirsSync(path.join(defaultMainnetWalletDirectory, "mainnet"));
    fs.copySync(path.join(app.getPath("userData"), "mainnet"), path.join(defaultMainnetWalletDirectory, "mainnet"));
  }

  // copy over existing config.json if it exists
  if (fs.pathExistsSync(path.join(app.getPath("userData"), "config.json"))) {
    fs.copySync(path.join(app.getPath("userData"), "config.json"), path.join(defaultMainnetWalletDirectory, "config.json"));
  }

  // create new configs for default mainnet wallet
  initWalletCfg(false, "default-wallet");
  newWalletConfigCreation(false, "default-wallet");

}

let defaultTestnetWalletDirectory = path.join(walletsDirectory, "testnet", "default-wallet");
if (!fs.pathExistsSync(defaultTestnetWalletDirectory)){
  fs.mkdirsSync(defaultTestnetWalletDirectory);

  // check for existing testnet2 directories
  if (fs.pathExistsSync(path.join(app.getPath("userData"), "testnet2", "wallet.db"))) {
    fs.mkdirsSync(path.join(defaultTestnetWalletDirectory, "testnet2"));
    fs.copySync(path.join(app.getPath("userData"), "testnet2"), path.join(defaultTestnetWalletDirectory, "testnet2"));
  }

  // copy over existing config.json if it exists
  if (fs.pathExistsSync(path.join(app.getPath("userData"), "config.json"))) {
    fs.copySync(path.join(app.getPath("userData"), "config.json"), path.join(defaultTestnetWalletDirectory, "config.json"));
  }

  // create new configs for default testnet wallet
  initWalletCfg(true, "default-wallet");
  newWalletConfigCreation(true, "default-wallet");

}

// Verify that config.json is valid JSON before fetching it, because
// it will silently fail when fetching.
let err = validateGlobalCfgFile();
if (err !== null) {
  let errMessage = "There was an error while trying to load the config file, the format is invalid.\n\nFile: " + path.resolve(appDataDirectory(), "config.json") + "\nError: " + err;
  dialog.showErrorBox("Config File Error", errMessage);
  app.quit();
}
var globalCfg = initGlobalCfg();

const logger = createLogger(debug);
logger.log("info", "Using config/data from:" + app.getPath("userData"));
logger.log("info", "Versions: HcGui: %s, Electron: %s, Chrome: %s",
  app.getVersion(), process.versions.electron, process.versions.chrome);

process.on("uncaughtException", err => {
  logger.log("error", "UNCAUGHT EXCEPTION", err);
  throw err;
});

// Check if network was set on command line (but only allow one!).
if (argv.testnet && argv.mainnet) {
  logger.log("Cannot use both --testnet and --mainnet.");
  app.quit();
}

let daemonIsAdvanced = globalCfg.get("daemon_start_advanced");

function closeHCW() {
  if (require("is-running")(hcwPID)) {
    logger.log("info", "Sending SIGINT to hcwallet at pid:" + hcwPID);
    process.kill(hcwPID, "SIGINT");
  }
}

function closeHCD() {
  if (require("is-running")(hcdPID)) {
    logger.log("info", "Sending SIGINT to hcd at pid:" + hcdPID);
    process.kill(hcdPID, "SIGINT");
  }
}

function closeClis() {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if(hcdPID && hcdPID !== -1)
    closeHCD();
  if(hcwPID && hcwPID !== -1)
    closeHCW();
}

function cleanShutdown() {
  // Attempt a clean shutdown.
  const cliShutDownPause = 2; // in seconds.
  const shutDownPause = 3; // in seconds.
  closeClis();
  // Sent shutdown message again as we have seen it missed in the past if they
  // are still running.
  setTimeout(function () { closeClis(); }, cliShutDownPause * 1000);
  logger.log("info", "Closing HcGui.");

  let shutdownTimer = setInterval(function(){
    const stillRunning = (require("is-running")(hcdPID) && os.platform() != "win32");

    if (!stillRunning) {
      logger.log("info", "Final shutdown pause. Quitting app.");
      clearInterval(shutdownTimer);
      if (mainWindow) {
        mainWindow.webContents.send("daemon-stopped");
        setTimeout(() => {mainWindow.close(); app.quit();}, 1000);
      } else {
        app.quit();
      }
      return;
    }
    logger.log("info", "Daemon still running in final shutdown pause. Waiting.");

  }, shutDownPause*1000);
}

const installExtensions = async () => {
  if (process.env.NODE_ENV === "development") {
    const installer = require("electron-devtools-installer"); // eslint-disable-line global-require

    const extensions = [
      "REACT_DEVELOPER_TOOLS",
      "REDUX_DEVTOOLS"
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) { // eslint-disable-line
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) { } // eslint-disable-line
    }
  }
};

const { ipcMain } = require("electron");

ipcMain.on("get-available-wallets", (event) => {// Attempt to find all currently available wallet.db's in the respective network direction in each wallets data dir
  var availableWallets = [];
  var mainnetWalletDirectories = fs.readdirSync(path.join(walletsDirectory, "mainnet"));

  for (var i in mainnetWalletDirectories) {
    if (fs.pathExistsSync(path.join(walletsDirectory, "mainnet", mainnetWalletDirectories[i].toString(), "mainnet", "wallet.db"))) {
      availableWallets.push({network: "mainnet", wallet: mainnetWalletDirectories[i] });
    }
  }
  var testnetWalletDirectories = fs.readdirSync(path.join(walletsDirectory, "testnet"));

  for (var j in testnetWalletDirectories) {
    if (fs.pathExistsSync(path.join(walletsDirectory, "testnet", testnetWalletDirectories[j].toString(), "testnet2", "wallet.db"))) {
      availableWallets.push({network: "testnet", wallet: testnetWalletDirectories[j] });
    }
  }
  event.returnValue = availableWallets;
});

ipcMain.on("start-daemon", (event, walletPath, appData, testnet) => {
  if (hcdPID && hcdConfig && !daemonIsAdvanced) {
    logger.log("info", "Skipping restart of daemon as it is already running");
    event.returnValue = hcdConfig;
    return;
  }
  if(appData){
    logger.log("info", "launching hcd with different appdata directory");
  }
  if (hcdPID && hcdConfig) {
    logger.log("info", "hcd already started " + hcdPID);
    event.returnValue = hcdConfig;
    return;
  }
  try {
    hcdConfig = launchHCD(walletPath, appData, testnet);
    hcdPID = hcdConfig.pid;
  } catch (e) {
    logger.log("error", "error launching hcd: " + e);
  }
  event.returnValue = hcdConfig;
});

ipcMain.on("create-wallet", (event, walletPath, testnet) => {
  let newWalletDirectory = path.join(walletsDirectory, testnet ? "testnet" : "mainnet", walletPath);
  if (!fs.pathExistsSync(newWalletDirectory)){
    fs.mkdirsSync(newWalletDirectory);

    // create new configs for new wallet
    initWalletCfg(testnet, walletPath);
    newWalletConfigCreation(testnet, walletPath);
  }
  event.returnValue = true;
});

ipcMain.on("remove-wallet", (event, walletPath, testnet) => {
  let removeWalletDirectory = path.join(walletsDirectory, testnet ? "testnet" : "mainnet", walletPath);
  if (fs.pathExistsSync(removeWalletDirectory)){
    fs.removeSync(removeWalletDirectory);
  }
  event.returnValue = true;
});

ipcMain.on("start-wallet", (event, walletPath, testnet) => {
  newWalletConfigCreation(testnet, walletPath);
  if (hcwPID) {
    logger.log("info", "hcwallet already started " + hcwPID +hcwPort);
    mainWindow.webContents.send("hcwallet-port", hcwPort);
    event.returnValue = hcwPID;
    return;
  }
  try {
    hcwPID = launchHCWallet(walletPath, testnet);
  } catch (e) {
    logger.log("error", "error launching hcwallet: " + e);
  }
  event.returnValue = getWalletCfg(testnet, walletPath);
});

ipcMain.on("check-daemon", (event, walletPath, rpcCreds, testnet) => {
  let args = ["getblockcount"];
  let host, port;
  if (!rpcCreds){
    args.push(`--configfile=${hcctlCfg(getWalletPath(testnet, walletPath))}`);
  } else if (rpcCreds) {
    if (rpcCreds.rpc_user) {
      args.push(`--rpcuser=${rpcCreds.rpc_user}`);
    }
    if (rpcCreds.rpc_password) {
      args.push(`--rpcpass=${rpcCreds.rpc_password}`);
    }
    if (rpcCreds.rpc_cert) {
      args.push(`--rpccert=${rpcCreds.rpc_cert}`);
    }
    if (rpcCreds.rpc_host) {
      host = rpcCreds.rpc_host;
    }
    if (rpcCreds.rpc_port) {
      port = rpcCreds.rpc_port;
    }
    args.push("--rpcserver=" + host + ":" + port);
  }

  if (testnet) {
    args.push("--testnet");
  }

  var hcctlExe = getExecutablePath("hcctl");
  if (!fs.existsSync(hcctlExe)) {
    logger.log("error", "The hcctl file does not exists");
  }

  logger.log("info", `checking if daemon is ready  with hcctl ${args}`);

  var spawn = require("child_process").spawn;
  logger.log("info", `Starting ${hcctlExe} with ${args}`);
  var hcctl = spawn(hcctlExe, args, { detached: false, stdio: ["ignore", "pipe", "pipe", "pipe"] });

  hcctl.stdout.on("data", (data) => {
    currentBlockCount = data.toString();
    logger.log("info", data.toString());
    event.returnValue = currentBlockCount;
  });
  hcctl.stderr.on("data", (data) => {
    logger.log("error", data.toString());
    event.returnValue = 0;
  });
});

ipcMain.on("clean-shutdown", () => {
  cleanShutdown();
});

ipcMain.on("app-reload-ui", () => {
  mainWindow.reload();
});

ipcMain.on("grpc-versions-determined", (event, versions) => {
  grpcVersions = { ...grpcVersions, ...versions };
});

ipcMain.on("main-log", (event, ...args) => {
  logger.log(...args);
});

ipcMain.on("get-hcd-logs", (event) => {
  event.returnValue = hcdLogs;
});

ipcMain.on("get-hcwallet-logs", (event) => {
  event.returnValue = hcwalletLogs;
});

ipcMain.on("get-hcgui-logs", (event) => {
  event.returnValue = "HcGui logs!";
});

const AddToLog = (destIO, destLogBuffer, data) => {
  var dataBuffer = Buffer.from(data);
  if (destLogBuffer.length + dataBuffer.length > MAX_LOG_LENGTH) {
    destLogBuffer = destLogBuffer.slice(destLogBuffer.indexOf(os.EOL,dataBuffer.length)+1);
  }
  debug && destIO.write(data);
  return Buffer.concat([destLogBuffer, dataBuffer]);
};

// DecodeDaemonIPCData decodes messages from an IPC message received from hcd/
// hcwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (data, cb) => {
  let i = 0;
  while (i < data.length) {
    if (data[i++] !== 0x01) throw "Wrong protocol version when decoding IPC data";
    const mtypelen = data[i++];
    const mtype = data.slice(i, i+mtypelen).toString("utf-8");
    i += mtypelen;
    const psize = data.readUInt32LE(i);
    i += 4;
    const payload = data.slice(i, i+psize);
    i += psize;
    cb(mtype, payload);
  }
};

const launchHCD = (walletPath, appdata, testnet) => {
  var spawn = require("child_process").spawn;
  let args = [];
  let newConfig = {};
  if(appdata){
    args = [`--appdata=${appdata}`];
    newConfig = readHcdConfig(appdata, testnet);
    newConfig.rpc_cert = path.resolve(appdata, "rpc.cert");
    if (testnet) {
      args.push("--testnet");
    }
  } else {
    args = [`--configfile=${hcdCfg(getWalletPath(testnet, walletPath))}`];
    newConfig = readHcdConfig(getWalletPath(testnet, walletPath), testnet);
    newConfig.rpc_cert = path.resolve(getHcdPath(), "rpc.cert");
  }

  // Check to make sure that the rpcuser and rpcpass were set in the config
  if (!newConfig.rpc_user || !newConfig.rpc_password) {
    const errorMessage =  "No " + `${!newConfig.rpc_user ? "rpcuser " : "" }` + `${!newConfig.rpc_user && !newConfig.rpc_password ? "and " : "" }` + `${!newConfig.rpc_password ? "rpcpass " : "" }` + "set in " + `${appdata ? appdata : getWalletPath(testnet, walletPath)}` + "/hcd.conf.  Please set them and restart.";
    logger.log("error", errorMessage);
    mainWindow.webContents.executeJavaScript("alert(\"" + `${errorMessage}` + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  }

  var hcdExe = getExecutablePath("hcd");
  if (!fs.existsSync(hcdExe)) {
    logger.log("error", "The hcd file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch hcd: " + e);
    }
  }

  logger.log("info", `Starting ${hcdExe} with ${args}`);

  var hcd = spawn(hcdExe, args, {
    detached: os.platform() == "win32",
    stdio: ["ignore", "pipe", "pipe"]
  });

  hcd.on("error", function (err) {
    logger.log("error", "Error running hcd.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running hcd.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  hcd.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0 && require("is-running")(hcdPID)) {
      logger.log("error", "hcd closed due to an error.  Check hcd logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"hcd closed due to an error.  Check hcd logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `hcd exited with code ${code}`);
    }
  });

  hcd.stdout.on("data", (data) => hcdLogs = AddToLog(process.stdout, hcdLogs, data));
  hcd.stderr.on("data", (data) => hcdLogs = AddToLog(process.stderr, hcdLogs, data));

  newConfig.pid = hcd.pid;
  logger.log("info", "hcd started with pid:" + newConfig.pid);

  hcd.unref();
  return newConfig;
};

const launchHCWallet = (walletPath, testnet) => {
  var spawn = require("child_process").spawn;
  var args = ["--configfile=" + hcwalletCfg(getWalletPath(testnet, walletPath))];
  logger.log("info", args);
  const cfg = getWalletCfg(testnet, walletPath);

  args.push("--ticketbuyer.balancetomaintainabsolute=" + cfg.get("balancetomaintain"));
  args.push("--ticketbuyer.maxfee=" + cfg.get("maxfee"));
  args.push("--ticketbuyer.maxpricerelative=" + cfg.get("maxpricerelative"));
  args.push("--ticketbuyer.maxpriceabsolute=" + cfg.get("maxpriceabsolute"));
  args.push("--ticketbuyer.maxperblock=" + cfg.get("maxperblock"));
  var hcwExe = getExecutablePath("hcwallet");
  if (!fs.existsSync(hcwExe)) {
    logger.log("error", "The hcwallet file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      console.log(pipe.readEnd)
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch hcwallet: " + e);
    }
  } else {
    args.push("--rpclistenerevents");
    args.push("--pipetx=4");
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs !== undefined && isString(argv.extrawalletargs)) {
    args = concat(args, stringArgv(argv.extrawalletargs));
  }

  logger.log("info", `Starting ${hcwExe} with ${args}`);

  var hcwallet = spawn(hcwExe, args, {
    detached: os.platform() == "win32",
    stdio: ["ignore", "pipe", "pipe", "ignore", "pipe"]
  });

  const notifyGrpcPort = (port) => {
    hcwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("hcwallet-port", port);
  };

  hcwallet.stdio[4].on("data", (data) => DecodeDaemonIPCData(data, (mtype, payload) => {
    if (mtype === "grpclistener") {
      const intf = payload.toString("utf-8");
      const matches = intf.match(/^.+:(\d+)$/);
      if (matches) {
        notifyGrpcPort(matches[1]);
      } else {
        logger.log("error", "GRPC port not found on IPC channel to hcwallet: " + intf);
      }
    }
  }));

  hcwallet.on("error", function (err) {
    logger.log("error", "Error running hcwallet.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running hcwallet.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  hcwallet.on("close", (code) => {
    if(daemonIsAdvanced)
      return;
    if (code !== 0 && require("is-running")(hcwPID)) { 
      logger.log("error", "hcwallet closed due to an error.  Check hcwallet logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"hcwallet closed due to an error.  Check hcwallet logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `hcwallet exited with code ${code}`);
    }
  });

  const addStdoutToLogListener = (data) => hcwalletLogs = AddToLog(process.stdout, hcwalletLogs, data);

  // waitForGrpcPortListener is added as a stdout on("data") listener only on
  // win32 because so far that's the only way we found to get back the grpc port
  // on that platform. For linux/macOS users, the --pipetx argument is used to
  // provide a pipe back to hcgui, which reads the grpc port in a secure and
  // reliable way.
  const waitForGrpcPortListener = (data) => {
    const matches = /HCW: gRPC server listening on [^ ]+:(\d+)/.exec(data);
    if (matches) {
      notifyGrpcPort(matches[1]);
      // swap the listener since we don't need to keep looking for the port
      hcwallet.stdout.removeListener("data", waitForGrpcPortListener);
      hcwallet.stdout.on("data", addStdoutToLogListener);
    }
    hcwalletLogs = AddToLog(process.stdout, hcwalletLogs, data);
  };

  hcwallet.stdout.on("data", os.platform() == "win32" ? waitForGrpcPortListener : addStdoutToLogListener);
  hcwallet.stderr.on("data", (data) => hcwalletLogs = AddToLog(process.stderr, hcwalletLogs, data));

  hcwPID = hcwallet.pid;
  logger.log("info", "hcwallet started with pid:" + hcwPID);

  hcwallet.unref();
  return hcwPID;
};

const readExesVersion = () => {
  let spawn = require("child_process").spawnSync;
  let args = ["--version"];
  let exes = ["hcd", "hcwallet", "hcctl"];
  let versions = {
    grpc: grpcVersions,
    hcGUI: app.getVersion()
  };

  for (let exe of exes) {
    let exePath = getExecutablePath("hcd");
    if (!fs.existsSync(exePath)) {
      logger.log("error", "The hcd file does not exists");
    }

    let proc = spawn(exePath, args, { encoding: "utf8" });
    if (proc.error) {
      logger.log("error", `Error trying to read version of ${exe}: ${proc.error}`);
      continue;
    }

    let versionLine = proc.stdout.toString();
    if (!versionLine) {
      logger.log("error", `Empty version line when reading version of ${exe}`);
      continue;
    }

    let decodedLine = versionLine.match(/\w+ version ([^\s]+)/);
    if (decodedLine !== null) {
      versions[exe] = decodedLine[1];
    } else {
      logger.log("error", `Unable to decode version line ${versionLine}`);
    }
  }

  return versions;
};

let primaryInstance = !app.makeSingleInstance(function () {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (!primaryInstance) {
  logger.log("error", "Another instance of hcGUI is already running");
}

app.on("ready", async () => {

  // when installing (on first run) locale will be empty. Determine the user's
  // OS locale and set that as hcgui's locale.
  let cfgLocale = globalCfg.get("locale", "");
  let locale = locales.find(value => value.key === cfgLocale);
  if (!locale) {
    let newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    logger.log("error", `Locale ${cfgLocale} not found. Switching to locale ${newCfgLocale}.`);
    globalCfg.set("locale", newCfgLocale);
    locale = locales.find(value => value.key === newCfgLocale);
  }

  let windowOpts = {
    show: false,
    width: 1190,
    height: 800,
    minWidth: 1190,
    minHeight: 800,
    page: "app.html",
  };
  if (!primaryInstance) {
    windowOpts = {show: true, width: 575, height: 275, autoHideMenuBar: true,
      resizable: false, page: "staticPages/secondInstance.html"};
  } else {
    await installExtensions();
  }
  windowOpts.title = "hcGUI - " + app.getVersion();

  mainWindow = new BrowserWindow(windowOpts);
  mainWindow.loadURL(`file://${__dirname}/${windowOpts.page}`);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (versionWin !== null) {
      versionWin.close();
    }
    if (!primaryInstance) {
      app.quit();
      setTimeout(() => { app.quit(); }, 2000);
    }
  });

  if (!primaryInstance) {
    logger.log("error", "stopping ready");
    return;
  }

  if (process.env.NODE_ENV === "development") mainWindow.openDevTools();

  mainWindow.webContents.on("context-menu", (e, props) => {
    const { selectionText, isEditable, x, y } = props;
    let inputMenu = [
      {role: "cut"},
      {role: "copy"},
      {role: "paste"},
      {type: "separator"},
      {role: "selectall"}
    ];
    let selectionMenu = [
      {role: "copy"},
      {type: "separator"},
      {role: "selectall"}
    ];
    if (process.env.NODE_ENV === "development") {
      let inspectElement = {
        label: "Inspect element",
        click: () => mainWindow.inspectElement(x, y)
      };
      inputMenu.push(inspectElement);
      selectionMenu.push(inspectElement);
    }
    if (isEditable) {
      Menu.buildFromTemplate(inputMenu).popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== "") {
      Menu.buildFromTemplate(selectionMenu).popup(mainWindow);
    } else if (process.env.NODE_ENV === "development") {
      Menu.buildFromTemplate([{
        label: "Inspect element",
        click: () => mainWindow.inspectElement(x, y)
      }]).popup(mainWindow);
    }
  });

  if (!primaryInstance) return;

  if (process.platform === "darwin") {
    template = [{
      label: locale.messages["appMenu.hcgui"],
      submenu: [{
        label: locale.messages["appMenu.aboutHcgui"],
        selector: "orderFrontStandardAboutPanel:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.services"],
        submenu: []
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.hideHcgui"],
        accelerator: "Command+H",
        selector: "hide:"
      }, {
        label: locale.messages["appMenu.hideOthers"],
        accelerator: "Command+Shift+H",
        selector: "hideOtherApplications:"
      }, {
        label: locale.messages["appMenu.showAll"],
        selector: "unhideAllApplications:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.quit"],
        accelerator: "Command+Q",
        click() {
          cleanShutdown();
        }
      }]
    }, {
      label: locale.messages["appMenu.edit"],
      submenu: [{
        label: locale.messages["appMenu.undo"],
        accelerator: "Command+Z",
        selector: "undo:"
      }, {
        label: locale.messages["appMenu.redo"],
        accelerator: "Shift+Command+Z",
        selector: "redo:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.cut"],
        accelerator: "Command+X",
        selector: "cut:"
      }, {
        label: locale.messages["appMenu.copy"],
        accelerator: "Command+C",
        selector: "copy:"
      }, {
        label: locale.messages["appMenu.paste"],
        accelerator: "Command+V",
        selector: "paste:"
      }, {
        label: locale.messages["appMenu.selectAll"],
        accelerator: "Command+A",
        selector: "selectAll:"
      }]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [{
        label: "Toggle Full Screen",
        accelerator: "Ctrl+Command+F",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: locale.messages["appMenu.window"],
      submenu: [{
        label: locale.messages["appMenu.minimize"],
        accelerator: "Command+M",
        selector: "performMiniaturize:"
      }, {
        label: locale.messages["appMenu.close"],
        accelerator: "Command+W",
        selector: "performClose:"
      }, {
        type: "separator"
      }, {
        label: locale.messages["appMenu.bringAllFront"],
        selector: "arrangeInFront:"
      }]
    }];
  } else {
    template = [{
      label: locale.messages["appMenu.file"],
      submenu: [{
        label:  locale.messages["appMenu.close"],
        accelerator: "Ctrl+W",
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: locale.messages["appMenu.view"],
      submenu: [{
        label: locale.messages["appMenu.toggleFullScreen"],
        accelerator: "F11",
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      }, {
        label: locale.messages["appMenu.reloadUI"],
        accelerator: "F5",
        click() {
          mainWindow.webContents.send("app-reload-requested", mainWindow);
        },
      }]
    }];
  }
  template.push(
    {
      label: locale.messages["appMenu.advanced"],
      submenu: [{
        label: locale.messages["appMenu.developerTools"],
        accelerator: "Alt+Ctrl+I",
        click() {
          mainWindow.toggleDevTools();
        }
      }, {
        label: locale.messages["appMenu.showWalletLog"],
        click() {
          shell.openItem(path.join(appDataDirectory(), "hcGUI.log"));
        }
      }, {
        label: locale.messages["appMenu.showDaemonLog"],
        click() {
          shell.openItem(path.join(getHcdPath(), "logs"));
        }
      }]
    }, {
      label: locale.messages["appMenu.help"],
      submenu: [{
        label: locale.messages["appMenu.learnMore"],
        click() {
          shell.openExternal("http://wiki.h.cash/");
        }
      },
      // {
      //   label: locale.messages["appMenu.documentation"],
      //   click() {
      //     shell.openExternal("https://github.com/HcashOrg/hcGUI");
      //   }
      // }, {
      //   label: locale.messages["appMenu.communityDiscussions"],
      //   click() {
      //     shell.openExternal("https://forum.h.cash");
      //   }
      // }, {
      //   label: locale.messages["appMenu.searchIssues"],
      //   click() {
      //     shell.openExternal("https://github.com/HcashOrg/hcGUI/issues");
      //   }
      // }, {
      //   label: locale.messages["appMenu.about"],
      //   click() {
      //     if (!versionWin) {
      //       versionWin = new BrowserWindow({ width: 575, height: 275, show: false, autoHideMenuBar: true, resizable: false });
      //       versionWin.on("closed", () => {
      //         versionWin = null;
      //       });
      //
      //       // Load a remote URL
      //       versionWin.loadURL(`file://${__dirname}/staticPages/version.html`);
      //
      //       versionWin.once("ready-to-show", () => {
      //         versionWin.webContents.send("exes-versions", readExesVersion());
      //         versionWin.show();
      //       });
      //     }
      //   }
      // }
    ]
    });
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("before-quit", (event) => {
  logger.log("info","Caught before-quit. Set hcGUI as was closed");
  event.preventDefault();
  cleanShutdown();
  setMustOpenForm(true);
  clearPreviousWallet();
  app.exit(0);
});
