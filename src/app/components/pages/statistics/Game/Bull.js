import { QUERY_SEAT_SCORE_INFO_C2S, QUERY_GAME_DESK_C2S, QUERY_SEAT_SCORE_INFO_S2C, QUERY_FISH_DESK_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ReactDataGrid from 'angon_react_data_grid';


import { VictoryBar, VictoryChart } from 'victory';

class Bull extends Component {
    state = {
        data: [],
        seat: [],
        deskSeats: [],
        selectedOne: undefined,
        singleDeskInfo: { consume: [], dpi: [] },
        search_type: 'desk',
        earnStyle: 'drawWaterEarn'
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
                self.handleSelection();
            }
        }

        var obj = {
            game_id: 12
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
            game_id: 12
        }
        MsgEmitter.emit(QUERY_GAME_DESK_C2S, obj, cb, this);
    }

    handleSelection() {
        if (this.state.singleDeskInfo === undefined) {
            this.state.selectedOne = undefined;
            this.state.singleDeskInfo = { consume: [], dpi: [] };
        } else {
            let deskSeats = [];
            for (var i = 0; i < this.state.seat.length; i++) {
                if (this.state.singleDeskInfo.desk !== this.state.seat[i].desk || this.state.singleDeskInfo.room !== this.state.seat[i].room) {
                    continue
                } else {
                    deskSeats.push(this.state.seat[i])
                }
            }
            // this.state.deskSeats = deskSeats;
            this.setState({
                deskSeats: deskSeats
            })
        }
    }

    componentDidMount() {
        window.currentPage = this;
        this.showDesksScore();
    }

    refresh() {
        this.showDesksScore();
    }

    handleChangeSearchWay = (event, index, value) => this.setState({ search_type: value });

    getSeat(seat, key) {
        for (var i = 0; i < this.state.deskSeats.length; i++) {
            if (this.state.deskSeats[i].seat === seat) {
                return this.state.deskSeats[i][key];
            }
        }
        return "获取中"
    }

    render() {
        return (
            <div >
                {sessionStorage.accountType === '0' ?
                    <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.bull} - ${Lang[window.Lang].Statistics.desks} - ${previousTitle}`} /> :
                    <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.bull} - 超级管理员后台`} />
                }
                <RaisedButton label="切换盈利" style={Styles.raiseButton} onTouchTap={() => {
                    this.setState({
                        earnStyle: this.state.earnStyle === 'drawWaterEarn' ? 'noWaterEarn' : 'drawWaterEarn'
                    })
                }} />
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
                            width: 60
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
                            width: 60
                        },
                        {
                            key: 'status',
                            name: '状态',
                            resizable: true,
                            width: 60
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
                            resizable: true
                        },
                        {
                            key: 'total_earn',
                            name: this.state.earnStyle !== 'drawWaterEarn' ? "总盈利(不含抽水)" : '总盈利(含抽水)',
                            resizable: true,
                        },
                        {
                            key: 'earn_rate',
                            name: this.state.earnStyle !== 'drawWaterEarn' ? "盈利比(不含抽水)" : '盈利比(含抽水)',
                            resizable: true
                        },
                        {
                            key: 'exchange_rate',
                            name: "兑换比例",
                            resizable: true,
                            width: 80
                        },
                        {
                            key: 'game_df',
                            name: "游戏难度",
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'hall_type',
                            name: "场地大小",
                            resizable: true,
                            width: 100

                        },

                    ]}
                    rowSelection={{
                        showCheckbox: false,
                        selectBy: {
                            isSelectedKey: 'isSelected'
                        }
                    }}
                    onRowClick={(rowIdx, row) => {
                        this.state.singleDeskInfo = this.state.data[rowIdx];
                        this.handleSelection()
                        this.setState({ selectedOne: rowIdx, singleDeskInfo: this.state.data[rowIdx] });
                        this.state.selectedOne = rowIdx;
                    }}
                    rowGetter={(i) => {
                        if (i === -1) {
                            return {}
                        }
                        var drawWaterEarn = parseInt(this.state.data[i].total_stake) - parseInt(this.state.data[i].total_win);

                        var noWaterEarn = parseInt(this.state.data[i].total_stake) - (parseInt(this.state.data[i].total_win) - parseInt(this.state.data[i].draw) + parseInt(this.state.data[i].pour));

                        var drawWaterEarnRate = parseInt(this.state.data[i].total_win) === 0 ? 0 : parseInt(this.state.data[i].total_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].total_stake) - parseInt(this.state.data[i].total_win)) / parseInt(this.state.data[i].total_stake)) / 1000;

                        var noWaterEarnRate = parseInt(this.state.data[i].total_win) === 0 ? 0 : parseInt(this.state.data[i].total_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].total_stake) - (parseInt(this.state.data[i].total_win) - parseInt(this.state.data[i].draw) + parseInt(this.state.data[i].pour))) / parseInt(this.state.data[i].total_stake)) / 1000
                        return {
                            room: Lang[window.Lang].Setting.GamePage[12].room[this.state.data[i].room],
                            desk: this.state.data[i].desk,
                            name: this.state.data[i].name,
                            status: this.state.data[i].state === 1 ? "开启" : "关闭",
                            number_of_players: this.state.data[i].dpi.length,
                            total_stake: parseInt(this.state.data[i].total_stake),
                            total_win: parseInt(this.state.data[i].total_win),
                            total_earn: this.state.earnStyle === 'drawWaterEarn' ? drawWaterEarn : noWaterEarn,
                            earn_rate: this.state.earnStyle === 'drawWaterEarn' ? drawWaterEarnRate : noWaterEarnRate,
                            total_draw: parseInt(this.state.data[i].draw) - parseInt(this.state.data[i].pour),
                            exchange_rate: this.state.data[i].exchange_rate,
                            game_df: Lang[window.Lang].Setting.GamePage[12].game_df[this.state.data[i].game_df],
                            hall_type: Lang[window.Lang].Setting.GamePage[12].hall_type[this.state.data[i].hall_type],
                            isSelected: this.state.selectedOne === i
                        }
                    }}
                    rowHeight={40}
                    rowsCount={this.state.data.length}
                    minHeight={360}
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
                            width: 100
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
                        if (i === -1) { return {} }
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
                    rowHeight={40}
                    rowsCount={this.state.singleDeskInfo === undefined ? 0 : this.state.singleDeskInfo.dpi.length}
                    minHeight={220}
                />
                {apptype === 2 ? '座位统计' : ""}
                {apptype === 2 ?
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
                                width: 60
                            },
                            {
                                key: 'seat',
                                name: "座号",
                                resizable: true,
                                width: 60
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
                            }
                        ]}
                        rowGetter={(i) => {
                            if (i === -1) {
                                return {}
                            }
                            return {
                                room: Lang[window.Lang].Setting.GamePage[12].room[this.state.deskSeats[i].room],
                                desk: this.getSeat(i + 1, "desk"),
                                seat: this.getSeat(i + 1, "seat"),
                                seat_stake: parseInt(this.getSeat(i + 1, "seat_stake")),
                                seat_win: parseInt(this.getSeat(i + 1, "seat_win")),
                                seat_earn: parseInt(this.getSeat(i + 1, "seat_stake")) - parseInt(this.getSeat(i + 1, "seat_win")),
                                earn_rate: parseInt(this.getSeat(i + 1, "seat_win")) === 0 ? 0 : parseInt(this.getSeat(i + 1, "seat_stake")) === 0 ? 0 : Math.round(1000000 * (parseInt(this.getSeat(i + 1, "seat_stake")) - parseInt(this.getSeat(i + 1, "seat_win")))) / parseInt(this.getSeat(i + 1, "seat_stake")) / 1000,
                            }
                        }}
                        rowHeight={40}
                        rowsCount={this.state.deskSeats.length}
                        minHeight={220}
                    /> : <div />}
            </div>
        )

    }

}

export default Bull;