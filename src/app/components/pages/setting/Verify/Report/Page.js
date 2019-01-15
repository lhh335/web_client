import { GENERATE_REPORT_CODE_C2S, GENERATE_REPORT_CODE_S2C, EXECUTE_CODE_C2S, EXECUTE_CODE_S2C } from "../../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../../ecode_enum";
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import CopyToClipboard from 'react-copy-to-clipboard';
import Title from 'react-title-component';

import MsgEmitter from '../../../../../MsgEmitter';
import Lang from '../../../../../Language';
import OperateCodeUtil from '../../../../../OperateCodeUtil';

import CommonAlert from '../../../../myComponents/Alert/CommonAlert';

class VerifyReportCode extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        value: 1,
        reportCode: '',
        alertOpen: false,
        executeCode: '',
        showExecuteResult: false,
        executeResult: [],
        copied: false
    }
    handleChange = (event, index, value) => {
        this.setState({
            value: value
        })
    }
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }
    showExecuteResult = () => {
        return (
            <div id='showExecuteResult' style={{ marginLeft: -5, boxShadow: '3px 3px 3px #ccc', border: '1px dashed #ccc', paddingBottom: 10, paddingTop: 10, }}>
                {this.state.executeResult.length === 0 ? <div style={{ color: 'red', height: 40, lineHeight: 40, textAlign: 'center' }}>
                    未做任何操作
                </div> : this.state.executeResult.map((item, i) => {
                        return (
                            <ul key={i} style={{ paddingBottom: 0 }} >
                                <li>操作：{OperateCodeUtil.operateDetail(item)}</li>
                                <li>结果：{OperateCodeUtil.operateResult(item)}</li>
                            </ul>
                        )
                    }
                    )}
            </div>
        )
    }

    render() {
        return (
            <Paper style={{ marginTop: 60, marginRight: 20, padding: 20 }}>
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.reportCode} - ${previousTitle}`} />
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ textAlign: "center", fontWeight: 'normal', textShadow: '5px 5px 5px #aaa', marginTop: -10 }}>生成报码</h3>
                    <h5 style={{ textAlign: 'center', color: '#aaa', marginBottom: 20, marginTop: 7 }}>说明：生成的报码用于发送给超级管理员来验证，待超级管理员回执，方可执行操作（注：未执行操作前，报码永久可用）</h5>
                    <hr style={{ boxShadow: '10px 0px 10px #eee' }} />
                    <h4 style={{ display: 'inline', textDecoration: 'underline', paddingTop: 15 }}>报码ID：</h4>
                    <h4 id='reportID' style={{ display: 'inline', textDecoration: 'underline' }}></h4>
                    <TextField
                        id='report_code'
                        disabled={true}
                        fullWidth={true}
                        hintText={'此处生成报码'}
                        value={this.state.reportCode}
                        onChange={(event, value) => {
                            this.setState({
                                reportCode: value
                            })
                        }}
                    />
                    <RaisedButton label="生成报码" primary={true} onClick={() => {
                        document.getElementById('reportID').innerHTML = '';
                        var node = document.getElementById('showExecuteResult');
                        if (node && node.firstChild) {
                            {/*node.removeChild(node.firstChild);
                            node.setAttribute('style', '');*/}
                        }
                        var cb = (id, message, arg) => {
                            if (id != GENERATE_REPORT_CODE_S2C) {
                                return;
                            }
                            var self = arg;
                            if (message.code === LOGIC_SUCCESS) {
                                self.setState({
                                    reportCode: message.report_code
                                })
                            }
                            document.getElementById('reportID').innerHTML = message.id;
                            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
                        }
                        MsgEmitter.emit(GENERATE_REPORT_CODE_C2S, {}, cb, this)
                    }} />

                    <CopyToClipboard style={{ marginLeft: 20 }} text={this.state.reportCode}
                        onCopy={() => {
                            this.state.copied = true;
                            this.setState({ copied: true })
                        }}>
                        <RaisedButton label="复制到剪切板" primary={true} onClick={() => {
                        }} />
                    </CopyToClipboard>

                </div>
                <div>
                    <TextField
                        id='execute_code'
                        fullWidth={true}
                        hintText={'复制执行码到此处'}
                        value={this.state.executeCode}
                        onChange={(event, value) => {
                            this.setState({
                                executeCode: value
                            })
                        }}
                    />
                    <RaisedButton label="执行操作" primary={true} onClick={() => {
                        var cb = (id, message, arg) => {
                            if (id != EXECUTE_CODE_S2C) {
                                return;
                            }
                            var self = arg;
                            if (message.code === LOGIC_SUCCESS) {
                                self.setState({
                                    executeResult: message.ar,
                                    showExecuteResult: true,
                                    reportCode: '',
                                    executeCode: ''
                                })
                                self.showExecuteResult();
                                document.getElementById('reportID').innerHTML = '';
                            }
                            self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);

                        }
                        if (this.state.executeCode === '') {
                            this.popUpNotice('notice', 0, '执行码不能为空');
                            return;
                        }
                        var obj = {
                            execute_code: this.state.executeCode
                        }

                        MsgEmitter.emit(EXECUTE_CODE_C2S, obj, cb, this)
                    }} />
                </div>
                <br />
                {this.state.showExecuteResult === true ? this.showExecuteResult() : ''}
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

export default VerifyReportCode;
