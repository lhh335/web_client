import React, { Component } from 'react';
import Title from 'react-title-component';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import MsgEmitter from './Emitter';
// import MarkdownElement from '../MarkdownElement';
import MsgMap from './proto_test.json';


const loginJson = '{account: "tishoy", name: "hello"}';

const ProtocolPage = {
    send_button: "发送",
    select_proto: "选择协议文件",
    select_msg: "选择要发送的协议",
    input_detail: "请以json格式在文本中输入参数，如果消息内容为空,也请填入{}。例子如下：",
    ignore_detail: "忽略掉协议号，用','分割",
}

const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class TestProtocol extends Component {
    state = {
        file: 0,
        func: 0,
        inputjson: "{}",
        fileItems: [],
        protoItems: [],
    };

    handleFileChange = (event, index, value) => {
        this.setState({ file: value });
        this.loadProto(value);
    };

    handleProtoChange = (event, index, value) => {
        this.setState({
            func: value,
            inputjson: JSON.stringify(MsgMap.c2s[this.state.file].protos[value].args),
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
    };

    handleTextFocus = (event) => {

    };

    handleTextChange = (event) => {
        this.setState({
            inputjson: event.target.value,
        });
    };

    componentWillMount() {
        for (let i = 0; i < MsgMap.c2s.length; i++) {
            this.state.fileItems.push(<MenuItem value={i} key={i} primaryText={MsgMap.c2s[i].key} />);
        }
        this.loadProto(0);
    };

    componentWillUnmount() {
        MsgEmitter.unmount();
    };

    loadProto(index) {
        this.state.protoItems = [];
        for (let i = 0; i < MsgMap.c2s[index].protos.length; i++) {
            this.state.protoItems.push(<MenuItem value={i} key={i} primaryText={MsgMap.c2s[index].protos[i].key} />);
        }
    };

    sendMessage = (event) => {
        var cb = function (id, message) {
            if (message.time && message.time !== undefined) {
                var timeInt = parseInt(message.time);
            }
            var ignores = document.getElementById('text-field-ignore-id').value.split(',');
            if (ignores.indexOf(id.toString()) === -1) {
                var textfield = document.getElementById('text-field-message-show');
                textfield.value += "\n" + id + ":" + JSON.stringify(message);
                textfield.height = textfield.fullHeight;
            }
        }
        var obj;
        eval("obj =" + this.state.inputjson);
        if (obj && obj !== undefined) {
            var msg = MsgMap.c2s[this.state.file].protos[this.state.func];
            MsgEmitter.emit(msg.msg_id, MsgMap.c2s[this.state.file].key, msg.key, obj, cb);
        }
    };

    render() {
        return (
            <div>
                <Title render={(previousTitle) => `TestProtocol - ${previousTitle}`} />
                <SelectField
                    value={this.state.file}
                    onChange={this.handleFileChange}
                    maxHeight={200}

                    >
                    {this.state.fileItems}
                </SelectField>
                <SelectField
                    value={this.state.func}
                    onChange={this.handleProtoChange}
                    maxHeight={500}

                    >
                    {this.state.protoItems}
                </SelectField>
                <TextField
                    id="text-field-json"
                    value={this.state.inputjson}
                    onFocus={this.handleTextFocus}
                    onChange={this.handleTextChange}
                    multiLine={true}
                    fullWidth={true}
                    rowsMax={3}
                    rows={1}

                    />
                <TextField
                    id='text-field-ignore-id'
                    defaultValue="1095,1023"
                    fullWidth={true}

                    />
                <br />
                <TextField
                    id='text-field-message-show'
                    disabled={true}
                    multiLine={true}
                    rows={15}
                    rowsMax={100}
                    defaultValue=""
                    fullWidth={true}
                    />
                <br />
                <RaisedButton label={ProtocolPage.send_button} primary={true} onMouseUp={this.sendMessage} />
            </div >
        );
    }
}


export default TestProtocol;
