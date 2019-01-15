import { GET_GOOGLE_AUTH_KEY_C2S, NEW_GOOGLE_AUTH_KEY_C2S, SET_GOOGLE_AUTH_KEY_C2S, GET_GOOGLE_AUTH_KEY_S2C, NEW_GOOGLE_AUTH_KEY_S2C, SET_GOOGLE_AUTH_KEY_S2C, DATA_RESET_CMD_C2S, DATA_RESET_CMD_S2C, REGIST_ADMINISTRATER_C2S, REGIST_ADMINISTRATER_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS, ENSURE_HALL_NOT_OPEN } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import TextField from 'material-ui/TextField';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import FlatButton from 'material-ui/FlatButton';
import SettingAuth from '../Auth/Page';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import QRCode from 'qrcode-generator';


const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class Platform extends Component {

    constructor(props) {
        super(props);
    }
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    state = {
        stepIndex: 0,
        alertOpen: false,
        newAccount: '',
        newPassword: '',
        newAuth: '',
        showQrcode: false,
        success: false,
        setAuthSuccess: false
    };
    handleNext = () => {
        const { stepIndex, showQrcode, success } = this.state;
        if (stepIndex === 0) {
            this.handleDelete();
        } else if (stepIndex === 1) {
            this.handleSetAdmin();
        } else if (stepIndex === 2) {
            if (document.getElementById('new_key_text_field').value === '') {
                this.popUpNotice("notice", 0, '密钥不能为空');
                return;
            }
            if (this.state.setAuthSuccess === false) {
                this.popUpNotice("notice", 0, '未设置密钥');
            }
            if (success === true) {
                this.setState({
                    stepIndex: stepIndex + 1,
                    finished: true
                })
            }
        } else if (stepIndex === 3) {
            this.setState({
                stepIndex: 0,
                finished: false,
                showQrcode: false,
                setAuthSuccess: false
            });
            if (document.getElementById('new_admin_account') && document.getElementById('new_admin_password')) {
                document.getElementById('new_admin_account').value = '';
                document.getElementById('new_admin_password').value = '';
            }

        }
    };
    handleDelete = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }
        const { stepIndex } = this.state;
        var cb = function (id, message, arg) {
            if (id != DATA_RESET_CMD_S2C) {
                return;
            }
            var self = arg;
            if (message.code === ENSURE_HALL_NOT_OPEN) {
                self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    stepIndex: stepIndex + 1,
                })
            }
        }
        var obj = {

        };
        MsgEmitter.emit(DATA_RESET_CMD_C2S, obj, cb, this);
    }
    handleSetAdmin = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }
        const { stepIndex } = this.state;
        var cb = function (id, message, arg) {
            if (id != REGIST_ADMINISTRATER_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    stepIndex: stepIndex + 1,
                });
            }
        }
        var account = document.getElementById('new_admin_account').value;
        var password = document.getElementById('new_admin_password').value;
        if (account === '') {
            this.popUpNotice("notice", 0, '账号不能为空');
            return;
        }
        if (account.length > 16 || password.length > 16) {
            this.popUpNotice("notice", 0, '账号或密码字符过长');
            return;
        }
        if (password === '') {
            this.popUpNotice("notice", 0, '密码不能为空');
            return;
        }
        var obj = {
            account: account,
            password: password,
            language: 1
        }
        MsgEmitter.emit(REGIST_ADMINISTRATER_C2S, obj, cb, this);
    }
    handlePrev = () => {
        const { stepIndex } = this.state;

        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }
        var cb = function (id, message, arg) {
            if (id != DATA_RESET_CMD_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                // self.setState({
                //     stepIndex: stepIndex + 1,
                // })
            }
        }
        var obj = {

        };
        MsgEmitter.emit(DATA_RESET_CMD_C2S, obj, cb, this);
    };
    showQrcode = () => {
        return (
            <Paper>
                <TextField
                    id="serch_text_field"
                    disabled={false}
                    multiLine={false}
                    value={'管理员密钥'}
                    disabled={true}
                    fullWidth={true}
                />
                <br />
                <TextField
                    id="serch_text_field"
                    disabled={false}
                    multiLine={false}
                    value={this.state.newAuth}
                    disabled={true}
                    fullWidth={true}
                />
                <div id="qrcode">
                </div>
            </Paper>
        )
    }
    getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return this.deleteAdmin();
            case 1:
                return this.setAdmin();
            case 2:
                return this.setAuth();
            case 3:
                return this.finish();
        }
    }
    deleteAdmin = () => {
        return (
            <Paper style={{ padding: 20, textAlign: 'center', color: 'red' }}>
                您即将删除管理员信息？
            </Paper>
        )
    }
    setAdmin = () => {
        return (
            <Paper style={{ padding: 20 }}>
                <TextField
                    id="new_admin_account"
                    disabled={false}
                    multiLine={false}
                    floatingLabelText={'请输入管理员账号'}
                    value={this.state.newAccount}
                    onChange={(e, value) => {
                        this.setState({
                            newAccount: value
                        })
                    }}
                />
                <br />
                <TextField
                    id="new_admin_password"
                    type='password'
                    disabled={false}
                    multiLine={false}
                    floatingLabelText={'请设置管理员密码'}
                    value={this.state.newPassword}
                    onChange={(e, value) => {
                        this.setState({
                            newPassword: value
                        })
                    }}
                />
            </Paper>
        )
    }
    finish = () => {
        return (
            <Paper style={{ padding: 20, textAlign: 'center', color: 'blue' }}>
                恭喜您！完成设置
            </Paper>
        )
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
                self.setState({ newAuth: message.auth_key });
            }
            self.popUpNotice("notice", message.code, "生成密钥成功");
        }
        var obj = {
            // "language": language
        };
        MsgEmitter.emit(NEW_GOOGLE_AUTH_KEY_C2S, obj, cb, this);
    }
    get_auth_key = (language = 1) => {
        var cb = function (id, message, arg) {
            if (id !== GET_GOOGLE_AUTH_KEY_S2C) {
                return;
            }
            var self = arg;

            if (message.code === LOGIC_SUCCESS) {
                var typeNumber = 10;
                var errorCorrectionLevel = 'L';
                var qr = QRCode(typeNumber, errorCorrectionLevel);
                var auth_uri = "otpauth://totp/" + encodeURI(message.auth_name) + "?secret=" + message.auth_key + "&algorithm=SHA1&digits=6&period=30";
                qr.addData(auth_uri, "Byte");
                qr.make();
                if (document.getElementById("qrcode")) {
                    document.getElementById("qrcode").innerHTML = qr.createSvgTag(5, 0)
                }
                self.setState({ newAuth: message.auth_key });
            }
            // self.popUpNotice("notice", message.code, "查询成功");
        }

        var obj = {
            "server_arg_key": 1,
            // "language": language
        };

        MsgEmitter.emit(GET_GOOGLE_AUTH_KEY_C2S, obj, cb, this);
    }
    set_auth_key = () => {
        const { stepIndex } = this.state;
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
                self.setState({
                    success: true,
                    setAuthSuccess: true
                });
            }
            self.popUpNotice("notice", message.code, "设置成功");
        }
        var new_key = document.getElementById('new_key_text_field').value;
        var obj = {
            "server_arg_key": 1,
            "auth_key": new_key,
            "auth_name": '管理员密钥',
        };

        MsgEmitter.emit(SET_GOOGLE_AUTH_KEY_C2S, obj, cb, [this, new_key, '管理员密钥']);
    }
    setAuth = () => {
        return (
            <Paper style={{ padding: 20 }}>
                {this.state.showQrcode === true ?
                    <div>
                        <TextField
                            id="current_name_text_field"
                            disabled={false}
                            multiLine={false}
                            value={'管理员密钥'}
                            disabled={true}
                            fullWidth={true}
                        />
                        <br />
                        <TextField
                            id="current_key_text_field"
                            disabled={false}
                            multiLine={false}
                            value={this.state.newAuth}
                            disabled={true}
                            fullWidth={true}
                        />
                        <div id="qrcode">
                        </div>
                    </div> : ''
                }
                <br />
                {this.state.stepIndex < 3 ?
                    <div>
                        生成管理员秘钥：
                <br />
                        <TextField
                            id="new_key_text_field"
                            multiLine={true}
                            fullWidth={true}
                            rowsMax={1}
                            rows={1}
                            defaultValue=''>
                        </TextField>
                        <br />
                        <RaisedButton label={Lang[window.Lang].Setting.AuthPage.create_button} primary={true}
                            style={styles.simple} onMouseUp={() => {
                                this.new_auth_key()
                            }} />
                        <RaisedButton label={Lang[window.Lang].Setting.AuthPage.use_button} primary={true} style={styles.simple}
                            onMouseUp={() => {
                                this.setState({
                                    showQrcode: true
                                })
                                if (document.getElementById("new_key_text_field").value !== "") {
                                    this.set_auth_key()
                                } else {
                                    this.popUpNotice("notice", 0, "秘钥不能为空");
                                }
                            }} />
                    </div> : ''
                }

            </Paper>
        )
    }
    render() {
        const { finished, stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };
        const styles = {
            simple: {
                margin: 'auto 20px auto 10px'
            },
            tooltip: {
                boxSizing: 'border-box',
                marginTop: 5,
            },
        }
        return (
            <div>
                <div style={Styles.table}>
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel>删除管理员</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>设置新管理员</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>设置谷歌验证</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>完成设置</StepLabel>
                        </Step>
                    </Stepper>
                </div>

                <div style={contentStyle}>
                    <div style={Styles.table}>
                        <div>{this.getStepContent(stepIndex)}</div>
                        <div style={{ marginTop: 12 }}>
                            {stepIndex <= 2 ?
                                <FlatButton
                                    label={Lang[window.Lang].Setting.back}
                                    disabled={stepIndex === 0}
                                    onTouchTap={this.handlePrev}
                                    style={{ marginRight: 12 }}
                                /> : ''
                            }
                            <RaisedButton
                                label={stepIndex <= 1 ? Lang[window.Lang].Setting.nextStep : stepIndex === 2 ? Lang[window.Lang].Setting.finish : Lang[window.Lang].Setting.reset}
                                primary={true}
                                onTouchTap={this.handleNext}
                            />
                        </div>
                    </div>


                </div>
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
            </div>
        )
    }
}

const ResetPlatform = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Setting.resetPlatform} - 超级管理员后台`} />
        <Platform />

    </div>
);

export default ResetPlatform;