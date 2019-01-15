import { DATA_CLEAN_CMD_C2S, DATA_CLEAN_CMD_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';

/*----antd-----开始*/
/*import { Input } from 'antd';
const Search = Input.Search;*/
/*-------antd-----结束*/


class Statistics extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        openDialog: false,
        alertOpen: false
    }
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }
    handleOpen = () => {
        this.setState({
            openDialog: true
        })
    }
    handleClose = () => {
        this.setState({
            openDialog: false
        })
    }
    handleReset = () => {
        var cb = function (id, message, arg) {
            if (id !== DATA_CLEAN_CMD_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    openDialog: false
                })
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);

        }
        var obj = {

        };
        MsgEmitter.emit(DATA_CLEAN_CMD_C2S, obj, cb, this);

    }
    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleReset}
            />,
        ]
        return (
            <div>
                <RaisedButton label={Lang[window.Lang].Setting.resetStatistics} onTouchTap={this.handleOpen} style={{ marginTop: 20, marginLeft: 20 }} />
                <Dialog
                    title="您即将清理数据"
                    actions={actions}
                    modal={true}
                    open={this.state.openDialog}
                    onRequestClose={this.handleReset}
                >
                    包括：统计数据、桌子数据、玩家数据、推广员数据、管理员数据等
                </Dialog>
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
            </div>
        )

    }
}

const CleanStatistics = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Setting.resetStatistics} - 超级管理员后台`} />
        <Statistics />

    </div>
);

export default CleanStatistics;