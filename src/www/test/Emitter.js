import protobuf from 'protobufjs';
import MsgMap from './proto_test.json';

var MsgEmitter = {};
MsgEmitter.emit = (sentMsgId, bufFile2, bufMsg, bufJson, callback = null, args = []) => {
    if (sentMsgId <= 0) {
        return;
    }
    let id_head = Math.floor(sentMsgId / 100);
    let bufType = MsgMap.head[id_head];
    let bufFile = bufType + "_" + id_head + '.proto';   /*协议*/
    let fileDir = new Object();
    fileDir = {
        "root": window.proto_dir,
        "file": bufFile
    }; 
    let protobufSentMsg = protobuf.loadProtoFile(fileDir).build()[bufMsg];
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

    //返回数据解析
    window.socket.onmessage = (event) => {
        var data = event.data;
        var reader = new FileReader();
        reader.addEventListener("loadend", function (e) {
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
            var protobufRecieveMsg = protobuf.loadProtoFile("../web_core/" + MsgMap.head[head] + '_' + head + '.proto').build()[MsgMap[MsgMap.head[head]][recieveMsgId]];

            var message = protobufRecieveMsg.decode(rMsg);
            if (typeof (callback) === "function") {
                // 收到错误码为9999的说明连接的用户已经从服务端的socket列表删去
                if (message.code === 9999) {
                    let e = new Event("app_log_out");
                    dispatchEvent(e)
                }
                callback(recieveMsgId, message, args);
            }
        })

        reader.readAsArrayBuffer(data);
    };
    if (window.socket && window.socket.readyState === 1) {
        window.socket.send(sentBuffer);
        return true;
    } else {
        document.addEventListener("socket_connect", () => {
            window.socket.send(sentBuffer);
        });
        return false;
    }
};

MsgEmitter.unmount = () => {
    // TODO 按照callback 来处理
    window.socket.onmessage = null;
};
export default MsgEmitter;


