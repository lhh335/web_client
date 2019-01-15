import { GENERATE_REPORT_CODE_C2S, GENERATE_REPORT_CODE_S2C, CHECK_REPORT_CODE_C2S, CHECK_REPORT_CODE_S2C, GENERATE_EXECUTE_CODE_C2S, GENERATE_EXECUTE_CODE_S2C } from "../../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../../ecode_enum";
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Title from 'react-title-component';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'angonsoft_textfield';
import Dialog from 'material-ui/Dialog';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import CopyToClipboard from 'react-copy-to-clipboard';

import RechargeDrawWaterCoin from './ExeItems/RechargeDrawWaterCoin';
import SetRoomConfig from './ExeItems/SetRoomConfig';

import Util from '../../../../../util';
import MsgEmitter from '../../../../../MsgEmitter';
import Lang from '../../../../../Language';
import CommonAlert from '../../../../myComponents/Alert/CommonAlert';

class VerifyExecuteCode extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        value: 1,
        executeCode: '',
        reportCode: '',
        alertOpen: false,
        showExecute: false,
        selected_func: "",
        selected_args: [],
        selected: {},
        reportId: 0,
        reportTime: 0,
        copied: false,
    }

    handleChange = (event, index, value) => {
        this.setState({
            value: value
        })
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }


    handleVerifyReportCode = () => {
        this.setState({
            selected_func: ''
        })
        var cb = (id, message, arg) => {
            if (id != CHECK_REPORT_CODE_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                var result = message.rc;
                self.setState({
                    showExecute: true,
                    reportId: result.id,
                    reportTime: result.time
                })
                self.popUpNotice("notice", message.code, '校验成功');
            } else {
                self.setState({
                    showExecute: false
                })
                self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
            }
        }
        if (document.getElementById('verify_report_code').value === "") {
            this.popUpNotice("notice", 0, '报码不可为空');
            return;
        }
        var obj = {
            report_code: document.getElementById('verify_report_code').value
        }

        MsgEmitter.emit(CHECK_REPORT_CODE_C2S, obj, cb, this)
    }

    handleGenExecuteCode = () => {
        var cb = (id, message, arg) => {
            if (id != GENERATE_EXECUTE_CODE_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    executeCode: message.execute_code
                })
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        // var action = [];
        // for (var key in this.state.exeObj) {
        //     action.push(JSON.stringify({ func: key, args: this.state.exeObj[key] }))
        // }
        if (this.state.selected_func === "") {
            this.popUpNotice("notice", 0, '请选择要执行的操作');
            return;
        }
        for (var i = 0; i < this.state.selected_args.length; i++) {
            if (isNaN(this.state.selected_args[i])) {
                this.popUpNotice("notice", 0, '请输入正确数值型');
                return;
            }
            if (Number(this.state.selected_args[i]) % 1 != 0) {
                this.popUpNotice("notice", 99023, Lang[window.Lang].ErrorCode[99023]);
                return;
            }
            if (Number(this.state.selected_args[i]) < 0) {
                this.popUpNotice("notice", 99024, Lang[window.Lang].ErrorCode[99024]);
                return;
            }
        }
        var obj = {
            report_code: document.getElementById('verify_report_code').value,
            actions: JSON.stringify({ func: this.state.selected_func, args: this.state.selected_args })
        }
        // return;
        MsgEmitter.emit(GENERATE_EXECUTE_CODE_C2S, obj, cb, this);
    }

    callback = (func, isSelect, args) => {
        if (isSelect && func !== "") {
            this.setState({
                selected_func: func,
                selected_args: args
            })
            this.state.selected_func = func;
            this.state.selected_args = args;
        } else {
            this.setState({
                selected_func: "",
                selected_args: []
            })
            this.state.selected_func = "";
            this.state.selected_args = [];
        }
    }

    render() {
        return (
            <Paper style={{ marginTop: 60, marginRight: 20, padding: 20 }}>
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.executeCode} - ${previousTitle}`} />
                <div style={{ marginBottom: 20 }}>
                    <h2 style={{ textAlign: "center", fontWeight: 'normal', textShadow: '5px 5px 5px #aaa', marginBottom: 20 }}>报码验证</h2>
                    <hr style={{ boxShadow: '10px 0px 10px #eee' }} />
                    <TextField
                        id='verify_report_code'
                        disabled={false}
                        fullWidth={true}
                        style={{ marginTop: 7 }}
                        hintText={'复制报码到此处'}
                        value={this.state.reportCode}
                        onChange={(event, value) => {
                            this.setState({
                                reportCode: value
                            })
                        }}
                    /><br />
                    <RaisedButton label="校验报码" primary={true} onClick={() => {
                        this.handleVerifyReportCode();
                    }} />
                    <RaisedButton label="清空报码" primary={true} style={{ marginLeft: 20 }} onClick={() => {
                        this.setState({
                            reportCode: '',
                            showExecute: false,
                            executeCode: ''
                        })
                    }} />
                </div>
                {this.state.showExecute === true ?
                    <div>
                        <div style={{ height: 'auto', border: '1px dashed #ccc', boxShadow: '0px 0px 4px #888' }}>
                            <ul>
                                <li>报码ID：{this.state.reportId}</li>
                                <li>报码生成时间：{Util.time.getTimeString(this.state.reportTime)}</li>
                            </ul>
                        </div>
                        <br />
                        <div style={{ height: 'auto', border: '1px dashed #ccc', boxShadow: '0px 0px 4px #888' }}>
                            <List>
                                <Subheader><h4 style={{ display: 'inline' }}>选择执行的操作</h4><h6 style={{ color: '#ccc', display: 'inline' }}>（有且仅有一个操作）</h6></Subheader>
                                <RechargeDrawWaterCoin key={1} selected={this.state.selected_func} callback={this.callback} />
                                <SetRoomConfig key={2} style={{ overflow: 'hidden' }} selected={this.state.selected_func} callback={this.callback} />
                            </List>
                        </div>
                        <br />
                        <TextField
                            id='generate_execute_code'
                            disabled={true}
                            fullWidth={true}
                            hintText={'此处为执行码'}
                            value={this.state.executeCode}
                            onChange={(event, value) => {
                                this.setSate({
                                    executeCode: value
                                })
                                this.state.executeCode = value
                            }}
                        /><br />
                        <RaisedButton label="生成执行码" primary={true} onClick={() => {
                            this.handleGenExecuteCode();
                        }} />
                        <CopyToClipboard style={{ marginLeft: 20 }} text={this.state.executeCode}
                            onCopy={() => {
                                this.state.copied = true;
                                this.setState({ copied: true })
                            }}>
                            <RaisedButton label="复制到剪切板" primary={true} onClick={() => {
                            }} />
                        </CopyToClipboard>
                    </div> : ''
                }
                <CommonAlert
                    show={this.state.alertOpen}
                    type="notice"
                    code={this.state.code}
                    content={this.state.content}
                    handleCertainClose={() => {
                        this.setState({ alertOpen: false });
                    }}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false })
                    }}>
                </CommonAlert>
            </Paper>
        )
    }
}

export default VerifyExecuteCode;
