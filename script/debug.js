var fs = require('fs');
var execSync = require('child_process').execSync;

var version_commond = "git rev-list HEAD --abbrev-commit --max-count=1";

var configJson = "./script/config.json";

var targetConfigFile = "./src/www/config.json";


const web_socket = "wss://127.0.0.1:8000/websocket";


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


function writeConfig(version) {
  configs = JSON.parse(fs.readFileSync(configJson, 'utf8'));
  configs.web_version = version;
  configs.web_socket_sever = web_socket;
  configs.release = true;
  configs.Lang = "Chin";
  var writeString = "var config = " + JSON.stringify(configs) + ";";
  fs.writeFileSync(targetConfigFile, writeString, 'utf8');
}


var web_version = execReturn(version_commond).replace("\n", "");

writeConfig(web_version);

execho("npm start");