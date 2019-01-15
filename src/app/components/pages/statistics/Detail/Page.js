import { GET_HALL_SCORE_C2S, QUERY_PLAYER_STATISTICS_C2S, CLEAN_STATISTICS_C2S, GET_HALL_SCORE_S2C, QUERY_PLAYER_STATISTICS_S2C, CLEAN_STATISTICS_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import RaisedButton from 'material-ui/RaisedButton';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';
import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';

import ReactDataGrid from 'angon_react_data_grid';


import { VictoryBar, VictoryChart } from 'victory';

class Detail extends Component {

    state = {
        game_total_stake: 0,
        game_total_win: 0,
        game_total_given: 0,
        game_total_confiscated: 0,
        taste_total_stake: 0,
        taste_total_win: 0,
        game_total_return: 0,
        game_total_unreturn: 0,
        game_total_draw: 0,
        player_count: 0,
        player_online: 0,
    }

    showHallScore = () => {

        var cb = function (id, message, args) {
            if (id !== GET_HALL_SCORE_S2C) {
                return;
            }
            var self = args;
            var data = message.hsi;
            if (message.code === LOGIC_SUCCESS) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type === 2) {
                        self.setState({
                            game_total_stake: Math.round(parseInt(data[i].total_stake / 1000)),
                            game_total_win: Math.round(parseInt(data[i].total_win / 1000)),
                            game_total_given: parseInt(data[i].total_given),
                            game_total_confiscated: parseInt(data[i].total_confiscated),
                            game_total_return: parseInt(data[i].total_return),
                            game_total_unreturn: parseInt(data[i].total_unreturn),
                            game_total_draw: parseInt(data[i].total_draw),
                        });

                    } else {
                        self.setState({ taste_total_stake: Math.round(parseInt(data[i].total_stake / 1000)), taste_total_win: Math.round(parseInt(data[i].total_win / 1000)) });
                    }
                }
            }
            self.showPlayerDetail();
        }

        var obj = {

        }
        MsgEmitter.emit(GET_HALL_SCORE_C2S, obj, cb, this);
    }

    showPlayerDetail = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            return;
        }

        var cb = function (id, message, args) {
            if (id !== QUERY_PLAYER_STATISTICS_S2C) {
                return;
            }
            var self = args;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({ player_count: parseInt(message.count), player_online: parseInt(message.online) });
            }

        }

        var obj = {

        }

        MsgEmitter.emit(QUERY_PLAYER_STATISTICS_C2S, obj, cb, this);
    }

    componentDidMount() {
        window.currentPage = this;
        this.showHallScore();
    }

    refresh() {
        this.showHallScore();
    }

    render() {
        let table = [{ id: "游戏币总玩", result: this.state.game_total_stake },
        { id: "游戏币总得", result: this.state.game_total_win },
        { id: "游戏币总盈利", result: parseInt(this.state.game_total_stake) - parseInt(this.state.game_total_win) },
        { id: "游戏币盈利比", result: parseInt(this.state.game_total_win) === 0 ? 0 : Math.round(1000000 * (parseInt(this.state.game_total_stake) - parseInt(this.state.game_total_win)) / parseInt(this.state.game_total_stake)) / 1000 },
        { id: "游戏币总赠送", result: this.state.game_total_given },
        { id: "游戏币总扣除", result: this.state.game_total_confiscated },
        { id: "玩家提取返利总额", result: this.state.game_total_return },
        { id: "玩家剩余未提取返利", result: this.state.game_total_unreturn },
        { id: "总抽水值", result: this.state.game_total_draw },
        { id: "体验币总玩", result: this.state.taste_total_stake },
        { id: "体验币总得", result: this.state.taste_total_win },
        { id: "注册玩家", result: this.state.player_count },
        { id: "在线玩家", result: this.state.player_online }];
        return (
            <div>
                {sessionStorage.accountType === '0' ?
                    <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.detail} - ${previousTitle}`} /> : sessionStorage.accountType === '2' ?
                        <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.detail} - 超级管理员后台`} /> : <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.detail} - 工厂后台`} />
                }
                {apptype === 2 ?
                    <RaisedButton label={"统计币清零"} style={{ marginLeft: 30 }} primary={true} onMouseUp={() => {
                        MsgEmitter.emit(CLEAN_STATISTICS_C2S, {}, (id, message, args) => {
                            if (id !== CLEAN_STATISTICS_S2C) {
                                return;
                            }
                            var self = args;
                            self.refresh()
                        }, this);
                    }} /> : ''
                }

                <ReactDataGrid
                    columns={[
                        {
                            key: 'id',
                            name: '统计项',
                            resizable: true,
                        },
                        {
                            key: 'result',
                            name: '统计结果',
                            resizable: true
                        }
                    ]}
                    rowGetter={(i) => {
                        if (i === -1) { return {} }
                        return table[i]
                    }}
                    rowsCount={table.length}
                    minHeight={635} />


                {/*<VictoryChart>
                    <VictoryBar
                        data={data}
                        x="quarter"
                        y="earnings"
                    />
                </VictoryChart>*/}
            </div>
        )

    }

}

export default Detail;