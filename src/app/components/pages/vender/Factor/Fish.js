import { CHANGE_FISH_FACTOR_C2S, QUERY_FISH_FACTOR_C2S, QUERY_SEAT_SCORE_INFO_C2S, QUERY_GAME_DESK_C2S, CHANGE_FISH_FACTOR_S2C, QUERY_FISH_FACTOR_S2C, QUERY_SEAT_SCORE_INFO_S2C, QUERY_FISH_DESK_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ReactDataGrid from 'angon_react_data_grid';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'angonsoft_textfield';

import { VictoryBar, VictoryChart } from 'victory';

class Fish extends Component {

    state = {
        data: [],
        seat: [],
        deskSeats: [],
        deskFactor: [],
        selectedOne: undefined,
        singleDeskInfo: { consume: [], dpi: [] },
        search_type: 'desk',
        dialogOpen: false,
        selectedSeat: {},
        alertOpen: false,
        alertType: "notice",
        alertCode: 0,
        alertContent: "",
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    setFactor = (room, desk, seat, factor) => {
        if (factor === "" || isNaN(Number(factor)) || Number(factor) < 0) {
            this.popUpNotice("notice", 0, "您的输入无效");
            return;
        }
        var cb = function (id, message, args) {
            if (id !== CHANGE_FISH_FACTOR_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                args.getDeskFactor(args.state.singleDeskInfo.room, args.state.singleDeskInfo.desk);
                args.setState({ dialogOpen: false });
            }
            args.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = {
            ffi: {
                game: 11,
                room: room,
                desk: desk,
                seat: seat,
                factor: Number(factor)
            }
        }
        MsgEmitter.emit(CHANGE_FISH_FACTOR_C2S, obj, cb, this);
    }

    getDeskFactor = (room, desk) => {
        var cb = function (id, message, args) {
            if (id !== QUERY_FISH_FACTOR_S2C) {
                return;
            }
            var self = args;
            if (message.code === LOGIC_SUCCESS) {
                var factors = message.ffi;
                let obj = {};
                // for (let i = 0; i < factors.length; i++) {
                //     if (self.state.deskSeats[factors[i].seat].game === factors[i].game &&
                //         self.state.deskSeats[factors[i].seat].room === factors[i].room &&
                //         self.state.deskSeats[factors[i].seat].desk === factors[i].desk &&
                //         self.state.deskSeats[factors[i].seat].seat === factors[i].seat) {
                //         self.state.deskSeats[factors[i].seat].factor = factors[i].factor
                //     }
                // }
                self.setState({ deskFactor: factors });
            }
        }

        var obj = {
            game: 11,
            room: room,
            desk: desk
        }
        MsgEmitter.emit(QUERY_FISH_FACTOR_C2S, obj, cb, this);
    }

    showSeatsScore = () => {
        var cb = function (id, message, args) {
            if (id !== QUERY_SEAT_SCORE_INFO_S2C) {
                return;
            }
            var self = args;
            if (message.code === LOGIC_SUCCESS) {
                var seats = message.ssi;
                self.state.seat = seats;
                self.setState({ seat: seats });
            }
        }

        var obj = {
            game_id: 11
        }
        MsgEmitter.emit(QUERY_SEAT_SCORE_INFO_C2S, obj, cb, this);
    }

    showDesksScore = () => {
        var cb = function (id, message, args) {
            if (id !== QUERY_FISH_DESK_S2C) {
                return;
            }
            var self = args;
            if (message.code === LOGIC_SUCCESS) {
                var data = message.di;
                if (data.length > 0) {
                    data.sort(function (a, b) {
                        return a.room * 100 + a.desk - b.desk - b.room * 100
                    });
                }

                self.setState({ data: data });
            }
            self.showSeatsScore();
        }

        var obj = {
            game_id: 11
        }
        MsgEmitter.emit(QUERY_GAME_DESK_C2S, obj, cb, this);
    }

    getSeat(seat, key) {
        for (var i = 0; i < this.state.deskSeats.length; i++) {
            if (this.state.deskSeats[i].seat === seat) {
                return this.state.deskSeats[i][key];
            }
        }
        return "获取中"
    }

    getFactorString(seat) {
        return this.getFactor(seat).toFixed(3);
    }

    getFactor(seat) {
        for (var i = 0; i < this.state.deskFactor.length; i++) {
            if (this.state.deskFactor[i].game === this.state.singleDeskInfo.game &&
                this.state.deskFactor[i].room === this.state.singleDeskInfo.room &&
                this.state.deskFactor[i].desk === this.state.singleDeskInfo.desk &&
                this.state.deskFactor[i].seat === seat) {
                return this.state.deskFactor[i].factor;
            }
        }
        // this.getDeskFactor(this.state.singleDeskInfo.room, this.state.singleDeskInfo.desk);
        return 1.0
    }

    componentDidMount() {
        window.currentPage = this;
        this.showDesksScore();
    }

    refresh() {
        this.showDesksScore();
    }

    handleChangeSearchWay = (event, index, value) => {
        this.setState({ search_type: value })

    };

    render() {
        return (
            <div>
                <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.fish} - 座位因子 - 工厂后台`} />
                <ReactDataGrid
                    rowKey="id"
                    columns={[
                        {
                            key: 'room',
                            name: "房间",
                            resizable: true,
                        },
                        {
                            key: 'desk',
                            name: "桌号",
                            resizable: true,
                        },
                        {
                            key: "name",
                            name: "桌名",
                            resizable: true,
                        },
                        {
                            key: 'number_of_players',
                            name: '玩家数',
                            resizable: true,
                        },
                        {
                            key: 'status',
                            name: '状态',
                            resizable: true,
                        },
                        {
                            key: 'total_stake',
                            name: "总玩",
                            resizable: true,
                        },
                        {
                            key: 'total_win',
                            name: "总得",
                            resizable: true,
                        },
                        {
                            key: 'total_draw',
                            name: "总抽水",
                            resizable: true,
                        },
                        {
                            key: 'total_earn',
                            name: "总盈利",
                            resizable: true,
                        },
                        {
                            key: 'earn_rate',
                            name: "盈利比",
                            resizable: true
                        },
                        {
                            key: 'exchange_rate',
                            name: "兑换比例",
                            resizable: true,
                        },
                        {
                            key: 'game_df',
                            name: "游戏难度",
                            resizable: true,
                        },
                        {
                            key: 'hall_type',
                            name: "场地大小",
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
                            room: Lang[window.Lang].Setting.GamePage[11].room[this.state.data[i].room],
                            desk: this.state.data[i].desk,
                            name: this.state.data[i].name,
                            status: this.state.data[i].state === 1 ? "开启" : "关闭",
                            number_of_players: this.state.data[i].dpi.length,
                            total_stake: parseInt(this.state.data[i].total_stake),
                            total_win: parseInt(this.state.data[i].total_win),
                            total_draw: parseInt(this.state.data[i].draw) - parseInt(this.state.data[i].pour),
                            total_earn: parseInt(this.state.data[i].total_stake) - parseInt(this.state.data[i].total_win) + (parseInt(this.state.data[i].draw) - parseInt(this.state.data[i].pour)),
                            earn_rate: parseInt(this.state.data[i].total_win) === 0 ? 0 : parseInt(this.state.data[i].total_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].total_stake) - parseInt(this.state.data[i].total_win) + (parseInt(this.state.data[i].draw) - parseInt(this.state.data[i].pour))) / parseInt(this.state.data[i].total_stake)) / 1000,
                            exchange_rate: this.state.data[i].exchange_rate,
                            game_df: Lang[window.Lang].Setting.GamePage[11].game_df[this.state.data[i].game_df],
                            hall_type: Lang[window.Lang].Setting.GamePage[11].hall_type[this.state.data[i].hall_type],
                            isSelected: this.state.selectedOne === i
                        }
                    }}
                    onRowClick={(rowIdx, row) => {
                        this.state.singleDeskInfo = this.state.data[rowIdx];
                        if (this.state.singleDeskInfo === undefined) {
                            this.state.selectedOne = undefined;
                            this.state.singleDeskInfo = { consume: [], dpi: [] };
                        } else {
                            this.getDeskFactor(this.state.singleDeskInfo.room, this.state.singleDeskInfo.desk);
                            let deskSeats = [];
                            for (var i = 0; i < this.state.seat.length; i++) {
                                if (this.state.singleDeskInfo.desk !== this.state.seat[i].desk || this.state.singleDeskInfo.room !== this.state.seat[i].room) {
                                    continue
                                } else {
                                    deskSeats.push(this.state.seat[i])
                                }
                            }
                            this.state.deskSeats = deskSeats;
                        }
                        this.setState({ selectedOne: rowIdx, singleDeskInfo: this.state.data[rowIdx] });
                        this.state.selectedOne = rowIdx;

                    }}
                    rowsCount={this.state.data.length}
                    minHeight={400}
                />
                {this.state.search_type === 'desk' ? '桌上玩家' : ""}
                <ReactDataGrid
                    rowKey="id"
                    columns={[
                        {
                            key: "seat",
                            name: "座位号",
                            resizable: true,
                            width: 60
                        },
                        {
                            key: 'account',
                            name: "玩家账号",
                            resizable: true,
                        },
                        {
                            key: 'name',
                            name: "玩家昵称",
                            resizable: true,
                        },
                        {
                            key: 'recommend',
                            name: "推广员",
                            resizable: true,
                        },
                        {
                            key: "game_coin",
                            name: "金币数",
                            resizable: true,
                        },
                        {
                            key: 'taste_coin',
                            name: '体验币数',
                            resizable: true,
                        },
                        {
                            key: 'score',
                            name: "当前分数",
                            resizable: true,
                        },

                        {
                            key: 'total_stake',
                            name: "玩家总玩",
                            resizable: true,
                        },
                        {
                            key: 'total_win',
                            name: "玩家总得",
                            resizable: true,
                        }

                    ]}
                    rowGetter={(i) => {
                        if (i === -1) {
                            return {}
                        }
                        return {
                            seat: this.state.singleDeskInfo.dpi[i].seat,
                            account: this.state.singleDeskInfo.dpi[i].account,
                            name: this.state.singleDeskInfo.dpi[i].name,
                            game_coin: this.state.singleDeskInfo.dpi[i].game_coin,
                            taste_coin: this.state.singleDeskInfo.dpi[i].taste_coin,
                            score: this.state.singleDeskInfo.dpi[i].score,
                            recommend: this.state.singleDeskInfo.dpi[i].recommend === "" ? Lang[window.Lang].Master.admin : this.state.singleDeskInfo.dpi[i].recommend,
                            total_stake: Math.round(parseInt(this.state.singleDeskInfo.dpi[i].total_stake) / 1000),
                            total_win: Math.round(parseInt(this.state.singleDeskInfo.dpi[i].total_win) / 1000),
                        }
                    }}
                    rowsCount={this.state.singleDeskInfo === undefined ? 0 : this.state.singleDeskInfo.dpi.length}
                    minHeight={200}
                />
                {apptype === 2 || apptype === 3 ? '座位统计,点击修改座位因子' : ""}
                {apptype === 2 || apptype === 3 ? <ReactDataGrid
                    rowKey="id"
                    columns={[
                        {
                            key: 'room',
                            name: "房间",
                            resizable: true,
                        },
                        {
                            key: 'desk',
                            name: "桌号",
                            resizable: true,
                        },
                        {
                            key: 'seat',
                            name: "座号",
                            resizable: true,
                        },
                        {
                            key: 'seat_stake',
                            name: "总玩",
                            resizable: true,
                        },
                        {
                            key: 'seat_win',
                            name: "总得",
                            resizable: true,
                        },
                        {
                            key: 'seat_earn',
                            name: "总盈利",
                            resizable: true,
                        },
                        {
                            key: 'earn_rate',
                            name: "盈利比",
                            resizable: true
                        },
                        {
                            key: 'factor',
                            name: '因子',
                            resizable: true
                        }
                    ]}
                    rowGetter={(i) => {
                        if (i === -1) {
                            return {}
                        }
                        return {
                            room: Lang[window.Lang].Setting.GamePage[11].room[this.state.deskSeats[i].room],
                            desk: this.getSeat(i + 1, "desk"),
                            seat: this.getSeat(i + 1, "seat"),
                            seat_stake: parseInt(this.getSeat(i + 1, "seat_stake")),
                            seat_win: parseInt(this.getSeat(i + 1, "seat_win")),
                            seat_earn: parseInt(this.getSeat(i + 1, "seat_stake")) - parseInt(this.getSeat(i + 1, "seat_win")),
                            earn_rate: parseInt(this.getSeat(i + 1, "seat_win")) === 0 ? 0 : parseInt(this.getSeat(i + 1, "seat_stake")) === 0 ? 0 : Math.round(1000000 * (parseInt(this.getSeat(i + 1, "seat_stake")) - parseInt(this.getSeat(i + 1, "seat_win")))) / parseInt(this.getSeat(i + 1, "seat_stake")) / 1000,
                            factor: this.getFactorString(i + 1)
                        }
                    }}
                    rowsCount={this.state.deskSeats.length}
                    minHeight={200}
                    onRowClick={(rowIdx, row) => {
                        if (rowIdx === -1) {
                            return;
                        }
                        this.state.selectedSeat = row;
                        this.setState({ dialogOpen: true });

                    }}
                /> : <div />}
                <Dialog
                    title="修改座位因子"
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={() => {
                        this.setState({ dialogOpen: false });
                    }}
                    actions={[<FlatButton
                        label={Lang[window.Lang].Master.certain_button}
                        primary={true}
                        onTouchTap={
                            () => {
                                this.setFactor(this.state.singleDeskInfo.room, this.state.singleDeskInfo.desk, this.state.selectedSeat.seat, document.getElementById("factor_text_field").value);
                            }
                        }
                    />]}
                >
                    <TextField
                        id="factor_text_field"
                        disabled={false}
                        multiLine={false}
                        hintText={this.getFactorString(this.state.selectedSeat.seat)}
                        defaultValue=''
                        fullWidth={false}
                    />
                </Dialog>
                <CommonAlert
                    show={this.state.alertOpen}
                    type="notice"
                    code={this.state.code}
                    content={this.state.content}
                    handleCertainClose={() => {
                        this.setState({ alertOpen: false })
                    }}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false })
                    }}>
                </CommonAlert>
            </div>
        )

    }

}

export default Fish;