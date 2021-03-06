import protobuf from 'protobufjs';
import MsgMap from './proto_map.json';
import { POLLING_MESSAGE_C2S, POLLING_MESSAGE_S2C, PUSH_NOTIFICATIONS_S2C, ERROR_NOT_LOGIN_S2C } from './proto_enum.js';

var MsgEmitter = {};
MsgEmitter.emit = (sentMsgId, bufJson, callback = null, args = []) => {
    if (!window.socket && sentMsgId <= 0) {
        return;
    }
    let id_head = Math.floor(sentMsgId / 100);
    let bufType = MsgMap.head[id_head];
    let bufFile = bufType + "_" + id_head + '.proto';
    let fileDir = new Object();
    fileDir = {
        "root": window.proto_dir,
        "file": bufFile
    };
    if (bufType === undefined || sentMsgId === undefined) {
        return;
    }

    let bufMsg = MsgMap[bufType][sentMsgId];
    if (window[fileDir.file] === undefined) {
        window[fileDir.file] = protobuf.loadProtoFile(fileDir).build();
    }
    let protobufSentMsg = window[fileDir.file][bufMsg];
    let sMsg = new protobufSentMsg();
    if (bufJson !== {}) {
        for (let key in bufJson) {
            sMsg.set(key, bufJson[key]);
        }
    }
    var protoBuffer = sMsg.encode().toBuffer();

    let dataview = new DataView(protoBuffer);
    let contentBuffer = new Uint8Array(protoBuffer.byteLength);

    let arrayBuffer = new ArrayBuffer(2 + contentBuffer.length);
    var sentBuffer = new Buffer(arrayBuffer);
    //msg head
    sentBuffer[0] = sentMsgId % 256;
    sentBuffer[1] = Math.floor(sentMsgId / 256);
    //msg content

    for (let i = 0; i < contentBuffer.length; i++) {
        contentBuffer[i] = dataview.getUint8(i);
        sentBuffer[i + 2] = contentBuffer[i];
    }
    if (window.socket === undefined) {
        return;
    }
    //返回数据解析
    window.socket.onmessage = (event) => {
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
                switch (JSON.parse(message.msg).type) {
                    case "profit_exceed_80per":
                        let e = new Event("profit_exceed_80per");
                        e.msg = message;
                        dispatchEvent(e);
                        break;
                }
                return;
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
    if (window.socket && window.socket.readyState === 1) {
        window.socket.send(sentBuffer);
        if (sentMsgId !== POLLING_MESSAGE_C2S) {
            let e = new Event("loading");
            dispatchEvent(e);
        }
        return true;
    } else {
        addEventListener("socket_connect", () => {
            MsgEmitter.emit(sentMsgId, bufJson, callback, args);
        });
        return false;
    }
};

MsgEmitter.unmount = () => {
    // TODO 按照callback 来处理
    window.socket.onmessage = null;
};
export default MsgEmitter;


