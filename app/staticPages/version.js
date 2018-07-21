
let ipcRenderer = require("electron").ipcRenderer;
ipcRenderer.on("exes-versions", function (event, versions) {
  document.getElementById("hcguiVersion").innerHTML = versions["hcgui"];
  document.getElementById("hcdVersion").innerHTML = versions["hcd"];
  document.getElementById("hcwalletVersion").innerHTML = versions["hcwallet"];
  document.getElementById("walletGrpcVersion").innerHTML = versions["grpc"]["walletVersion"];
  document.getElementById("requiredWalletGrpcVersion").innerHTML = versions["grpc"]["requiredVersion"];
});
