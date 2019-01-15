import { GET_GOOGLE_AUTH_KEY_C2S, NEW_GOOGLE_AUTH_KEY_C2S, SET_GOOGLE_AUTH_KEY_C2S, GET_GOOGLE_AUTH_KEY_S2C, NEW_GOOGLE_AUTH_KEY_S2C, SET_GOOGLE_AUTH_KEY_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS, ERROR_AUTH_NOT_EXIST } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Tooltip from 'material-ui/internal/Tooltip'
import {
    Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
}
    from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Util from '../../../../util';
import QRCode from 'qrcode-generator';

const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    },
    tooltip: {
        boxSizing: 'border-box',
        marginTop: 5,
    },
};

class AuthPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            alertOpen: false,
            key_type: 2,
        }
    }
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }
    handleChangeKeyType = (event, index, value) => {
        // this.setState({ key_type: value });
        this.state.key_type = value;
        this.get_auth_key();
    }

    get_auth_key = (language = 1) => {
        var cb = function (id, message, arg) {
            if (id !== GET_GOOGLE_AUTH_KEY_S2C) {
                return;
            }
            var self = arg;
            if (message.code === ERROR_AUTH_NOT_EXIST) {
                self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                document.getElementById("current_key_text_field").value = message.auth_key;
                document.getElementById("current_name_text_field").value = message.auth_name || '推广员密钥';
                document.getElementById("new_name_text_field").value = message.auth_name || '推广员密钥';
                var typeNumber = 10;
                var errorCorrectionLevel = 'L';
                var qr = QRCode(typeNumber, errorCorrectionLevel);
                var auth_uri = "otpauth://totp/" + encodeURI(message.auth_name) + "?secret=" + message.auth_key + "&algorithm=SHA1&digits=6&period=30";
                qr.addData(auth_uri, "Byte");
                qr.make();
                if (document.getElementById("qrcode")) {
                    document.getElementById("qrcode").innerHTML = qr.createSvgTag(5, 0)
                }
                self.setState({ data: message.auth_key });
            }
            // self.popUpNotice("notice", message.code, "查询成功");
        }

        var obj = {
            "server_arg_key": this.state.key_type,
            // "language": language
        };

        MsgEmitter.emit(GET_GOOGLE_AUTH_KEY_C2S, obj, cb, this);
    }

    new_auth_key = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, arg) {
            if (id !== NEW_GOOGLE_AUTH_KEY_S2C) {
                return;
            }
            var self = arg;

            if (message.code === LOGIC_SUCCESS) {
                document.getElementById("new_key_text_field").value = message.auth_key;
                self.setState({ data: message.auth_key });
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var obj = {
            // "language": language
        };
        MsgEmitter.emit(NEW_GOOGLE_AUTH_KEY_C2S, obj, cb, this);
    }

    set_auth_key = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, arg) {
            if (id !== SET_GOOGLE_AUTH_KEY_S2C) {
                return;
            }
            var self = arg[0];

            if (message.code === LOGIC_SUCCESS) {
                document.getElementById("current_key_text_field").value = arg[1];
                document.getElementById("current_name_text_field").value = arg[2];
                var typeNumber = 10;
                var errorCorrectionLevel = 'L';
                var qr = QRCode(typeNumber, errorCorrectionLevel);
                var auth_uri = "otpauth://totp/" + encodeURI(arg[2]) + "?secret=" + arg[1] + "&algorithm=SHA1&digits=6&period=30";
                qr.addData(auth_uri, "Byte");
                qr.make();
                if (document.getElementById("qrcode")) {
                    document.getElementById("qrcode").innerHTML = qr.createSvgTag(5, 0);
                }
            }

            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);

            // self.handleUpdata(data);
        }

        var new_key = document.getElementById("new_key_text_field").value;
        var new_name = document.getElementById("new_name_text_field").value;
        var obj = {
            "server_arg_key": this.state.key_type,
            "auth_key": new_key,
            "auth_name": new_name,
        };

        MsgEmitter.emit(SET_GOOGLE_AUTH_KEY_C2S, obj, cb, [this, new_key, new_name]);
    }

    componentDidMount() {
        window.currentPage = this;
        this.get_auth_key();
    }

    refresh() {
        this.get_auth_key(true);
    }

    render() {
        return (
            <div>
                {sessionStorage.accountType != '3' ?
                    <SelectField
                        value={this.state.key_type}
                        onChange={this.handleChangeKeyType}
                        fullWidth={true}
                    >
                        <MenuItem value={1} key={"google_auth_key"} primaryText={"管理员谷歌验证秘钥"} />
                        <MenuItem value={2} key={"promoter_auth_key"} primaryText={"推广员谷歌验证秘钥"} />
                        {sessionStorage.accountType === '2' ?
                            <MenuItem value={4} key={"manager_auth_key"} primaryText={"后台谷歌验证秘钥"} /> : ''}
                    </SelectField> :
                    <SelectField
                        value={this.state.key_type}
                        onChange={this.handleChangeKeyType}
                        fullWidth={true}
                    >
                        <MenuItem value={1} key={"google_auth_key"} primaryText={"管理员谷歌验证秘钥"} />
                        <MenuItem value={2} key={"promoter_auth_key"} primaryText={"推广员谷歌验证秘钥"} />
                        <MenuItem value={4} key={"manager_auth_key"} primaryText={"后台谷歌验证秘钥"} />
                        <MenuItem value={5} key={"vender_auth_key"} primaryText={"厂家谷歌验证秘钥"} />
                    </SelectField>
                }

                当前秘钥：
                <br />
                <TextField
                    id="current_name_text_field"
                    disabled={true}
                    multiLine={false}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    defaultValue={this.state.data}>
                </TextField>
                <br />
                <TextField
                    id="current_key_text_field"
                    disabled={true}
                    multiLine={false}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    defaultValue={this.state.data}>
                </TextField>
                <div id="qrcode">
                </div>
                <br />
                生成新秘钥：
                <br />
                {/*<TextField
                 id="changeto_title_text_field"
                 disabled={false}
                 multiLine={false}
                 fullWidth={true}
                 rowsMax={1}
                 rows={1}
                 // onFocus={this.handleTextFocus}
                 // onChange={this.handleTextChange}
                 hintText="标题"
                 defaultValue=''>
                 </TextField>*/}
                <TextField
                    id="new_name_text_field"
                    disabled={false}
                    multiLine={true}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <TextField
                    id="new_key_text_field"
                    // disabled={true}
                    multiLine={true}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <br />
                <RaisedButton label={Lang[window.Lang].Setting.AuthPage.create_button} primary={true}
                    style={styles.simple} onMouseUp={() => {
                        this.new_auth_key()
                    }} />
                <RaisedButton label={Lang[window.Lang].Setting.AuthPage.use_button} primary={true} style={styles.simple}
                    onMouseUp={() => {
                        if (document.getElementById("new_key_text_field").value !== "") {
                            this.set_auth_key()
                        } else {
                            this.popUpNotice("notice", 0, "秘钥不能为空");
                        }
                    }} />
                <CommonAlert
                    show={this.state.alertOpen}
                    type="notice"
                    code={this.state.code}
                    content={this.state.content}
                    handleCertainClose={() => {
                        this.setState({ alertOpen: false });
                    }}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false });
                    }}>
                </CommonAlert>
            </div>)
    }
}
const SettingAuth = () => (
    <div>
        {sessionStorage.accountType === '0' ?
            <Title render={(previousTitle) => `${Lang[window.Lang].Setting.auth} - ${previousTitle}`} /> : sessionStorage.accountType === '2' ?
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.auth} - 超级管理员后台`} /> : <Title render={(previousTitle) => `${Lang[window.Lang].Setting.auth} - 工厂后台`} />
        }
        <AuthPage />
    </div>
);

export default SettingAuth;
