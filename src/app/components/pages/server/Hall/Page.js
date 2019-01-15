import {QUERY_GAME_STATUS_C2S,CHANGE_GAME_STATUS_C2S,RESET_RANKING_C2S,QUERY_GAME_STATUS_S2C,CHANGE_GAME_STATUS_S2C,} from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';

class Hall extends Component {
    state = {
        hall: 1,
        tree: 1,
        bull: 1
    }

    componentWillMount() {
        this.showStatus();
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
                    } else if (message.gsi[i].game === 11) {
                        args[0].setState({ tree: message.gsi[i].state });
                    } else if (message.gsi[i].game === 12) {
                        args[0].setState({ bull: message.gsi[i].state });
                    }
                }
            }
        }
        MsgEmitter.emit(QUERY_GAME_STATUS_C2S, {}, cb, [this]);
    }

    render() {
        return <div>
            <Toggle
                label={this.state.hall === 1 ? "关闭大厅" : "开启大厅"}
                style={{
                    marginBottom: 16,
                }}
                disabled={this.state.hall === 3}
                labelPosition="right"
                defaultToggled={this.state.hall === 1 ? true : false}
                onToggle={(e, isOn) => {
                    var cb = (id, message, args) => {
                        if (id !== CHANGE_GAME_STATUS_S2C) {
                            return;
                        }
                        if (message.code === LOGIC_SUCCESS) {
                            var self = args[0];
                            args[0].state.hall = args[1];
                            args[0].setState({ hall: args[1] });
                        }
                    }
                    let state = isOn === true ? 1 : 2;
                    MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, { game: 10, state: state }, cb, [this, state]);
                }}
            />
            <Toggle
                label={this.state.tree === 1 ? "关闭摇钱树" : "开启摇钱树"}
                style={{
                    marginBottom: 16,
                }}
                labelPosition="right"
                defaultToggled={this.state.tree === 1 ? true : false}
                onToggle={(e, isOn) => {
                    var cb = (id, message, args) => {
                        if (id !== CHANGE_GAME_STATUS_S2C) {
                            return;
                        }
                        if (message.code === LOGIC_SUCCESS) {
                            args[0].state.tree = args[1];
                            args[0].setState({ game_states: args[0].state.game_states });
                        }
                    }
                    let state = isOn === true ? 1 : 2;
                    MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, { game: 11, state: state }, cb, [this, state]);
                }}
            />
            <Toggle
                label={this.state.bull === 1 ? "关闭牛魔王" : "开启牛魔王"}
                style={{
                    marginBottom: 16,
                }}
                labelPosition="right"
                defaultToggled={this.state.bull === 1 ? true : false}
                onToggle={(e, isOn) => {
                    var cb = (id, message, args) => {
                        if (id !== CHANGE_GAME_STATUS_S2C) {
                            return;
                        }
                        if (message.code === LOGIC_SUCCESS) {
                            args[0].state.bull = args[1];
                            args[0].setState({ game_states: args[0].state.game_states });
                        }
                    }
                    let state = isOn === true ? 1 : 2;
                    MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, { game: 12, state: state }, cb, [this, state]);
                }}
            />
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"重置排行榜"}
                primary={true}
                // id={}
                onTouchTap={(event) => {
                    var cb = (id, message, args) => {
                    }
                    MsgEmitter.emit(RESET_RANKING_C2S, {}, cb, [this]);
                }}
            />
        </div>
    }
}

export default Hall;