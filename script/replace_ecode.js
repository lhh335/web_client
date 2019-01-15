var fs = require('fs');

var Replace = {
    0: "LOGIC_SUCCESS",
    11000: "ERROR_DESK_NOT_EXIST",
    11001: "ERROR_DESK_ALREADY_EXIST",
    11002: "LOGIN_PLEASE",
    11003: "NO_PERMISSION",
    11004: "DELETE_ERROR",
    11005: "ACCOUNT_FROZEN",
    11006: "ERROR_RMB",
    11007: "DESK_ALREADY_OPEN",
    11008: "DESK_ALREADY_CLOSED",
    11009: "ERROR_RECHARGE_INVALID",
    11010: "ERROR_EXCHANGE_INVALID",
    11011: "ERROR_HAVE_NO_MORE_PAGES",
    11012: "ERROR_ITS_FIRST_PAGE",
    11013: "ERROR_ORDER_HAD_SOLVE",
    11014: "ERROR_EXCHANGE_HAD_SOLVE",
    11015: "ERROR_PROMOTER_GAME_COIN_NOT_ENOUGH",
    11016: "KEY_ALREADY_EXIST",
    11017: "KEY_NOT_EXIST",
    11018: "HALL_ALREADY_EXIST",
    11019: "HALL_NOT_EXIST",
    11020: "ACCOUNT_INVALID",
    11021: "ERROR_VERIFICATION",
    11022: "ERROR_SESSION",
    11023: "TRY_TOO_MANY_TIMES",
    11024: "PLAYER_IS_PLAYING",
    11025: "ALREADY_MAX_DESK",
    11026: "TRADE_EXCEED_LIMIT",
    11027: "LOGIN_ANOTHER_PLACE",
    11028: "ERROR_HEAD_ILLEGAL",
    11029: "ERROR_SEX_ILLEGAL",
    11030: "ERROR_LEVEL_ILLEGAL",
    11031: "HALL_FORBID_CANT_OPEN",
    11032: "CLOSE_SERVER_FAILED",
    11033: "PLAYER_OVERFLOW_BIG_BANG",
    11034: "INVALID_BIG_BANG_VALUE",
    10014: "ERROR_GAME_COIN_NOT_ENOUGH",
    10020: "ERROR_PASSWORD_NOT_SAME",
    10021: "ERROR_HAVE_ACCOUNT",
    10022: "ERROR_RECOMMEND_EMPTY",
    10023: "ERROR_ACCOUNT_NOT_EXIST",
    10024: "ERROR_PASSWORD",
    10025: "ERROR_ORDER_ID_NOT_EXIST",
    10026: "ERROR_LAST_RECHARGE_NOT_APPROVE",
    10027: "ERROR_EXCHANGE_ID_NOT_EXIST",
    10028: "ERROR_LAST_EXCHANGE_NOT_APPROVE",
    10029: "ERROR_ACCOUNT_LENGTH",
    10030: "ERROR_ACCOUNT_ILLEGAL",
    10031: "ERROR_NAME_ILLEGAL",
    10032: "ERROR_PASSWORD_LENGTH",
    10033: "ERROR_PASSWORD_ILLEGAL",
    10037: "ERROR_CLOSE_DESK_HAVE_PLAYER",
    10047: "ERROR_CLOSE_DESK",
    10070: "ERROR_MOBILE_PHONE_NO_ILLEGAL",
    10074: "ERROR_RECOMMEND_NOT_EXIST",
    99005: "NOT_ANY_MORE_DATA",
    99006: "ERROR_SELECTED_TIME",
    99007: "ERROR_NULL_ACCOUNT",
    99008: "ERROR_NETWORK",
    99009: "NOT_ANY_MORE_RECORD",
    99010: "ERROR_NOT_ENOUGH_PLAYER_COIN",
    99011: "ERROR_NOT_ENOUGH_PROMOTER_COIN",
    99012: "ERROR_INPUT_RMB",
    99013: "ERROR_INPUT_COIN",
    99014: "ERROR_INVALID_NUMBER",
    99015: "ERROR_INCLUDE_RUNE",
    99016: "ERROR_NULL_GOOGLE_AUTH",
    99017: "ERROR_INPUT_DATA_FORMAT",
    99018: "ERROR_ENSURE_SERVER_RUNNING",
    99019: "ERROR_DESK_NAME_TOO_LANG",
    99020: "ERROR_CANNON_BEYOND_LIMIT",
    99021: "ERROR_INPUT_NUMBER",
    99022: "ERROR_BEYOND_MAX_ONCE_TRADE"
}

// const files_dir = "../src/app/components/pages/";
const files_dir = "../src/app/components";

var file_total = 0;
var fix_total = 0;

var digFileDir = (dir) => {
    fs.readdir(dir, function (err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function (item) {
            if (item.includes(".js")) {
                fs.readFile(dir + "/" + item, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    var fromIndex = 0;
                    var dataString = "";
                    var protos = "";
                    if (data.includes(".emit(")) {

                        dataString = data.toString();
                        protos = "";

                        fromIndex = 0;
                        while (fromIndex < dataString.length) {
                            // var string_index = dataString.indexOf("", fromIndex + 5);
                            // fromIndex = string_index;
                            // if (fromIndex === -1) {
                            //     break;
                            // }
                            var id = dataString.slice(fromIndex, fromIndex + 5);
                            if (Replace[id] !== undefined) {
                                dataString = dataString.replace(id, Replace[id]);
                                if (!protos.includes(Replace[id])) {
                                    protos += Replace[id] + ","
                                }
                            }
                            fromIndex++
                        }

                        var newFile = "import {" + protos + "} from \"../../../../ecode_enum\";\r\n" + dataString;

                        fs.writeFile(dir + "/" + item, newFile, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }


                });
              

            } else {
                digFileDir(dir + "/" + item);
            }


        });
    });
}

digFileDir(files_dir);