var fs = require('fs');

var execSync = require('child_process').execSync;

var protobuf = require('protobufjs');


const proto_dir = "../src/www/web_core/"
const web_proto = [
    'mosaic_94.proto',
    'server_95.proto',
    'statistics_96.proto',
    'trade_97.proto',
    'config_98.proto',
    'user_99.proto',
];
var code = {
    'mosaic_94.proto': "94",
    "server_95.proto": "95",
    "statistics_96.proto": "96",
    "trade_97.proto": "97",
    "config_98.proto": "98",
    "user_99.proto": "99"
}


var fileDir = new Object();

// fs.readdir(proto_dir, function (err, files) {
//     if (err) {
//         return console.error(err);
//     }
//     files.forEach(function (file) {
//         console.log(file);
//     });
// });


/**
 * 协议号不能被读入
 */
// for (var i = 0; i < web_proto.length; i++) {
//     fileDir = {
//         "root": proto_dir,
//         "file": web_proto[i]
//     };

//     var protos = protobuf.loadProtoFile(fileDir).build();
//     console.log(protos);
// }

// 生成proto_map 与 proto_const

const map_dir = '../src/app/proto_map.json';
const enum_dir = '../src/app/proto_enum.js';
const const_dir = './const.js';
const const_dir2 = './const2.js';
const test_dir = './test.json';

var proto_list = [];
var proto_obj = {
    "head": {
        "10": "hall",
        "94": "mosaic",
        "95": "server",
        "96": "statistics",
        "97": "trade",
        "98": "config",
        "99": "user"
    },
    "hall": {
        "1038": "special_error_s2c"
    },
}
// 协议枚举文件内容
var proto_enum_content = "";
var proto_enum_content2 = "";
// 重置源码中所用的index为常量字符串
var replace_use = {};

// 生成 文件
var genFile = async function () {
    web_proto.map((key) => {
        // 读取文件
        fs.readFile(proto_dir + key, function (err, data) {
            if (err) {
                return console.error(err);
            }

            var fileContent = data.toString();

            // 解析文件
            var analysisFile = async function (list) {
                var list2 = [];
                var obj = {};
                var temObj = {};
                var proto_index, proto_name;
                list.map((item) => {

                    if (item.includes("msg_id=") && item.includes("message")) {
                        list2 = item.split("\r\n");
                        proto_index = code[key] + list2[0].replace("msg_id=", "").replace("cowboy", "").replace(" hall_10_pb", "").replace(/ /g, "");
                        proto_name = list2[1].replace("message", "").replace("{", "").replace(/ /g, "");
                        temObj[proto_index] = proto_name;
                        Object.assign(obj, temObj);
                        proto_enum_content += "export const " + proto_name.toUpperCase() + " = " + proto_index + ";\r\n";
                        proto_enum_content2 += "-define(" + proto_name.toUpperCase() + ", " + proto_index + ").\r\n";
                    }
                })
                var protoObj = {};
                protoObj[proto_obj["head"][code[key]]] = obj;
                Object.assign(proto_obj, protoObj);

                Object.assign(replace_use, obj);
                // 写入文件
                var writeFile = async function (protoObj, replace_use) {
                    fs.writeFile(map_dir, JSON.stringify(protoObj), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    fs.writeFile(enum_dir, proto_enum_content, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    fs.writeFile(const_dir2, proto_enum_content2, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                    fs.writeFile("./replace_use.js", JSON.stringify(replace_use), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
                writeFile(proto_obj, replace_use);
            };

            analysisFile(fileContent.split("\r\n//"));

        });
    })

}

genFile();






