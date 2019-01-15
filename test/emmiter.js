import protobuf from 'protobufjs';
import MsgMap from '../src/app/proto_map.json';
import { POLLING_MESSAGE_C2S, POLLING_MESSAGE_S2C, PUSH_NOTIFICATIONS_S2C, ERROR_NOT_LOGIN_S2C } from '../src/app/proto_enum.js';

var MsgEmitter = {};
MsgEmitter.emit = (socket, sentMsgId, bufJson, callback = null, args = []) => {
    let id_head = Math.floor(sentMsgId / 100);
    let bufType = MsgMap.head[id_head];
    let bufFile = bufType + "_" + id_head + '.proto';
    let fileDir = new Object();
    fileDir = {
        "root": "./src/www/web_core/",
        "file": bufFile
    };
    if (bufType === undefined || sentMsgId === undefined) {
        return;
    }

    let bufMsg = MsgMap[bufType][sentMsgId];
    let protobufSentMsg = protobuf.loadProtoFile(fileDir).build()[bufMsg];
    let sMsg = new protobufSentMsg();
    if (bufJson !== {}) {
        for (let key in bufJson) {
            sMsg.set(key, bufJson[key]);
        }
    }
    var protoBuffer = sMsg.encode().toBuffer();
    
    // let dataview = new DataView(protoBuffer);
    let contentBuffer = new Uint8Array(protoBuffer.byteLength);

    let arrayBuffer = new ArrayBuffer(2 + contentBuffer.length);
    var sentBuffer = new Buffer(arrayBuffer);
    //msg head
    sentBuffer[0] = sentMsgId % 256;
    sentBuffer[1] = Math.floor(sentMsgId / 256);
    //msg content
    sentBuffer += protoBuffer;
    // for (let i = 0; i < contentBuffer.length; i++) {
        // contentBuffer[i] = dataview.getUint8(i);
        // sentBuffer[i + 2] = contentBuffer[i];
    // }
    socket.onmessage = (event) => {
        var data = event.data;
        var reader = new FileReader();
        reader.onload = function (e) {

            var result = e.target.result;
            var dataview = new DataView(result);
            var recieveBuffer = new Uint8Array(result.byteLength);

            for (var i = 0; i < recieveBuffer.length; i++) {
                recieveBuffer[i] = dataview.getUint8(i);
            };

            var recieveMsgId = recieveBuffer[1] * 256 + recieveBuffer[0];
            var head = Math.floor(recieveMsgId / 100);

            var rMsg = recieveBuffer.slice(2, recieveBuffer.length);
            var file = MsgMap.head[head] + '_' + head + '.proto';
            var msgName = MsgMap[MsgMap.head[head]][recieveMsgId];
            let fileDir = new Object();
            fileDir = {
                "root": window.proto_dir,
                "file": file
            };
            var protobufRecieveMsg = window[fileDir.file][MsgMap[MsgMap.head[head]][recieveMsgId]];

            var message = protobufRecieveMsg.decode(rMsg);
            if (recieveMsgId === ERROR_NOT_LOGIN_S2C) {
                let e = new Event("app_log_out");
                dispatchEvent(e);
            }
            if (recieveMsgId === PUSH_NOTIFICATIONS_S2C) {
            }
            if (recieveMsgId !== POLLING_MESSAGE_S2C) {
                let e = new Event("dataOnload");
                dispatchEvent(e);
            }
            // 收到错误码为9999的说明连接的用户已经从服务端的socket列表删去
            if (typeof (callback) === "function") {
                callback(recieveMsgId, message, args);
            }
        }

        reader.readAsArrayBuffer(data);
    };
    socket.send(sentBuffer);
};

export default MsgEmitter;


