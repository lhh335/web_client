import { GET_ROOM_CONFIG_C2S, SET_ROOM_CONFIG_C2S, GET_ROOM_CONFIG_S2C, SET_ROOM_CONFIG_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import ReactDataGrid from 'angon_react_data_grid';


const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class SettingRoom extends Component {
    state = {
        game: "fish",
        gameID: 11,
        max_desk: 0,
        data: [],
        roomsItem: [],
        room: 1,
        alertOpen: false,
        selectedOne: -1,
        singleRoomInfo: {},
        fixValue: 1,
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    handleChangeRoom = (event, index, value) => {
        this.setState({ room: value })
    }


    handleChange = (event, index, value) => {
        this.setState({ game: value });
        if (value === "fish") {
            this.setState({ gameID: 11 })
        } else if (value === "bull") {
            this.setState({ gameID: 12 })
        }
    }

    componentDidMount() {
        window.currentPage = this;
        this.showRooms();
    }

    refresh() {
        this.showRooms(true);
    }

    showRooms = () => {

        var cb = function (id, message, arg) {
            if (id !== GET_ROOM_CONFIG_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({ data: message.ri });
            }
            // self.popUpNotice("notice", message.code, "查询成功");
        }

        var obj = {
            // game: parseInt(this.state.gameID),
            // room: this.state.room
            // "language": language
        };

        MsgEmitter.emit(GET_ROOM_CONFIG_C2S, obj, cb, this);
    }

    set_dfs = (max_desk) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, arg) {
            if (id !== SET_ROOM_CONFIG_S2C) {
                return;
            }
            var self = arg[0];

            if (message.code === LOGIC_SUCCESS) {
                self.state.singleRoomInfo.max_desk = arg[1]
                self.setState({ singleRoomInfo: self.state.singleRoomInfo });
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var obj = {
            game: parseInt(this.state.singleRoomInfo.game),
            room: parseInt(this.state.singleRoomInfo.room),
            name: "",
            max_desk: parseInt(max_desk)
            // "language": language
        };

        MsgEmitter.emit(SET_ROOM_CONFIG_C2S, obj, cb, [this, parseInt(max_desk)]);
    }

    DetailDialog = () => {

        if (this.state.selectedOne !== -1) {
            return (<Paper style={{ padding: 20 }}>
                <h4 style={{ textAlign: 'center', marginTop: 10,fontWeight:"bold" }}>最大桌子数修改</h4>
                {Lang[window.Lang].Setting.RoomPage.detail_dialog_title + "   " + Lang[window.Lang].Setting.GamePage[this.state.singleRoomInfo.game].game_name + this.state.singleRoomInfo.name}
                <TextField
                    id={"max_desk" + this.state.singleRoomInfo.game + this.state.singleRoomInfo.room}
                    disabled={false}
                    underlineShow={false}
                    fullWidth={true}
                    multiLine={false}
                    hintText={this.state.singleRoomInfo.max_desk}
                    // onFocus={this.hanldeFocus}
                    // onBlur={(event) => { this.changDialogOpen() } }
                    defaultValue={this.state.max_desk}
                />
                <FlatButton
                    label={Lang[window.Lang].Master.certain_button}
                    primary={true}
                    onTouchTap={() => {
                        this.set_dfs(parseInt(document.getElementById("max_desk" + this.state.singleRoomInfo.game + this.state.singleRoomInfo.room).value))
                    }}
                />
            </Paper>)
        }

    }

    render() {
        return (
            <div>
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.room} - 超级管理员后台`} />
                <ReactDataGrid
                    rowKey="id"
                    columns={[
                        {
                            key: 'game',
                            name: "游戏",
                            resizable: true,
                        },
                        {
                            key: 'room',
                            name: "房号",
                            resizable: true,
                        },
                        {
                            key: "name",
                            name: "房间名",
                            resizable: true,
                        },
                        {
                            key: 'max_desk',
                            name: '最大桌子数',
                            resizable: true,
                        }
                    ]}
                    rowSelection={{
                        showCheckbox: false,
                        selectBy: {
                            isSelectedKey: 'isSelected'
                        }
                    }}
                    rowGetter={(i) => {
                        if (i === -1) {
                            return {}
                        }
                        return {
                            game: Lang[window.Lang].Setting.GamePage[this.state.data[i].game].game_name,
                            room: this.state.data[i].room,
                            name: this.state.data[i].name,
                            max_desk: this.state.data[i].max_desk,
                            isSelected: this.state.selectedOne === i
                        }
                    }}
                    onRowClick={(rowIdx, row) => {
                        if (rowIdx === -1) {
                            return;
                        }
                        this.setState({ selectedOne: rowIdx, singleRoomInfo: this.state.data[rowIdx], max_desk: this.state.data[rowIdx].max_desk })
                        this.state.selectedOne = rowIdx;
                        if (rowIdx > -1) {
                            var desk = document.getElementById("max_desk" + this.state.singleRoomInfo.game + this.state.singleRoomInfo.room);
                            if (desk) {
                                document.getElementById("max_desk" + this.state.singleRoomInfo.game + this.state.singleRoomInfo.room).value = this.state.data[rowIdx].max_desk;
                            }
                        }
                        if (this.state.singleRoomInfo === undefined) {
                            this.state.selectedOne === -1;
                            this.state.singleRoomInfo = {};
                        }
                    }}
                    rowsCount={this.state.data.length}
                    minHeight={400}
                />
                {this.DetailDialog()}
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
        );
    }

}



export default SettingRoom;