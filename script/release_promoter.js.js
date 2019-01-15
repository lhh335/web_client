var fs = require('fs');
var execSync = require('child_process').execSync;

var version_commond = "git rev-list HEAD --abbrev-commit --max-count=1";


var configFile = "./src/www/config.json";


const web_socket = "wss://ubuntu-release.curtasoft.org:8000/websocket";


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
  var configs = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  configs.web_version = version;
  configs.web_socket_sever = web_socket;
  configs.at = 1;
  fs.writeFileSync(configFile, JSON.stringify(configs), 'utf8');
}


var web_version = execReturn(version_commond).replace("\n", "");

writeConfig(web_version);

execho("npm run build");