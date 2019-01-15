import { QUERY_GAME_STATUS_C2S, SET_HALL_STATE_C2S, QUERY_GAME_STATUS_S2C, SET_HALL_STATE_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Util from '../../../../util';
import Title from 'react-title-component';


class Hall extends Component {
    state = {
        hall: 1,
        alertOpen: false,
        code: 0,
        content: "",
    }

    componentWillMount() {
        this.showStatus();
        window.currentPage = this;
    }

    refresh() {
        this.showStatus();
    }
    popUpNotice = (type, code, content) => {
        this.setState({ code: code, content: content, alertOpen: true });
    }
    showStatus = () => {
        var cb = (id, message, args) => {

            if (id !== QUERY_GAME_STATUS_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                for (var i = 0; i < message.gsi.length; i++) {
                    if (message.gsi[i].game === 10) {
                        args[0].setState({ hall: message.gsi[i].state });
                    }
                }
            }
        }
        MsgEmitter.emit(QUERY_GAME_STATUS_C2S, {}, cb, [this]);
    }

    handleDeletRRC = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== SET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var class_index = Number(this.state.selected_class);
        var number = document.getElementById("set_number").value;
        var return_coin = (document.getElementById("set_return_coin").value);
        if (number.indexOf(".") !== -1 || isNaN(Number(number)) || Number(number) < 0) {
            this.popUpNotice("notice", 0, "填入数量应该为正整数");
            return
        } else if (return_coin.indexOf(".") !== -1 || isNaN(Number(return_coin)) || Number(return_coin) < 0) {
            this.popUpNotice("notice", 0, "填入金额应该为正整数");
            return
        }

        var obj = {
            rrci: { "class": class_index, "number": Number(number), "return_coin": Number(return_coin) }
        }

        MsgEmitter.emit(SET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }
    
    handleAddRRC = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== SET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var class_index = Number(this.state.selected_class);
        var number = document.getElementById("set_number").value;
        var return_coin = (document.getElementById("set_return_coin").value);
        if (number.indexOf(".") !== -1 || isNaN(Number(number)) || Number(number) < 0) {
            this.popUpNotice("notice", 0, "填入数量应该为正整数");
            return
        } else if (return_coin.indexOf(".") !== -1 || isNaN(Number(return_coin)) || Number(return_coin) < 0) {
            this.popUpNotice("notice", 0, "填入金额应该为正整数");
            return
        }

        var obj = {
            rrci: { "class": class_index, "number": Number(number), "return_coin": Number(return_coin) }
        }

        MsgEmitter.emit(SET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    handleSetRRC = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== SET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var class_index = Number(this.state.selected_class);
        var number = document.getElementById("set_number").value;
        var return_coin = (document.getElementById("set_return_coin").value);
        if (number.indexOf(".") !== -1 || isNaN(Number(number)) || Number(number) < 0) {
            this.popUpNotice("notice", 0, "填入数量应该为正整数");
            return
        } else if (return_coin.indexOf(".") !== -1 || isNaN(Number(return_coin)) || Number(return_coin) < 0) {
            this.popUpNotice("notice", 0, "填入金额应该为正整数");
            return
        }

        var obj = {
            rrci: { "class": class_index, "number": Number(number), "return_coin": Number(return_coin) }
        }

        MsgEmitter.emit(SET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    handleGetRRC = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== GET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                for (var i = 0; i < message.rrci.length; i++) {
                    this.state.recharge_return_coin[message.rrci[i].class] = message.rrci[i]
                }
                this.setState({
                    /*change_bang_value: true,*/
                    recharge_return_coin: this.state.recharge_return_coin,
                    showDetail: "recharge_return_coin"
                })
            }
            // var self = args[0];
            // self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var obj = {}

        MsgEmitter.emit(GET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    render() {
        return <div style={{ paddingTop: 10 }}>
            <Title render={(previousTitle) => `${Lang[window.Lang].Vender.hall_state} - 超级管理员后台`} />
            <Toggle
                label={this.state.hall === 1 ? "关闭大厅" : "开启大厅"}
                style={{
                    marginBottom: 16,
                }}
                labelPosition="right"
                defaultToggled={this.state.hall === 1 ? true : false}
                toggled={this.state.hall === 1 ? true : false}
                onToggle={(e, isOn) => {
                    var cb = (id, message, args) => {
                        if (id !== SET_HALL_STATE_S2C) {
                            return;
                        }
                        var self = args[0];
                        if (message.code === LOGIC_SUCCESS) {
                            this.showStatus();
                        }
                        self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);

                    }
                    let state = isOn === true ? 1 : 3;
                    MsgEmitter.emit(SET_HALL_STATE_C2S, { state: state }, cb, [this, state]);
                }}
            />
            {/*<FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"设置充值返还金币"}
                primary={true}
                // id={}
                onTouchTap={(event) => {
                    this.handleGetRRC()
                }}
            />*/}
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

export default Hall;