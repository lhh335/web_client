import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'angonsoft_textfield';

import Lang from '../../../../../../Language';

class SetRoomConfig extends Component {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        callback: (func, isInputChecked, args) => { },
    }

    static propTypes = {
        callback: PropTypes.func.isRequired,
    }

    state = {
        disabled: false,
        game: 11,
        room: 1,
        desk_num: 1,
    }

    handleChange = (event, index, value) => {
        const {
            callback,
            selected
        } = this.props;
        const func = "set_room_config";
        this.setState({
            game: value
        })
        if (func === selected) {
            callback(func, true, [Number(value), Number(this.state.room), Number(this.state.desk_num)])
        }
    }

    handleChangeRoom = (event, index, value) => {
        const {
            callback,
            selected
        } = this.props;
        const func = "set_room_config";
        this.setState({
            room: value
        })
        if (func === selected) {
            callback(func, true, [Number(this.state.game), Number(value), Number(this.state.desk_num)])
        }
    }

    render() {
        const {
            callback,
            selected
        } = this.props;
        const func = "set_room_config";
        return (
            <ListItem
                primaryText={Lang[window.Lang].Setting.reportCodeOperate.func[func]}
                secondaryText={"游戏:" + Lang[window.Lang].Setting.GamePage[this.state.game].game_name +
                    "--房间:" + Lang[window.Lang].Setting.GamePage[this.state.game].room[this.state.room] +
                    "--增加桌子数:" + this.state.desk_num}
                leftCheckbox={<Checkbox title={Lang[window.Lang].Setting.reportCodeOperate.checkBoxTip} checked={func === selected} disabled={this.state.disabled} onCheck={(e, isInputChecked) => {
                    if (isInputChecked) {
                        if (this.state.desk_num > 0) {
                            callback(func, isInputChecked, [Number(this.state.game), Number(this.state.room), Number(this.state.desk_num)])
                        }
                    } else {
                        callback(func, isInputChecked, [])
                    }
                }} />}
                nestedItems={[
                    <div key={1} style={{ overflow: 'hidden' }}>
                        <SelectField
                            value={this.state.game}
                            style={{ marginLeft: 20, float: 'left' }}
                            // floatingLabelText={Lang[window.Lang].User.ExchangePage.sort_ways}
                            // value={this.state.sortWay}
                            onChange={this.handleChange}
                        >
                            <MenuItem value={11} primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} />
                            <MenuItem value={12} primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} />
                            <MenuItem value={14} primaryText={Lang[window.Lang].Setting.GamePage["14"].game_name} />
                            <MenuItem value={15} primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} />
                        </SelectField>
                        <SelectField
                            value={this.state.room}
                            style={{ marginLeft: 20, float: 'left' }}
                            // floatingLabelText={Lang[windo    .Lang].User.ExchangePage.sort_ways}
                            // value={this.state.sortWay}
                            onChange={this.handleChangeRoom}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage["11"].room["1"]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage["12"].room["2"]} />
                        </SelectField>
                        <div style={{ overflow: 'hidden', float: 'left' }}>
                            <TextField
                                id={'desk_num'}
                                middleWidth={true}
                                style={{ float: 'left', marginLeft: 20 }}
                                hintText={'请输入最大桌子数'}
                                value={this.state.desk_num}
                                onChange={(event, value) => {
                                    if (isNaN(value) === true || value === "" || value < 0 || value % 1 != 0) {
                                        this.setState({
                                            disabled: true,
                                            desk_num: value
                                        })
                                        if (func === selected) {
                                            callback(func, false, [])
                                        }
                                    } else {
                                        this.setState({
                                            disabled: false,
                                            desk_num: value
                                        })
                                        if (func === selected) {
                                            callback(func, true, [Number(this.state.game), Number(this.state.room), Number(value)])
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>


                ]}
            />
        )
    }
}

export default SetRoomConfig;