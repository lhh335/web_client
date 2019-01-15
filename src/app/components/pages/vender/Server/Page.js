import { SELF_DESTRUCT_C2S, SELF_DESTRUCT_S2C } from "../../../../proto_enum";
import React, { Component } from 'react';
import { LOGIC_SUCCESS } from "../../../../ecode_enum";

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Util from '../../../../util';
import Title from 'react-title-component';


class VenderServer extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        alertOpen: false,
        code: 0,
        content: "",
    }
    componentWillMount() {
        window.currentPage = this;
    }
    popUpNotice = (type, code, content) => {
        this.setState({ code: code, content: content, alertOpen: true });
    }
    refresh() {
    }

    render() {
        return <div>
            <Title render={(previousTitle) => `服务器操作 - 工厂后台`} />
            {/*<p style={{ marginTop: 30, marginRight: 15, float: 'left' }}>自毁服务器</p>*/}
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"服务器自毁"}
                primary={true}
                // id={}
                style={{ marginTop: 20, border: '0px 0px 5px #ddd' }}
                onTouchTap={(event) => {
                    var cb = (id, message, args) => {
                        if (id != SELF_DESTRUCT_S2C) {
                            return;
                        }
                        var self = args[0];
                        self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
                    }
                    MsgEmitter.emit(SELF_DESTRUCT_C2S, {}, cb, [this]);
                }}
            />
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
    }
}

export default VenderServer;