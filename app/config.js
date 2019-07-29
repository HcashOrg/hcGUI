import fs from "fs";
import path from "path";
import os from "os";
import { stakePoolInfo } from "./middleware/stakepoolapi";
import Store from "electron-store";
import ini from "ini";

export function getGlobalCfg() {
  const config = new Store();
  return (config);
}

export function getWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletCfgPath(testnet, walletPath) });
  return (config);
}

export function initWalletCfg(testnet, walletPath) {
  const config = new Store({ cwd: getWalletCfgPath(testnet, walletPath) });
  if (!config.has("wallet_start_advanced")) {
    config.set("wallet_start_advanced", false);
  }
  if (!config.has("enableticketbuyer")) {
    config.set("enableticketbuyer", "0");
  }
  if (!config.has("balancetomaintain")) {
    config.set("balancetomaintain", "0");
  }
  if (!config.has("maxfee")) {
    config.set("maxfee", "0.1");
  }
  if (!config.has("maxpricerelative")) {
    config.set("maxpricerelative", "100");
  }
  if (!config.has("maxpriceabsolute")) {
    config.set("maxpriceabsolute", "0");
  }
  if (!config.has("maxperblock")) {
    config.set("maxperblock", "5");
  }
  if (!config.has("currency_display")) {
    config.set("currency_display", "Hc");
  }
  if (!config.has("hiddenaccounts")) {
    var hiddenAccounts = Array();
    config.set("hiddenaccounts", hiddenAccounts);
  }
  if (!config.has("discoveraccounts")) {
    config.set("discoveraccounts", true);
  }
  if (!config.has("remote_credentials")) {
    const credentialKeys = {
      rpc_user: "",
      rpc_password: "",
      rpc_cert: "",
      rpc_host: "",
      rpc_port: "",
    };
    config.set("remote_credentials", credentialKeys);
  }
  if (!config.has("appdata_path")) {
    config.set("appdata_path", "");
  }
  if (!config.has("autonomy_last_access_time")) {
    config.set("autonomy_last_access_time", 0);
  }
  if (!config.has("autonomy_last_access_block")) {
    config.set("autonomy_last_access_block", 0);
  }

  stakePoolInfo(testnet, function (foundStakePoolConfigs) {
    if (foundStakePoolConfigs !== null) {
      updateStakePoolConfig(config, foundStakePoolConfigs);
    }
  });
  return (config);
}

export function initGlobalCfg() {
  const config = new Store();
  if (!config.has("daemon_start_advanced")) {
    config.set("daemon_start_advanced", false);
  }
  if (!config.has("must_open_form")) {
    config.set("must_open_form", true);
  }
  if (!config.has("locale")) {
    config.set("locale", "");
  }
  if (!config.has("timezone")) {
    config.set("timezone", "local");
  }
  return (config);
}

export function getGlobalCfgPath() {
  return path.resolve(appDataDirectory(), "config.json");
}

export function getWalletCfgPath(testnet, wallet) {
  return path.resolve(path.join(appDataDirectory(), "wallets", testnet ? "testnet" : "mainnet", wallet));
}

export function validateGlobalCfgFile() {
  var fileContents;
  try {
    fileContents = fs.readFileSync(getGlobalCfgPath(), "utf8");
  }
  catch (err) {
    return null;
  }

  try {
    JSON.parse(fileContents);
  }
  catch (err) {
    console.error(err);
    return err;
  }

  return null;
}

// In all the functions below the Windows path is constructed based on
// os.homedir() rather than using process.env.LOCALAPPDATA because in my tests
// that was available when using the standalone node but not there when using
// electron in production mode.
export function appDataDirectory() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "hcGUI");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "hcGUI");
  } else {
    return path.join(os.homedir(), ".config", "hcGUI");
  }
}

export function getHcdPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Hcd");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Hcd");
  } else {
    return path.join(os.homedir(), ".hcd");
  }
}

export function getWalletPath(testnet, walletPath) {
  return path.join(appDataDirectory(), "wallets", testnet ? "testnet" : "mainnet", walletPath);
}

export function getWalletCert(certPath) {
  var cert;
  certPath = path.resolve(certPath, "rpc.cert");
  try {
    cert = fs.readFileSync(certPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(certPath + " does not exist");
    } else if (err.code === "EACCES") {
      console.log(certPath + " permission denied");
    } else {
      console.error(certPath + " " + err);
    }
  }

  return (cert);
}

export function readHcdConfig(configPath, testnet) {
  try {
    if (!fs.existsSync(hcdCfg(configPath))) return;
    const readCfg = ini.parse(Buffer.from(fs.readFileSync(hcdCfg(configPath))).toString());
    let newCfg = {};
    newCfg.rpc_host = "127.0.0.1";
    if (testnet) {
      newCfg.rpc_port = "12008";
    } else {
      newCfg.rpc_port = "9109";
    }
    let userFound, passFound = false;
    // Look through all top level config entries
    for (let [key, value] of Object.entries(readCfg)) {
      if (key == "rpcuser") {
        newCfg.rpc_user = value;
        userFound = true;
      }
      if (key == "rpcpass") {
        newCfg.rpc_password = value;
        passFound = true;
      }
      if (key == "rpclisten") {
        const splitListen = value.split(":");
        if (splitListen.length >= 2) {
          newCfg.rpc_host = splitListen[0];
          newCfg.rpc_port = splitListen[1];
        }
      }
      if (!userFound && !passFound) {
        // If user and pass aren't found on the top level, look through all
        // next level config entries
        for (let [key2, value2] of Object.entries(value)) {
          if (key2 == "rpcuser") {
            newCfg.rpc_user = value2;
            userFound = true;
          }
          if (key2 == "rpcpass") {
            newCfg.rpc_password = value2;
            passFound = true;
          }
          if (key2 == "rpclisten") {
            const splitListen = value2.split(":");
            if (splitListen.length >= 2) {
              newCfg.rpc_host = splitListen[0];
              newCfg.rpc_port = splitListen[1];
            }
          }
        }
      }
    }
    return newCfg;
  } catch (err) {
    console.error(err);
  }
}

export function getHcdCert(hcdCertPath) {
  if (hcdCertPath)
    if (fs.existsSync(hcdCertPath))
      return fs.readFileSync(hcdCertPath);

  var certPath = "";
  if (os.platform() == "win32") {
    certPath = path.join(os.homedir(), "AppData", "Local", "Hcd", "rpc.cert");
  } else if (os.platform() == "darwin") {
    certPath = path.join(os.homedir(), "Library", "Application Support",
      "Hcd", "rpc.cert");
  } else {
    certPath = path.join(os.homedir(), ".hcd", "rpc.cert");
  }

  var cert = fs.readFileSync(certPath);
  return (cert);
}

export function updateStakePoolConfig(config, foundStakePoolConfigs) {
  var currentStakePoolConfigs = config.has("stakepools") && Array.isArray(config.get("stakepools"))
    ? config.get("stakepools")
    : [];

  var currentConfigsByHost = currentStakePoolConfigs.reduce((l, s) => {
    l[s.Host] = s;
    return l;
  }, {});

  if (foundStakePoolConfigs !== null) {
    let newStakePoolConfigs = foundStakePoolConfigs.map(s => {
      const current = currentConfigsByHost[s.Host];
      delete currentConfigsByHost[s.Host];
      return current ? { ...current, ...s } : s;
    });
    Object.keys(currentConfigsByHost)
      .forEach(v => newStakePoolConfigs.push(currentConfigsByHost[v]));
    config.set("stakepools", newStakePoolConfigs);
  }
}

export function getAppdataPath(testnet, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
  return config.get("appdata_path");
}

export function setAppdataPath(testnet, appdataPath, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
  const credentialKeys = {
    rpc_user: "",
    rpc_password: "",
    rpc_cert: "",
    rpc_host: "",
    rpc_port: "",
  };
  config.set("remote_credentials", credentialKeys);
  return config.set("appdata_path", appdataPath);
}

export function getRemoteCredentials(testnet, walletPath) {
  const config = getWalletCfg(testnet, walletPath);
  return config.get("remote_credentials");
}

export function setRemoteCredentials(testnet, walletPath, key, value) {
  const config = getWalletCfg(testnet, walletPath);
  config.set("appdata_path", "");
  let credentials = config.get("remote_credentials");
  credentials[key] = value;
  return config.set("remote_credentials", credentials);
}

export function setMustOpenForm(openForm) {
  const config = getGlobalCfg();
  return config.set("must_open_form", openForm);
}

export function clearPreviousWallet() {
  const config = getGlobalCfg();
  return config.set("previouswallet", null);
}

export function newWalletConfigCreation(testnet, walletPath) {
  // TODO: set random user/password
  var hcdConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpclisten: "127.0.0.1:9678",
      testnet: testnet ? "1" : "0",
      addrindex: 1,
      txindex: 1
    }
  };
  fs.writeFileSync(hcdCfg(getWalletPath(testnet, walletPath)), ini.stringify(hcdConf));
  var hcctlConf = {
    "Application Options":
    {
      rpcuser: "USER",
      rpcpass: "PASSWORD",
      rpcserver: "127.0.0.1:9678",
      testnet: testnet ? "1" : "0"
    }
  };
  fs.writeFileSync(hcctlCfg(getWalletPath(testnet, walletPath)), ini.stringify(hcctlConf));
  //nolegacyrpc: "1",
  var hcwConf = {
    "Application Options":
    {
      tlscurve: "P-256",
      noinitialload: "1",
      onetimetlskey: "1",
      grpclisten: "127.0.0.1:0",
      appdata: getWalletPath(testnet, walletPath),
      testnet: testnet ? "1" : "0",
      username: rpcOptions.username,
      password: rpcOptions.password,
      enableaivoting:false
    },
  };
  fs.writeFileSync(hcwalletCfg(getWalletPath(testnet, walletPath)), ini.stringify(hcwConf));
}
export function hcctlCfg(configPath) {
  return path.resolve(configPath, "hcctl.conf");
}

export function hcdCfg(configPath) {
  return path.resolve(configPath, "hcd.conf");
}

export function hcwalletCfg(configPath) {
  return path.resolve(configPath, "hcwallet.conf");
}

export const rpcOptions = {
  username: "admin",
  password: "123",
  jsonrpc: "1.0",
  id: 1,
  port: function (isTestNet) {
    return isTestNet ? 12010 : 14010;
  }
}

export const httpOptions = {
  hcDataApiURL: {
    TESTNET: "https://testnet-data.h.cash/api",
    MAINNET: "https://data.h.cash/api"
  },
  autonomyURL: {
    TESTNET: "https://testnet-autonomy.h.cash",
    MAINNET: "https://autonomy.h.cash"
  }
}

export const dataRefreshVersion = "0002.0001.0004";

export const TEST_ECO_PROPERTY = parseInt("0x80000003UL");

export const currentVersion = "RC2.2.2beta";

export const githubConfig = {
  dataURL: "https://raw.githubusercontent.com/HcashOrg/hcGUI/master/dataConfig.json",
}
