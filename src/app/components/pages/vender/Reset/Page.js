import { SELF_DESTRUCT_C2S, SELF_DESTRUCT_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";

import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Util from '../../../../util';
import Title from 'react-title-component';

class VenderReset extends Component {
    state = {
        alertOpen: false,
        code: 0,
        content: "",
    }

    componentWillMount() {
        window.currentPage = this;
    }

    refresh() {
    }
    popUpNotice = (type, code, content) => {
        this.setState({ code: code, content: content, alertOpen: true });
    }
    render() {
        return <div>
            <Title render={(previousTitle) => `${Lang[window.Lang].Vender.reset} - 工厂后台`} />
            <FlatButton
                label={"数据重启"}
                primary={true}
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

export default VenderReset;