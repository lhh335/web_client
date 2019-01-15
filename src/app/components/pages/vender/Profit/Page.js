import { SET_MAX_PROFIT_C2S, SET_MAX_PROFIT_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";

import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import TextField from 'angonsoft_textfield';
import FlatButton from 'material-ui/FlatButton';
import Util from '../../../../util';
import Title from 'react-title-component';


class VenderProfit extends Component {

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

    refresh() {
    }
    popUpNotice = (type, code, content) => {
        this.setState({ code: code, content: content, alertOpen: true });
    }
    render() {
        return <div>
            <Title render={(previousTitle) => `${Lang[window.Lang].Vender.profit} - 工厂后台`} />
            <TextField
                middleWidth={true}
                id="profit"
                disabled={false}
                multiLine={false}
                hintText={"最大盈利值"}
                defaultValue=""
                style={{ float: 'left', marginRight: 10 }}
            />
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"确定"}
                primary={true}
                // id={}
                style={{ marginTop: 8, border: '0px 0px 5px #ddd' }}
                onTouchTap={(event) => {
                    var cb = (id, message, args) => {
                        if (id != SET_MAX_PROFIT_S2C) {
                            retrun;
                        }
                        var self = args[0];
                        self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
                    }
                    MsgEmitter.emit(SET_MAX_PROFIT_C2S, { max_profit: parseInt(document.getElementById("profit").value) }, cb, [this]);
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

export default VenderProfit;