import { GET_PRE_RESULT_C2S, GET_PRE_RESULT_S2C, SET_PRE_RESULT_C2S, SET_PRE_RESULT_S2C, QUERY_GAME_DESK_C2S, QUERY_LION_DESK_S2C, QUERY_SEAT_SCORE_INFO_S2C, QUERY_SEAT_SCORE_INFO_C2S } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'angonsoft_textfield';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';

import ReactDataGrid from 'angon_react_data_grid';

import { VictoryBar, VictoryChart } from 'victory';

class Lion extends Component {

    state = {
        data: [],
        selectedOne: undefined,
        singleDeskInfo: { consume: [], dpi: [] },
        deskSeats: [],
        seat: [],
        earnStyle: 'drawWaterEarn',
        pre_result: false,
        current_preResultValue: "",
        input_preResultValue: ""
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
            game_id: 14
        }
        MsgEmitter.emit(QUERY_SEAT_SCORE_INFO_C2S, obj, cb, this);
    }

    showDesksScore = () => {

        var cb = function (id, message, args) {
            if (id !== QUERY_LION_DESK_S2C) {
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
            game_id: 14
        }
        MsgEmitter.emit(QUERY_GAME_DESK_C2S, obj, cb, this);
    }

    handleSelection(selectedRow) {

    }

    componentDidMount() {
        window.currentPage = this;
        this.showDesksScore();
    }

    refresh() {
        this.showDesksScore();
    }

    getSeat(seat, key) {
        for (var i = 0; i < this.state.deskSeats.length; i++) {
            if (this.state.deskSeats[i].seat === seat) {
                return this.state.deskSeats[i][key];
            }
        }
        return "获取中"
    }


    getPreResult = () => {
        var cb = (id, message, arg) => {
            if (id != GET_PRE_RESULT_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    current_preResultValue: message.result,
                    input_preResultValue:""
                })
            }
        }
        
        var obj = {
            game: 14,
            room: this.state.singleDeskInfo.room,
            desk: this.state.singleDeskInfo.desk,
        }
        MsgEmitter.emit(GET_PRE_RESULT_C2S, obj, cb, this);
    }

    // 预设结果
    setPreResult = () => {
        var cb = (id, message, arg) => {
            if (id != SET_PRE_RESULT_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    current_preResultValue: self.state.input_preResultValue
                })
            }
        }
        var obj = {
            game: 14,
            room: this.state.singleDeskInfo.room,
            desk: this.state.singleDeskInfo.desk,
            result: Number(this.state.input_preResultValue),
        }
        MsgEmitter.emit(SET_PRE_RESULT_C2S, obj, cb, this);
    }

    
    PreResult() {
        return (
            <div>
                <Paper style={{ marginTop: 10, paddingTop: 3, paddingBottom: 10 }}>
                    <h5>{Lang[window.Lang].Setting.GamePage[15].room[this.state.singleDeskInfo.room] + '--' + this.state.singleDeskInfo.name + '--预设结果'}</h5>
                    <Divider />
                    <TextField
                        floatingLabelText={'当前预设结果'}
                        fullWidth={true}
                        disabled={true}
                        hintText="当前预设结果"
                        value={this.state.current_preResultValue}
                    />
                    <TextField
                        middleWidth={true}
                        disabled={false}
                        style={{ marginRight: 30 }}
                        hintText="预设结果"
                        value={this.state.input_preResultValue}
                        onChange={(event, value) => {
                            this.setState({
                                input_preResultValue: value
                            })
                        }}
                    />
                    <RaisedButton
                        title={'点击设置抽水值'}
                        label={'确定'}
                        primary={true}
                        onTouchTap={() => {
                            this.setPreResult();
                        }}
                    />
                </Paper>
            </div>
        );
    }

    render() {
        return (
            <div>
                {sessionStorage.accountType === '0' ?
                    <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.lion} - ${Lang[window.Lang].Statistics.desks} - ${previousTitle}`} /> :
                    <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.lion} - 超级管理员后台`} />
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
                            key: 'animal_stake',
                            name: "动物总玩",
                            resizable: true,
                        },
                        {
                            key: 'animal_win',
                            name: "动物总得",
                            resizable: true,
                        },
                        {
                            key: 'total_draw',
                            name: "总抽水",
                            resizable: true
                        },
                        {
                            key: 'animal_earn',
                            name: this.state.earnStyle === 'drawWaterEarn' ? "动物总盈利(含抽水)" : '动物总盈利(不含抽水)',
                            resizable: true,
                        },
                        {
                            key: 'animal_earn_rate',
                            name: this.state.earnStyle === 'drawWaterEarn' ? "动物盈利比(含抽水)" : '动物盈利比(不含抽水)',
                            resizable: true
                        },
                        {
                            key: 'zhx_stake',
                            name: "庄和闲总玩",
                            resizable: true,
                        },
                        {
                            key: 'zhx_win',
                            name: "庄和闲总得",
                            resizable: true,
                        },

                        {
                            key: 'zhx_earn',
                            name: "庄和闲总盈利",
                            resizable: true,
                        },
                        {
                            key: 'zhx_earn_rate',
                            name: "庄和闲盈利比",
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
                            name: "动物难度",
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'zhx_game_df',
                            name: "庄和闲难度",
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'hall_type',
                            name: "场地类型",
                            resizable: true,
                            width: 100
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
                        var drawWaterEarn = parseInt(this.state.data[i].animal_stake) - parseInt(this.state.data[i].animal_win);

                        var noWaterEarn = parseInt(this.state.data[i].animal_stake) - (parseInt(this.state.data[i].animal_win) - parseInt(this.state.data[i].draw) + parseInt(this.state.data[i].pour));

                        var drawWaterEarnRate = parseInt(this.state.data[i].animal_win) === 0 ? 0 : parseInt(this.state.data[i].animal_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].animal_stake) - parseInt(this.state.data[i].animal_win)) / parseInt(this.state.data[i].animal_stake)) / 1000;

                        var noWaterEarnRate = parseInt(this.state.data[i].animal_win) === 0 ? 0 : parseInt(this.state.data[i].animal_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].animal_stake) - (parseInt(this.state.data[i].animal_win) - parseInt(this.state.data[i].draw) + parseInt(this.state.data[i].pour))) / parseInt(this.state.data[i].animal_stake)) / 1000;
                        return {
                            room: Lang[window.Lang].Setting.GamePage[14].room[this.state.data[i].room],
                            desk: this.state.data[i].desk,
                            name: this.state.data[i].name,
                            status: this.state.data[i].state === 1 ? "开启" : "关闭",
                            number_of_players: this.state.data[i].dpi.length,
                            animal_stake: parseInt(this.state.data[i].animal_stake),
                            animal_win: parseInt(this.state.data[i].animal_win),
                            zhx_stake: parseInt(this.state.data[i].zhx_stake),
                            zhx_win: parseInt(this.state.data[i].zhx_win),
                            animal_earn: this.state.earnStyle === 'drawWaterEarn' ? drawWaterEarn : noWaterEarn,
                            animal_earn_rate: this.state.earnStyle === 'drawWaterEarn' ? drawWaterEarnRate : noWaterEarnRate,
                            zhx_earn: parseInt(this.state.data[i].zhx_stake) - parseInt(this.state.data[i].zhx_win),
                            zhx_earn_rate: parseInt(this.state.data[i].zhx_win) === 0 ? 0 : parseInt(this.state.data[i].zhx_stake) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.data[i].zhx_stake) - parseInt(this.state.data[i].zhx_win)) / parseInt(this.state.data[i].zhx_stake)) / 1000,
                            total_draw: parseInt(this.state.data[i].draw) - parseInt(this.state.data[i].pour),
                            exchange_rate: this.state.data[i].exchange_rate,
                            game_df: Lang[window.Lang].Setting.GamePage[14].game_df[this.state.data[i].game_df],
                            zhx_game_df: Lang[window.Lang].Setting.GamePage[14].game_df[this.state.data[i].zhx_game_df],
                            hall_type: Lang[window.Lang].Setting.GamePage[14].hall_type[this.state.data[i].hall_type],
                            isSelected: this.state.selectedOne === i
                        }
                    }}
                    onRowClick={(rowIdx, row) => {
                        this.state.selectedOne = rowIdx;
                        this.state.singleDeskInfo = this.state.data[rowIdx];
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
                            this.setState({
                                deskSeats: deskSeats
                            })
                            this.state.deskSeats = deskSeats;
                            this.getPreResult()
                        }
                        this.setState({ selectedOne: rowIdx, singleDeskInfo: this.state.data[rowIdx] })
                        
                    }}
                    rowHeight={40}
                    rowsCount={this.state.data.length}
                    minHeight={360}
                />
                桌上玩家
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
                    rowHeight={40}
                    rowsCount={this.state.singleDeskInfo === undefined ? 0 : this.state.singleDeskInfo.dpi.length}
                    minHeight={380}
                />
                <FlatButton
                label="预设开奖"
                primary={true}
                onTouchTap={() => {
                    if (this.state.selectedOne === undefined) {
                        return
                    }
                    this.setState({
                        pre_result: true
                    })
                    // this.getPreResult();
                }}/>
            {(this.state.pre_result === true) ? this.PreResult() : ''}
            </div>
        )

    }

}

export default Lion;





