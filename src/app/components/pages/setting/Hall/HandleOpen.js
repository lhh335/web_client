import {CHANGE_GAME_STATUS_C2S,CHANGE_GAME_STATUS_S2C,} from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';

class HandleOpen extends Component {
    state = {
        status: "开启大厅"
    }



    render() {
        return <Toggle
            label={this.state.status}
            style={{
                marginBottom: 16,
            }}
            labelPosition="right"
            defaultToggled={true}
            onToggle={(e, isOn) => {
                var cb = (id, message) => {
                    if (id !== CHANGE_GAME_STATUS_S2C) {
                        return;
                    }
                    if (message.code === LOGIC_SUCCESS) {
                        
                    }
                }
                var state = isOn === true ? 1 : 2;
                var obj = {
                    game: 10,
                    state: state
                }
                MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, obj, cb, []);
            }}
        />
    }
}

export default HandleOpen;