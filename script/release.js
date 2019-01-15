var fs = require('fs');
var execSync = require('child_process').execSync;

var version_commond = "git rev-list HEAD --abbrev-commit --max-count=1";

var appConfig = "./src/app/config.json";
var configJson = "./script/config.json";

var targetConfigFile = "./src/www/config.js";

const web_socket = "wss://s01.xlyx.io:8000/websocket";


// Exec with echo
function execho(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(error.output[1]);
    process.exit(error.status);
  }
}

// Exec with return value or error
function execReturn(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(error.output[1]);
    process.exit(error.status);
  }
}

function writeAppConfig(version) {
  configs = JSON.parse(fs.readFileSync(appConfig, 'utf8'));
  configs.web_version = version;
  fs.writeFileSync(appConfig, JSON.stringify(configs), 'utf8');
}

function writeConfig(version) {
  configs = JSON.parse(fs.readFileSync(configJson, 'utf8'));
  configs.web_socket_sever = web_socket;
  configs.Lang = "Chin";
  var writeString = "var config = " + JSON.stringify(configs) + ";";
  fs.writeFileSync(targetConfigFile, writeString, 'utf8');
}


var web_version = execReturn(version_commond).replace("\n", "");

writeAppConfig(web_version);
// writeConfig();

execho("npm run build");