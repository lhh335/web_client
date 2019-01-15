import {GET_HALL_NOTICE_C2S,SET_HALL_NOTICE_C2S,GET_HALL_NOTICE_S2C,SET_HALL_NOTICE_S2C,} from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
/*----antd-----开始*/
/*import { Input } from 'antd';
const Search = Input.Search;*/
/*-------antd-----结束*/
const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class NoticePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
            alertOpen: false
        }
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    get_notice = (language = 1) => {

        var cb = function (id, message, arg) {
            if (id !== GET_HALL_NOTICE_S2C) {
                return;
            }
            var self = arg;

            if (message.code === LOGIC_SUCCESS) {
                var result = message.notice_content;
                document.getElementById("changeto_title_text_field").value = result.split("|")[0];
                document.getElementById("changeto_content_text_field").value = result.split("|")[1];
                document.getElementById("zfb_acc_text_field").value = message.zfb;
                document.getElementById("wx_acc_text_field").value = message.wx;
                self.setState({ data: result });
            }
            // if (isUpdate === false) {
            // self.popUpNotice("notice", message.code, "查询成功");
            // }
            // self.handleUpdata(data);
        }

        var obj = {
            "language": language
        };

        MsgEmitter.emit(GET_HALL_NOTICE_C2S, obj, cb, this);
    }

    set_notice = (language = 1) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, arg) {
            if (id !== SET_HALL_NOTICE_S2C) {
                return;
            }
            var self = arg[0];

            if (message.code === LOGIC_SUCCESS) {
                // document.getElementById("current_text_field").value = arg[1].replace("|", "\n");

                self.setState({ data: arg[1] });
            }

            self.popUpNotice("notice", message.code, "设置成功");

            // self.handleUpdata(data);
        }

        var title = document.getElementById("changeto_title_text_field").value;
        if (title.indexOf("|") >= 0) {
            this.popUpNotice("notice", 99015, Lang[window.Lang].ErrorCode[99015]);
            return;
        }
        var content = document.getElementById("changeto_content_text_field").value;
        var zfbacc = document.getElementById("zfb_acc_text_field").value;
        var wxacc = document.getElementById("wx_acc_text_field").value;
        var obj = {
            "language": language,
            "notice_content": title + "|" + content,
            "zfb": zfbacc,
            "wx": wxacc
        };

        MsgEmitter.emit(SET_HALL_NOTICE_C2S, obj, cb, [this, title + "|" + content]);
    }

    componentDidMount() {         
        window.currentPage = this;
        this.get_notice(1);
    }

    refresh() {
        this.get_notice(1);
    }

    render() {
        return (
            <div>
                <br />
                新公告：
                <br />
                <TextField
                    id="changeto_title_text_field"
                    disabled={false}
                    multiLine={false}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <TextField
                    id="changeto_content_text_field"
                    disabled={false}
                    multiLine={true}
                    fullWidth={true}
                    rowsMax={8}
                    rows={6}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <br />
                支付宝账号：
                <TextField
                    id="zfb_acc_text_field"
                    disabled={false}
                    multiLine={false}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <br />
                微信账号：
                <TextField
                    id="wx_acc_text_field"
                    disabled={false}
                    multiLine={false}
                    fullWidth={true}
                    rowsMax={1}
                    rows={1}
                    // onFocus={this.handleTextFocus}
                    // onChange={this.handleTextChange}
                    defaultValue=''>
                </TextField>
                <br />
                <RaisedButton label={Lang[window.Lang].Master.certain_button} primary={true} style={styles.simple} onMouseUp={() => { this.set_notice(1) }} />
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

const SettingNotice = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Setting.notice} - ${previousTitle}`} />
        <NoticePage />

    </div>
);

export default SettingNotice;