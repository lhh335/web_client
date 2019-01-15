
import { GET_PRE_RESULT_C2S, GET_PRE_RESULT_S2C, SET_PRE_RESULT_C2S, SET_PRE_RESULT_S2C, SINGLE_DESK_C2S, DESK_SCORE_CLEAN_C2S, DESK_SET_STATE_C2S, ADD_ONE_DESK_C2S, REDUCE_DESK_C2S, MODIFY_DESK_C2S, QUERY_GAME_DESK_C2S, DESK_MODIFY_RESULT_S2C, SINGLE_DESK_S2C, DESK_SCORE_CLEAN_S2C, DESK_SET_STATE_S2C, QUERY_LION_DESK_S2C, ADD_LION_DESK_C2S, MODIFY_LION_DESK_C2S, QUERY_LION_RECORD_C2S, QUERY_LION_RECORD_S2C, GET_DRAW_WATER_COIN_C2S, GET_DRAW_WATER_COIN_S2C, DESK_DRAW_WATER_C2S, DESK_DRAW_WATER_S2C, SINGLE_LION_DESK_S2C } from "../../../../proto_enum";

import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'angonsoft_textfield';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SelectField from 'angon_selectedfield';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import ReactDataGrid from 'angon_react_data_grid';


import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Util from '../../../../util';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import CommonTable from '../../../myComponents/Table/CommonTable';



const gameID = 14;


export default class LionGame extends Component {

    constructor(props) {
        super(props);
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(1);

        maxDate.setHours(23, 59, 59, 0);

        this.state = {
            minDate: minDate,
            maxDate: maxDate,
            type: "",
            open: false,
            canSubmit: false,
            allData: {},
            tilesData: [],
            roomsItem: [],
            room: 1,
            game_df: 1,
            hall_type: 1,
            currentDesk: 1,
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            selectedOne: undefined,
            recordSelectedOne: undefined,
            singleDeskInfo: { dpi: [] },
            room1_created: 0,
            room1_can_created: 0,
            room2_created: 0,
            room2_can_created: 0,
            onloading: false,
            max_stake: 500,
            min_stake: 50,
            bankPlay_max_stake: 2000,
            tie_max_stake: 1000,
            all_min_stake: 100,
            animal_rate_table_type: 46,
            animal_rate_type: 2,
            game_df: 1,
            zhx_game_df: 1,
            hall_type: 1,
            zhx_rate: [],
            sort: { time: -1 },
            data: [],
            textValue: '',
            selectedDrawingInnings: false,
            selectedData: { players: [] },
            selectedInnings: '',
            animal_color: [],
            currentPage: 1,
            totalPage: 1,
            rowsPerPage: 10,
            onloading: false,
            allData: [],
            showDrawingRecord: false,
            playerStakeResult: false,
            openPumping: false,
            pre_result: false,
            gen_pumpingValue: '',
            current_preResultValue: "",
            input_pumpingValue: '',
            input_preResultValue: "",
            selected_lv: 1,
            lv: {},
            dialogType: ''
        }
    }

    errorMessages = {
        numericError: Lang[window.Lang].Setting.GamePage.numericError
    };

    popUpNotice = (type, code, content) => {
        this.setState({ alertType: type, code: code, content: content, alertOpen: true });
    }

    handleChangeMinDate = (event, date) => {
        if (date.getTime() < this.state.maxDate.getTime()) {
            date.setHours(this.state.minDate.getHours(), this.state.minDate.getMinutes(), this.state.minDate.getSeconds());
            this.state.minDate = date;
        }
    };

    handleChangeMinTime = (event, date) => {
        this.state.minDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }

    handleChangeMaxDate = (event, date) => {
        date.setHours(this.state.maxDate.getHours(), this.state.maxDate.getMinutes(), this.state.maxDate.getSeconds());
        this.state.maxDate = date;
    };

    handleChangeMaxTime = (event, date) => {
        this.state.maxDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }

    alertActions = [
        <FlatButton
            label={Lang[window.Lang].Master.cancel_button}
            primary={true}
            onTouchTap={this.handleAlertClose}
        />,
        <FlatButton
            label={Lang[window.Lang].Master.certain_button}
            primary={true}
            onTouchTap={this.handleAlertClose}
        />,
    ];


    handleChangeMaxStake = (event, index, value) => {
        this.setState({
            max_stake: value
        })
    }

    handleChangeRoom = (event, index, value) => {
        this.setState({
            room: value
        })
    }

    handleChangeBankPlayMaxStake = (event, index, value) => {
        this.setState({
            bankPlay_max_stake: value
        })
    }

    handleChangeTieMaxStake = (event, index, value) => {
        this.setState({
            tie_max_stake: value
        })
    }

    handleChangeAllMinStake = (event, index, value) => {
        this.setState({
            all_min_stake: value
        })
    }

    handleChangeMinStake = (event, index, value) => {
        this.setState({
            min_stake: value
        })
    }

    handleChangeDF = (event, index, value) => {
        this.setState({
            game_df: value
        })
    }

    handleChangeZhxDf = (event, index, value) => {
        this.setState({
            zhx_game_df: value
        })
    }
    handleChangeHall = (event, index, value) => {
        this.setState({
            hall_type: value
        })
    }
    handleChangeZhxRate = (event, index, value) => {
        this.setState({
            zhx_rate: value
        })
    }
    handleChangeZhxGameDf = (event, index, value) => {
        this.setState({
            zhx_game_df: value
        })
    }
    handleChangeAnimalRateTableType = (event, index, value) => {
        this.setState({
            animal_rate_table_type: value
        })
    }

    getAnimalRate2 = (animal, color, animal_rate) => {
        for (var i = 0; i < animal_rate.length; i++) {
            if (animal_rate[i].animal === animal && animal_rate[i].color === color) {
                return animal_rate[i].rate;
            }
        }
        return ""
    }

    getAnimalRate = (data) => {
        var title_list = []
        for (var key in Lang[window.Lang].Setting.GamePage[14].animal_zhx) {
            var table_title = {}
            if (key.indexOf("_") !== -1) {
                var animal_obj = Util.lion.get_by_animal_color(key);
                var rate = this.getAnimalRate2(animal_obj.animal, animal_obj.color, data.animal_rate);
                table_title.key = key;
                table_title.name = Lang[window.Lang].Setting.GamePage[14].animal_zhx[key]["name"] + "(" + rate + ")";
                table_title.resizable = false;
                // table_title.width = Lang[window.Lang].Setting.GamePage[14].animal_zhx[key]["width"] / 48 * document.getElementsByClassName('react-grid-Container')[0].offsetWidth
            } else {
                table_title.key = key;
                table_title.name = Lang[window.Lang].Setting.GamePage[14].animal_zhx[key]["name"]
                table_title.resizable = false;
                // table_title.width = Lang[window.Lang].Setting.GamePage[14].animal_zhx[key]["width"] / 48 * document.getElementsByClassName('react-grid-Container')[0].offsetWidth
            }
            title_list.push(table_title);
        }
        console.log(title_list)
        return title_list
    }

    handleSelectedInnings = (innings) => {
        var selectedData = {};
        for (var i = 0; i < this.state.data.length; i++) {
            if ((this.state.data[i].innings === innings)) {
                selectedData = this.state.data[i];
            }
        }

        this.state.playerStakeResult = true;
        this.setState({
            selectedData: selectedData,
            playerStakeResult: true,
        })
        this.state.selectedData = selectedData;
        this.state.selectedDrawingInnings = true;
    }

    handleChangeAnimalRateModel = (event, index, value) => {
        this.setState({
            animal_rate_type: value
        })
    }

    handleChangeHall = (event, index, value) => {
        this.setState({ hall_type: value })
    }

    handleTileData = () => {
        var data = [];
        for (var key in this.state.allData) {
            data.push(this.state.allData[key]);
        }
        this.setState({ tilesData: data });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSearchDrawingHistory = (reload = false) => {
        this.state.onloading = true;
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }
        var minDate = this.state.minDate.getTime() / 1000;
        var maxDate = this.state.maxDate.getTime() / 1000;
        if (minDate > maxDate) {
            this.state.onloading = false;
            this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
            return;
        }
        if (reload === true) {
            this.setState({
                data: [],
                allData: [],
                currentPage: 1,
                totalPage: 1
            })
            this.state.data = [];
            this.state.allData = [];
            this.state.currentPage = 1;
            this.state.totalPage = 1;
        }
        var cb = (id, message, arg) => {
            if (id != QUERY_LION_RECORD_S2C) {
                return;
            }
            var self = arg[0];
            self.state.onloading = false;
            if (message.code === LOGIC_SUCCESS) {
                self.handleUpdataAllData(message.lri);
                self.handleUpdata(self.state.currentPage);
                self.setState({
                    totalPage: Util.page.getTotalPage(message.count, self.state.rowsPerPage),
                    count: message.count
                })
                if (message.lri.length === 0 && arg[1] != true) {
                    self.popUpNotice('notice', 0, '该时间段没有相关数据');

                }
                if (arg[1] === true) {
                    if (message.lri.length === 0) {
                        self.setState({
                            recordSelectedOne: undefined,
                            playerStakeResult: false
                        })
                        self.popUpNotice('notice', 0, "没有该期或期号有误");
                        return;
                    }
                    this.state.recordSelectedOne = 0;
                    self.handleSelectedInnings(message.lri[0].innings);
                }
            }
        }
        var searchObj = {};
        var searchInput = document.getElementById('innings_text_field').value;

        var isSearchInnings = searchInput !== "";

        if (isSearchInnings) {
            if (isNaN(searchInput)) {
                this.popUpNotice('notice', 0, '输入的期号有误');
                return;
            }
            if (!isNaN(searchInput) && (Number(searchInput) <= 0 || Number(searchInput) % 1 != 0)) {
                this.popUpNotice('notice', 0, '输入的期号有误');
                return;
            }
            searchObj = {
                innings: Number(searchInput)
            }
        } else {
            searchObj = {
                time: { "$gte": minDate, "$lte": maxDate },
            }
        }

        var obj = {
            filters: JSON.stringify(searchObj),
            room: this.state.singleDeskInfo.room,
            desk: this.state.singleDeskInfo.desk,
            data_length: this.state.allData.length
        }
        MsgEmitter.emit(QUERY_LION_RECORD_C2S, obj, cb, [this, isSearchInnings]);
    }

    showPre = () => {
        this.handleUpdata(this.state.currentPage - 1);
    }

    showNext = () => {
        if (this.state.onloading === true) {
            return;
        } else {
            this.handleUpdata(this.state.currentPage + 1);
        }
        this.state.onloading = false;
    }

    handleUpdata = (page) => {
        this.state.onloading = true;

        if (page <= 0) {
            page = 1;
        }
        if (page > this.state.totalPage) {
            page = this.state.totalPage;
        }
        this.state.currentPage = page;
        if (this.props.player === '') {
            this.state.rowsPerPage = 10;
        }

        if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
            this.handleSearchDrawingHistory();
        } else {
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            // 为每一期开奖 显示 总玩总得
            for (var i = 0; i < data.length; i++) {
                data[i].players = [];
                if (data[i].zhx_stake.length > 0 || data[i].animal_stake > 0) {
                    var player;
                    for (var k = 0; k < data[i].zhx_stake.length; k++) {
                        player = {};
                        player['seat'] = data[i].zhx_stake[k].seat;
                        player['id'] = data[i].zhx_stake[k].id;
                        if (data[i].zhx_stake[k].stake.length > 0) {
                            for (var j = 0; j < data[i].zhx_stake[k].stake.length; j++) {
                                // player['zhx_rate'] = data[i].zhx_stake[k].stake[j].rate;
                                switch (data[i].zhx_stake[k].stake[j].zhx) {
                                    case 1:
                                        player['bank_rate'] = data[i].zhx_stake[k].stake[j].rate;
                                        player['bank'] = data[i].zhx_stake[k].stake[j].score;
                                        break;
                                    case 2:
                                        player['tie_rate'] = data[i].zhx_stake[k].stake[j].rate;
                                        player['tie'] = data[i].zhx_stake[k].stake[j].score;
                                        break;
                                    case 3:
                                        player['play_rate'] = data[i].zhx_stake[k].stake[j].rate;
                                        player['play'] = data[i].zhx_stake[k].stake[j].score;
                                        break;
                                }

                            }
                        }
                        if (data[i].animal_stake[k].stake.length > 0) {
                            for (var j = 0; j < data[i].animal_stake[k].stake.length; j++) {
                                if (data[i].animal_stake[k].stake[j]) {
                                    player[Util.lion.get_animal_color(data[i].animal_stake[k].stake[j].animal)] = data[i].animal_stake[k].stake[j].score;
                                }
                            }
                        }
                        data[i].players.push(player);
                    }
                }
                if (data[i].players.length > 0) {
                    var total_stake = 0;
                    var total_win = 0;
                    for (var j = 0; j < data[i].players.length; j++) {
                        total_stake += Util.lion.player_stake(data[i].players[j]);
                        // total_win += Util.lion.player_win(this.state.totalRecordData[i], j);
                    }
                    for (var win_index = 0; win_index < data[i].pw.length; win_index++) {
                        total_win += Number(data[i].pw[win_index].win)
                    }
                    data[i]['total_stake'] = total_stake;
                    data[i]['total_win'] = total_win;
                } else {
                    data[i]['total_stake'] = 0;
                    data[i]['total_win'] = 0;
                }
            }
            this.state.onloading = false;
            this.setState({ data: data, });
        }
    }

    handleUpdataAllData = (newData) => {
        var animal_color = [];
        // 从开奖结果中 找出每期的 中奖动物 押注比例
        for (var i = 0; i < newData.length; i++) {
            var sub_animal_color = '';
            for (var j = 0; j < newData[i].result.length; j++) {
                sub_animal_color += ((j === 0 ? '' : '、') + (Lang[window.Lang].Setting.GamePage[gameID].animal[newData[i].result[j].animal] + '|' + Lang[window.Lang].Setting.GamePage[gameID].color[newData[i].result[j].color]))
                for (var k = 0; k < newData[i].animal_rate.length; k++) {
                    if (newData[i].result[j].animal === newData[i].animal_rate[k].animal && newData[i].result[j].color === newData[i].animal_rate[k].color) {
                        sub_animal_color += ('(' + newData[i].animal_rate[k].rate + ')');
                    }
                }
            }
            newData[i]['animal_color'] = sub_animal_color;
        }
        var sortData = newData.sort((a, b) => {
            return (b.innings - a.innings)
        })
        this.state.allData = this.state.allData.concat(sortData);
    }

    handleRefresh = (deskId) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, args) {
            if (id !== SINGLE_LION_DESK_S2C) {
                return;
            }
            var self = args;
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            if (message.code === LOGIC_SUCCESS) {
                self.state.singleDeskInfo.animal_stake = parseInt(message.sdi.animal_stake);
                self.state.singleDeskInfo.animal_win = parseInt(message.sdi.animal_win);
                self.state.singleDeskInfo.zhx_stake = parseInt(message.sdi.zhx_stake);
                self.state.singleDeskInfo.zhx_win = parseInt(message.sdi.zhx_win);
                self.state.singleDeskInfo.draw = parseInt(message.sdi.draw);
                self.state.singleDeskInfo.pour = parseInt(message.sdi.pour);
                self.state.singleDeskInfo.dpi = message.sdi.dpi;
                self.setState({
                    singleDeskInfo: self.state.singleDeskInfo
                });
            }
        }
        var obj = {
            game: gameID,
            room: this.state.singleDeskInfo.room,
            desk: deskId,
        }
        MsgEmitter.emit(SINGLE_DESK_C2S, obj, cb, this);
    }

    handleSetZero = (deskId) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, args) {
            if (id !== DESK_SCORE_CLEAN_S2C) {
                return;
            }
            var self = args;
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            if (message.code === LOGIC_SUCCESS) {
                self.state.singleDeskInfo.total_stake = 0;
                self.state.singleDeskInfo.total_win = 0;
                self.state.singleDeskInfo.animal_stake = 0;
                self.state.singleDeskInfo.animal_win = 0;
                self.state.singleDeskInfo.zhx_win = 0;
                self.state.singleDeskInfo.zhx_stake = 0;
                self.state.singleDeskInfo.draw = 0;
                self.state.singleDeskInfo.pour = 0;
                self.setState({ singleDeskInfo: self.state.singleDeskInfo })
            }
            self.setState({
                dialogType: ''
            })
        }
        var obj = {
            game: gameID,
            room: this.state.singleDeskInfo.room,
            desk: deskId,
        }
        MsgEmitter.emit(DESK_SCORE_CLEAN_C2S, obj, cb, this);
    }

    handleCloseDesk = (deskId) => {
        this.state.onloading = true;
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, args) {
            if (id !== DESK_SET_STATE_S2C) {
                return;
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            if (message.code === LOGIC_SUCCESS) {
                self.showDesks();
                self.state.singleDeskInfo.state = args[1];
                self.setState({ singleDeskInfo: self.state.singleDeskInfo })
            }
            self.state.onloading = false;
        }
        var newState = this.state.singleDeskInfo.state === 1 ? 2 : 1;
        var obj = {
            game: gameID,
            room: this.state.singleDeskInfo.room,
            desk: deskId,
            state: newState
        }
        MsgEmitter.emit(DESK_SET_STATE_C2S, obj, cb, [this, newState]);
    }

    enableButton = () => {
        this.setState({
            canSubmit: true,
        });
    };

    disableButton = () => {
        this.setState({
            canSubmit: false,
        });
    };
    // 增加桌子
    submitForm = (data) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, args) {
            if (id !== DESK_MODIFY_RESULT_S2C) {
                return;
            }
            var self = args;
            self.showDesks();
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        }

        switch (this.state.type) {
            case "add":
                var name = document.getElementsByName("name")[0].value;
                // var desk = Number(document.getElementsByName("desk")[0].value);
                var min_coin = Number(document.getElementsByName("min_coin")[0].value);
                var stake_time = Number(document.getElementsByName('stake_time')[0].value);
                var get_out = Number(document.getElementsByName('get_out')[0].value);
                var save = Number(document.getElementsByName('save')[0].value);
                var exchange_rate = Number(document.getElementsByName('exchange_rate')[0].value);
                var bankPlay_max_stake = Number(document.getElementsByName('bankPlay_max_stake')[0].value);
                var tie_max_stake = Number(document.getElementsByName('tie_max_stake')[0].value);
                var all_min_stake = Number(document.getElementsByName('all_min_stake')[0].value);
                var min_stake = Number(document.getElementsByName('min_stake')[0].value);
                var max_stake = Number(document.getElementsByName('max_stake')[0].value);
                var patt1 = new RegExp("[\u4e00-\u9fa5]");
                if (patt1.test(patt1) && name.length > 6) {
                    this.popUpNotice("notice", 99019, Lang[window.Lang].ErrorCode[99019]);
                    return;
                }
                if (isNaN(min_coin) || isNaN(stake_time) || isNaN(get_out) || isNaN(save) || isNaN(exchange_rate) || isNaN(bankPlay_max_stake) || isNaN(tie_max_stake) || isNaN(all_min_stake) || isNaN(min_stake) || isNaN(max_stake)) {
                    this.popUpNotice("notice", 99017, Lang[window.Lang].ErrorCode[99017]);
                    return;
                }
                var zhx_rate = [
                    2, 8, 2
                ]
                var bank = [
                    1, all_min_stake, bankPlay_max_stake
                ]
                var play = [
                    3, all_min_stake, bankPlay_max_stake
                ]
                var tie = [
                    2, all_min_stake, tie_max_stake
                ]
                var obj = {
                    "game": gameID,
                    "room": this.state.room,
                    "name": name,
                    "min_coin": min_coin,
                    "stake_time": stake_time,
                    "min_stake": min_stake,
                    "max_stake": max_stake,
                    "get_out": get_out,
                    "save": save,
                    "exchange_rate": exchange_rate,
                    "animal_rate_table_type": this.state.animal_rate_table_type,
                    "animal_rate_type": this.state.animal_rate_type,
                    "zhx_rate": zhx_rate,
                    "bank": bank,
                    "play": play,
                    "tie": tie,
                    "game_df": this.state.game_df,
                    "hall_type": this.state.hall_type,
                    "zhx_game_df": this.state.zhx_game_df
                };
                MsgEmitter.emit(ADD_LION_DESK_C2S, obj, cb, this);
                this.handleClose();
                break;
            case "delete":
                var obj = {
                    "game": gameID,
                    "room": this.state.singleDeskInfo.room,
                    "desk": Number(document.getElementsByName("desk")[0].value)
                }
                MsgEmitter.emit(REDUCE_DESK_C2S, obj, cb, this);
                this.handleClose();
                break;
            case "modify":
                var name = document.getElementsByName("name")[0].value;
                // var desk = Number(document.getElementsByName("desk")[0].value);
                var min_coin = Number(document.getElementsByName("min_coin")[0].value);
                var stake_time = Number(document.getElementsByName('stake_time')[0].value);
                var get_out = Number(document.getElementsByName('get_out')[0].value);
                var save = Number(document.getElementsByName('save')[0].value);
                var exchange_rate = Number(document.getElementsByName('exchange_rate')[0].value);
                var desk = Number(document.getElementsByName("desk")[0].value);
                var sort = Number(document.getElementsByName("sort")[0].value);
                var bankPlay_max_stake = Number(document.getElementsByName('bankPlay_max_stake')[0].value);
                var tie_max_stake = Number(document.getElementsByName('tie_max_stake')[0].value);
                var all_min_stake = Number(document.getElementsByName('all_min_stake')[0].value);
                var min_stake = Number(document.getElementsByName('min_stake')[0].value);
                var max_stake = Number(document.getElementsByName('max_stake')[0].value);
                if (isNaN(desk) || isNaN(min_coin) || isNaN(stake_time) || isNaN(get_out) || isNaN(save) || isNaN(exchange_rate) || isNaN(bankPlay_max_stake) || isNaN(tie_max_stake) || isNaN(all_min_stake) || isNaN(min_stake) || isNaN(max_stake)) {
                    this.popUpNotice("notice", 99017, Lang[window.Lang].ErrorCode[99017]);
                    return;
                }
                if (all_min_stake > bankPlay_max_stake || all_min_stake > bankPlay_max_stake || all_min_stake > tie_max_stake || min_stake > max_stake) {
                    this.popUpNotice("notice", 99025, Lang[window.Lang].ErrorCode[99025]);
                    return;
                }
                var zhx_rate = [
                    2, 8, 2
                ]
                var bank = [
                    1, all_min_stake, bankPlay_max_stake
                ]
                var play = [
                    3, all_min_stake, bankPlay_max_stake
                ]
                var tie = [
                    2, all_min_stake, tie_max_stake
                ]
                var obj = {
                    "game": gameID,
                    "room": this.state.room,
                    "name": name,
                    "min_coin": min_coin,
                    "stake_time": stake_time,
                    "min_stake": min_stake,
                    "max_stake": max_stake,
                    "get_out": get_out,
                    "save": save,
                    "exchange_rate": exchange_rate,
                    "animal_rate_table_type": this.state.animal_rate_table_type,
                    "animal_rate_type": this.state.animal_rate_type,
                    "zhx_rate": zhx_rate,
                    "bank": bank,
                    "play": play,
                    "tie": tie,
                    "game_df": this.state.game_df,
                    "hall_type": this.state.hall_type,
                    "desk": desk,
                    "sort": sort,
                    "zhx_game_df": this.state.zhx_game_df

                };
                MsgEmitter.emit(MODIFY_LION_DESK_C2S, obj, cb, this);
                this.handleClose();
                break;
        }
    };

    handleDeleteDesk = (event) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        this.setState({ type: "delete" });

        var cb = function (id, message, args) {
            var self = args;
            if (id === DESK_MODIFY_RESULT_S2C) {
                self.showDesks();
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            if (message.code === LOGIC_SUCCESS) {
                self.setState({ singleDeskInfo: { dpi: [] }, selectedOne: undefined });
            }
            self.setState({
                dialogType: ''
            })
        }
        var obj = {
            "game": gameID,
            "room": this.state.singleDeskInfo.room,
            "desk": this.state.singleDeskInfo.desk
        }
        MsgEmitter.emit(REDUCE_DESK_C2S, obj, cb, this);
        this.handleClose();
    }

    handleAddDesk = (event) => {
        this.setState({ type: "add" });
        this.enableButton();
        this.handleOpen();
    }


    componentDidMount() {
        window.currentPage = this;
        this.showDesks();
    }

    refresh() {
        this.showDesks();
    }

    componentWillMount() {
        window.onerror = (error) => {
            if (error === "Script error.") {
                this.popUpNotice("notice", 99017, Lang[window.Lang].ErrorCode[99017]);
            }
        }
    }

    showDesks = () => {
        var cb = (id, message) => {
            if (id !== QUERY_LION_DESK_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                var data = message.di;
                this.state.room1_created = 0;
                this.state.room2_created = 0;
                this.state.room1_can_created = message.room1;
                this.state.room2_can_created = message.room2;
                if (data.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].room === 1) {
                            this.state.room1_created++;
                        } else if (data[j].room === 2) {
                            this.state.room2_created++;
                        }
                    }
                    data.sort(function (a, b) {
                        return a.room * 100 + a.sort - b.sort - b.room * 100
                    });
                    if (this.state.singleDeskInfo !== { dpi: [] }) {
                        var updateDesk = { dpi: [] };
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].room === this.state.singleDeskInfo.room && data[i].desk === this.state.singleDeskInfo.desk) {
                                updateDesk = data[i];
                            }
                        }
                        this.state.singleDeskInfo = updateDesk;
                    }
                }
                this.setState({ tilesData: data });
            }
        }
        MsgEmitter.emit(QUERY_GAME_DESK_C2S, { game_id: gameID }, cb, []);
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== undefined && selectedRow.length === 1) {
            this.state.selectedOne = selectedRow[0];
            this.setState({ singleDeskInfo: this.state.tilesData[this.state.selectedOne] })
            if (this.state.singleDeskInfo === undefined) {
                this.state.selectedOne === undefined;
                this.state.singleDeskInfo = { dpi: [] };
            }
            // this.show();
        }
    }

    getDeskSetting(id) {
        return this.state.singleDeskInfo;
    }

    /**
     * 获取抽水最大额度
     */
    getMaxPumping = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            return;
        }
        var cb = (id, message, arg) => {
            if (id != GET_DRAW_WATER_COIN_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    gen_pumpingValue: message.coin,
                })
            }
        }
        MsgEmitter.emit(GET_DRAW_WATER_COIN_C2S, {}, cb, this);
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
                })
            }
        }
        var obj = {
            game: gameID,
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
                self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
                // self.getPreResult()
            }
        }
        var obj = {
            game: gameID,
            room: this.state.singleDeskInfo.room,
            desk: this.state.singleDeskInfo.desk,
            result: Number(this.state.input_preResultValue),
        }
        MsgEmitter.emit(SET_PRE_RESULT_C2S, obj, cb, this);
    }

    /**
     * 抽水
     */
    setPumpingValue = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            return;
        }
        var cb = (id, message, arg) => {
            if (id != DESK_DRAW_WATER_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    gen_pumpingValue: '',
                    input_pumpingValue: '',
                    openPumping: false
                })
                self.handleRefresh(this.state.singleDeskInfo.desk);
            }
            self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);

        }
        if (isNaN(Number(this.state.input_pumpingValue))) {
            this.popUpNotice('notice', 0, '请输入正确数值');
            return;
        }
        if (Number(this.state.input_pumpingValue) % 1 != 0) {
            this.popUpNotice('notice', 99023, Lang[window.Lang].ErrorCode[99023]);
            return;
        }
        if (Number(this.state.input_pumpingValue) < 0) {
            this.popUpNotice('notice', 99024, Lang[window.Lang].ErrorCode[99024]);
            return;
        }
        if (Number(this.state.input_pumpingValue) > Number(this.state.gen_pumpingValue)) {
            this.popUpNotice('notice', 99026, Lang[window.Lang].ErrorCode[99026]);
            return;
        }
        var obj = {
            game: gameID,
            desk: this.state.singleDeskInfo.desk,
            coin: Number(this.state.input_pumpingValue),
        }
        MsgEmitter.emit(DESK_DRAW_WATER_C2S, obj, cb, this);
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

    PumpingDialog() {
        return (
            <div>
                <Paper style={{ marginTop: 10, paddingTop: 3, paddingBottom: 10 }}>
                    <h5>{Lang[window.Lang].Setting.GamePage[15].room[this.state.singleDeskInfo.room] + '--' + this.state.singleDeskInfo.name + '--抽水设置'}</h5>
                    <Divider />
                    <TextField
                        floatingLabelText={'可用额度(币)'}
                        fullWidth={true}
                        disabled={true}
                        hintText="可用额度(币)"
                        value={this.state.gen_pumpingValue}
                    />
                    <TextField
                        middleWidth={true}
                        disabled={false}
                        style={{ marginRight: 30 }}
                        hintText="设置抽水值(币)"
                        value={this.state.input_pumpingValue}
                        onChange={(event, value) => {
                            this.setState({
                                input_pumpingValue: value
                            })
                        }}
                    />
                    <RaisedButton
                        title={'点击设置抽水值'}
                        label={'确定'}
                        primary={true}
                        onTouchTap={() => {
                            this.setPumpingValue();
                        }}
                    />
                </Paper>
            </div>
        );
    }

    handleCloseOperateDialog = () => {
        this.setState({
            dialogType: ''
        })
    }

    handleExecuteOperate = (operateType) => {
        switch (operateType) {
            case 'zeroData':
                this.handleSetZero(this.state.singleDeskInfo.desk);
                break;
            case 'deleteDesk':
                this.handleDeleteDesk();
                break;
            default:
                break;
        }
    }
    operateDialog = () => {
        const actions = [
            <FlatButton
                label={Lang[window.Lang].Master.cancel_button}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCloseOperateDialog}
            />,

            <FlatButton
                label={Lang[window.Lang].Master.certain_button}
                primary={true}
                onTouchTap={() => {
                    this.handleExecuteOperate(this.state.dialogType);
                }}
            />
        ]
        return (
            <div>
                <Paper>
                    <Dialog
                        title={this.state.dialogType === 'zeroData' ? '您确定要将数据清零?' : this.state.dialogType === 'deleteDesk' ? '您确定将删除该桌子?' : ''}
                        actions={actions}
                        modal={false}
                        open={this.state.dialogType !== ''}
                        onRequestClose={this.handleCloseOperateDialog}
                        autoScrollBodyContent={true}
                        style={{ textAlign: 'center' }}
                    >
                    </Dialog>
                </Paper>

            </div>
        )


    }

    DeskDialog() {
        const actions = [
            <FlatButton
                label={Lang[window.Lang].Master.cancel_button}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,

            <FlatButton
                label={this.state.type === "add" ? "创建" : "修改"}
                primary={true}
                onTouchTap={this.submitForm}
                disabled={!this.state.canSubmit}
            />,
        ];
        return (
            <div>
                <Paper style={this.paperStyle}>
                    <Dialog
                        title={this.state.type === "add" ? "创建新桌子" : "修改桌子"}
                        actions={this.state.type === "modify" ? actions : actions[1]}
                        modal={false}
                        desk={this.state.currentDesk}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                        autoScrollBodyContent={true}
                    >
                        {this.state.type === 'add' ? <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="room"
                            floatingLabelText="房间号"
                            onChange={this.handleChangeRoom}
                            value={this.state.room}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].room[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].room[2]} />
                        </SelectField>
                            : <div>
                                {this.state.singleDeskInfo.state !== 2 ? <h3>修改参数需要关闭桌子</h3> : ""}
                                {Lang[window.Lang].Setting.GamePage.modify_warning}
                            </div>
                        }

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="name"
                            hintText="请输入桌名"
                            floatingLabelText="桌名"
                            defaultValue={this.state.type === 'add' ? ("新的桌子") :
                                this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).name : ""}
                        />


                        {this.state.type === 'modify' ? <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="desk"
                            disabled={this.state.type === 'modify'}
                            hintText="请输入一个未有的桌子"
                            floatingLabelText="桌号"
                            defaultValue={this.state.currentDesk}
                        /> : ""}
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="min_coin"
                            hintText="请输入最小携带"
                            floatingLabelText="最小携带(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).min_coin : 1}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="bankPlay_max_stake"
                            floatingLabelText="庄闲最大押注(分)"
                            floatingLabelFixed={true}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).bank[2] : 2000}
                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="tie_max_stake"
                            floatingLabelText="和最大押注(分)"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeTieMaxStake}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).tie[2] : 1000}
                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="max_stake"
                            floatingLabelText="动物最大押注(分)"
                            floatingLabelFixed={true}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).max_stake : 500}

                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="all_min_stake"
                            floatingLabelText="庄闲和最小押注(分)"
                            floatingLabelFixed={true}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).bank[1] : 100}

                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="min_stake"
                            floatingLabelText="动物最小押注(分)"
                            floatingLabelFixed={true}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).min_stake : 50}

                        />


                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="get_out"
                            hintText="一次取分数"
                            floatingLabelText="一次取分数(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).get_out : 100}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="save"
                            hintText="一次存分数"
                            floatingLabelText="一次存分数(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).save : 100}
                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="exchange_rate"
                            hintText="一币分值"
                            floatingLabelText="一币分值"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).exchange_rate : 100}
                        />

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="stake_time"
                            hintText="押注时间"
                            floatingLabelText="押注时间(s)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).stake_time : 30}
                        />

                        {this.state.type === 'modify' ? <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="sort"
                            hintText="排序位置"
                            floatingLabelText="排序位置"
                            defaultValue={this.getDeskSetting(this.state.currentDesk).sort}
                        /> : ""}
                        <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="animal_rate_table_type"
                            floatingLabelText="赔率表类型"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeAnimalRateTableType}
                            value={this.state.animal_rate_table_type}
                        >
                            <MenuItem value={46} primaryText={Lang[window.Lang].Setting.GamePage[gameID].animal_rate_table_type[46]} />
                            <MenuItem value={68} primaryText={Lang[window.Lang].Setting.GamePage[gameID].animal_rate_table_type[68]} />
                            <MenuItem value={78} primaryText={Lang[window.Lang].Setting.GamePage[gameID].animal_rate_table_type[78]} />
                        </SelectField>

                        <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="animal_rate_type"
                            floatingLabelText="赔率表模式"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeAnimalRateModel}
                            value={this.state.animal_rate_type}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].animal_rate_type[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].animal_rate_type[2]} />
                        </SelectField>
                        <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="zhx_game_df"
                            floatingLabelText="庄闲和难度"
                            floatingLabelFixed={true}
                            onChange={this.handleChangeZhxDf}
                            value={this.state.zhx_game_df}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[2]} />
                            <MenuItem value={3} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[3]} />
                            <MenuItem value={4} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[4]} />
                            <MenuItem value={5} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[5]} />
                        </SelectField>

                        <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            name="game_df"
                            floatingLabelText="动物难度"
                            onChange={this.handleChangeDF}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).game_df : 1}
                            value={this.state.game_df}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[2]} />
                            <MenuItem value={3} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[3]} />
                            <MenuItem value={4} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[4]} />
                            <MenuItem value={5} primaryText={Lang[window.Lang].Setting.GamePage[gameID].game_df[5]} />
                        </SelectField>


                        <SelectField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="hall_type"
                            floatingLabelText="场地类型"
                            onChange={this.handleChangeHall}
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).hall_type : 1}
                            value={this.state.hall_type}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].hall_type[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].hall_type[2]} />
                            <MenuItem value={3} primaryText={Lang[window.Lang].Setting.GamePage[gameID].hall_type[3]} />
                        </SelectField>


                    </Dialog>
                </Paper>
            </div>
        );
    }

    handleShowRecord = () => {
        if (this.state.selectedOne === undefined) {
            this.popUpNotice('notice', 0, '请先选择桌子');
            return;
        }
        this.setState({
            showDrawingRecord: true,
            openPumping: false,
            pre_result: false,
        })
        this.state.data = [];
        this.state.allData = [];
        this.state.currentPage = 1;
        this.state.totalPage = 1;
    }

    get_player_win(id, data) {
        for (var i = 0; i < data.pw.length; i++) {
            if (data.pw[i].id === id) {
                return Number(data.pw[i].win)
            }
        }
        return 0
    }

    handleChangeSelectedLv = (event, index, value) => this.setState({ selected_lv: value });

    handleGetRCPercent = () => {
        console.log('获得返利比');
    }

    handleSetRCPercent = () => {
        console.log('设置返利比');
    }


    render() {
        return (
            < Paper >
                <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.lion} - ${Lang[window.Lang].Setting.game} - ${previousTitle}`} />
                {this.state.showDrawingRecord === false ?
                    <div>
                        <RaisedButton label="创建桌子" style={Styles.raiseButton} onTouchTap={this.handleAddDesk} />
                        {/*<div style={{ margin: '0px 20px 0px 5px', marginTop: 5 }}>
                            <SelectField
                                value={this.state.selected_lv}
                                onChange={this.handleChangeSelectedLv}
                                style={{ float: 'left', marginRight: 20 }}
                                inputStyle={{ paddingLeft: 20 }}
                                middleWidth={true}
                                floatingLabelText={'修改返利级别'}
                                floatingLabelStyle={{ paddingLeft: 25 }}
                            >
                                <MenuItem value={1} key={1} label={'一级返利'} style={{ paddingTop: 10 }}
                                    primaryText={'一级返利'} />
                                <MenuItem value={2} key={2} label={'二级返利'} style={{ paddingTop: 10 }}
                                    primaryText={'二级返利'} />
                                <MenuItem value={3} key={3} label={'三级返利'} style={{ paddingTop: 10 }}
                                    primaryText={'三级返利'} />

                            </SelectField>
                            <TextField
                                middleWidth={true}
                                id="set_rc_percent"
                                disabled={false}
                                multiLine={false}
                                floatingLabelFixed={true}
                                floatingLabelStyle={Styles.floatingLabelStyle}
                                floatingLabelText={'返利比'}
                                inputStyle={Styles.inputStyle}
                                onChange={(event, value) => {

                                }}
                            />
                            <RaisedButton
                                label={Lang[window.Lang].Master.certain_button}
                                primary={true}
                                onTouchTap={() => {
                                    this.handleSetRCPercent();
                                }}
                                style={Styles.raiseButton}
                            />
                        </div>*/}
                        <h5 style={Styles.fontLeftFloat}>新手练习场:已开启{this.state.room1_created}, 还可以开启{(this.state.room1_can_created - this.state.room1_created) < 0 ? 0 : (this.state.room1_can_created - this.state.room1_created)}</h5>
                        <h5 style={Styles.fontLeftFloat}>欢乐竞技场:已开启{this.state.room2_created}, 还可以开启{(this.state.room2_can_created - this.state.room2_created) < 0 ? 0 : (this.state.room2_can_created - this.state.room2_created)}</h5>
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
                                }
                            ]}
                            rowSelection={{
                                showCheckbox: false,
                                selectBy: {
                                    isSelectedKey: 'isSelected'
                                }
                            }}
                            onRowClick={(rowIdx, row) => {
                                if (rowIdx === -1) {
                                    return {};
                                }
                                this.setState({
                                    singleDeskInfo: this.state.tilesData[rowIdx],
                                    openPumping: false,
                                    pre_result: false,
                                    input_pumpingValue: ''
                                })
                                this.state.selectedOne = rowIdx;
                                if (this.state.singleDeskInfo === undefined) {
                                    this.state.selectedOne === undefined;
                                    this.state.singleDeskInfo = { consume: [], dpi: [] };
                                }
                            }}
                            rowGetter={(i) => {
                                if (i === -1) {
                                    return {}
                                }
                                return {
                                    room: Lang[window.Lang].Setting.GamePage[12].room[this.state.tilesData[i].room],
                                    desk: this.state.tilesData[i].desk,
                                    name: this.state.tilesData[i].name,
                                    status: this.state.tilesData[i].state === 1 ? "开启" : "关闭",
                                    number_of_players: this.state.tilesData[i].dpi.length,
                                    isSelected: this.state.selectedOne === i,
                                }
                            }}
                            rowHeight={30}
                            rowsCount={this.state.tilesData.length}
                            minHeight={210}
                        />
                        {this.DeskDialog()}
                        {this.operateDialog()}
                        <br />
                        {
                            this.state.selectedOne === undefined ? "" :
                                <Card
                                    key={this.state.singleDeskInfo.room + '_' + this.state.singleDeskInfo.desk}
                                >
                                    <CardHeader
                                        id={this.state.singleDeskInfo.desk}
                                        title={Lang[window.Lang].Setting.GamePage[14].room[this.state.singleDeskInfo.room] + '--' + this.state.singleDeskInfo.name}
                                        style={Styles.noPadding}
                                    />
                                    <CardText
                                        style={Styles.noPadding}
                                    >

                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: this.state.singleDeskInfo.room === 2 ? "60%" : "44%" }}>
                                            <span>庄闲和总押(分): {parseInt(this.state.singleDeskInfo.zhx_stake)}</span>
                                            <span>庄闲和总得(分): {parseInt(this.state.singleDeskInfo.zhx_win)}</span>
                                            <span>庄闲和总赢额(分): {(parseInt(this.state.singleDeskInfo.zhx_stake) - parseInt(this.state.singleDeskInfo.zhx_win))}</span>
                                        </div>
                                        <div style={{ paddingTop: 5, paddingBottom: 5, display: 'flex', justifyContent: 'space-between', width: this.state.singleDeskInfo.room === 2 ? "60%" : "44%" }}>
                                            <span>动物总押(分): {parseInt(this.state.singleDeskInfo.animal_stake)}</span>
                                            <span>动物总得(分): {parseInt(this.state.singleDeskInfo.animal_win)}</span>
                                            {this.state.singleDeskInfo.room === 2 ? <span>总抽水额(分)：{(parseInt(this.state.singleDeskInfo.draw) - parseInt(this.state.singleDeskInfo.pour))}</span> : ""}
                                            <span>动物总赢额(分): {parseInt(this.state.singleDeskInfo.animal_stake) - parseInt(this.state.singleDeskInfo.animal_win) + (parseInt(this.state.singleDeskInfo.draw) - parseInt(this.state.singleDeskInfo.pour))}</span>
                                        </div>
                                        <RaisedButton label="查看开奖记录" style={{ float: 'right', marginTop: -30 }} onTouchTap={this.handleShowRecord} />
                                    </CardText>
                                    <CardMedia>
                                        <ReactDataGrid
                                            rowKey="id"
                                            columns={[
                                                {
                                                    key: 'seat',
                                                    name: "座位号",
                                                    resizable: true,
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
                                                    account: this.state.singleDeskInfo.dpi[i].account,
                                                    name: this.state.singleDeskInfo.dpi[i].name,
                                                    seat: this.state.singleDeskInfo.dpi[i].seat,
                                                    game_coin: this.state.singleDeskInfo.dpi[i].game_coin,
                                                    taste_coin: this.state.singleDeskInfo.dpi[i].taste_coin,
                                                    score: this.state.singleDeskInfo.dpi[i].score,
                                                    recommend: this.state.singleDeskInfo.dpi[i].recommend === "" ? Lang[window.Lang].Master.admin : this.state.singleDeskInfo.dpi[i].recommend,
                                                    total_stake: Math.round(parseInt(this.state.singleDeskInfo.dpi[i].total_stake) / 1000),
                                                    total_win: Math.round(parseInt(this.state.singleDeskInfo.dpi[i].total_win) / 1000),
                                                }
                                            }}
                                            rowHeight={30}
                                            rowsCount={this.state.singleDeskInfo === undefined ? 0 : this.state.singleDeskInfo.dpi.length}
                                            minHeight={270}
                                        />
                                    </CardMedia>
                                    <CardActions
                                        style={Styles.noPadding}
                                    >
                                        <FlatButton
                                            label={this.state.singleDeskInfo.state === 1 ? "关闭" : "开启"}
                                            primary={true}
                                            id={this.state.singleDeskInfo.desk + "close"}
                                            onTouchTap={(event) => {
                                                if (this.state.onloading) {
                                                    return;
                                                } else {
                                                    this.handleCloseDesk(this.state.singleDeskInfo.desk);
                                                    this.setState({
                                                        openPumping: false,
                                                        pre_result: false
                                                    })
                                                }
                                            }}
                                        >
                                        </FlatButton>
                                        <FlatButton
                                            label="修改参数"
                                            primary={true}
                                            id={this.state.singleDeskInfo.desk + "modify"}
                                            onTouchTap={(event) => {
                                                this.setState({ currentDesk: this.state.singleDeskInfo.desk, textValue: 'modifyChannel' });
                                                this.setState({ type: "modify", openPumping: false, pre_result: false, dialogType: '' });
                                                this.state.game_df = this.getDeskSetting(this.state.currentDesk).game_df;
                                                this.state.zhx_game_df = this.getDeskSetting(this.state.currentDesk).zhx_game_df;
                                                this.state.hall_type = this.getDeskSetting(this.state.currentDesk).hall_type;
                                                this.state.animal_rate_table_type = this.getDeskSetting(this.state.currentDesk).animal_rate_table_type;
                                                this.state.animal_rate_type = this.getDeskSetting(this.state.currentDesk).animal_rate_type;
                                                {/*this.state.bankPlay_max_stake = this.getDeskSetting(this.state.currentDesk).bank[2];
                                                this.state.tie_max_stake = this.getDeskSetting(this.state.currentDesk).tie[2];
                                                this.state.all_min_stake = this.getDeskSetting(this.state.currentDesk).bank[1];
                                                this.state.min_stake = this.getDeskSetting(this.state.currentDesk).min_stake;
                                                this.state.max_stake = this.getDeskSetting(this.state.currentDesk).max_stake;*/}
                                                this.state.room = this.getDeskSetting(this.state.currentDesk).room;
                                                if (this.state.singleDeskInfo.state === 2) {
                                                    this.enableButton();
                                                } else if (this.state.singleDeskInfo.state === 1) {
                                                    this.disableButton();
                                                }
                                                this.handleOpen();
                                            }}
                                        >
                                        </FlatButton>
                                        <FlatButton
                                            label={Lang[window.Lang].Master.refresh}
                                            primary={true}
                                            id={this.state.singleDeskInfo.desk + "refresh"}
                                            onTouchTap={(event) => {
                                                this.handleRefresh(this.state.singleDeskInfo.desk);
                                                this.setState({
                                                    openPumping: false,
                                                    pre_result: false
                                                })
                                            }}
                                        >
                                        </FlatButton>
                                        <FlatButton
                                            label="清零"
                                            primary={true}
                                            id={this.state.singleDeskInfo.desk + "zero"}
                                            onTouchTap={(event) => {

                                                this.setState({
                                                    openPumping: false,
                                                    pre_result: false,
                                                    dialogType: 'zeroData'
                                                })
                                            }}
                                        >
                                        </FlatButton>
                                        <FlatButton
                                            label="删除该桌子"
                                            primary={true}
                                            onTouchTap={() => {
                                                this.setState({
                                                    openPumping: false,
                                                    pre_result: false,
                                                    dialogType: 'deleteDesk'
                                                })
                                            }}
                                        />
                                        {/*<FlatButton
                                            label="预设开奖"
                                            primary={true}
                                            onTouchTap={() => {
                                                this.setState({
                                                    openPumping: false,
                                                    pre_result: true
                                                })
                                                this.getPreResult();
                                            }}
                                        />*/}
                                        {this.state.singleDeskInfo.room === 2 ?
                                            <FlatButton
                                                label="抽水"
                                                primary={true}
                                                onTouchTap={() => {
                                                    this.setState({
                                                        openPumping: true,
                                                        pre_result: false
                                                    })
                                                    this.getMaxPumping();
                                                }}
                                            /> : ''
                                        }
                                        <Divider />
                                    </CardActions>
                                </Card>


                        }
                    </div> : this.state.selectedOne !== undefined ? <div>
                        {/*开奖记录*/}
                        <div style={{ border: "1px solid #fff" }}>
                            <div style={Styles.normalFloat}>
                                <TimeSelector
                                    callbackMinDateFuction={this.handleChangeMinDate}
                                    callbackMinTimeFuction={this.handleChangeMinTime}
                                    callbackMaxDateFuction={this.handleChangeMaxDate}
                                    callbackMaxTimeFuction={this.handleChangeMaxTime}
                                    minDate={this.state.minDate.getTime()}
                                />
                            </div>
                            <div style={{ float: 'left', marginLeft: 15 }}>
                                <TextField
                                    middleWidth={true}
                                    style={{ float: 'left', marginRight: 10, marginTop: 12 }}
                                    hintText="输入期号,精确查找"
                                    id="innings_text_field"
                                    defaultValue={this.state.selectedData.innings}
                                /*onChange={(event, value) => {
                                    this.setState({
                                        selectedInnings: value,
                                    })
                                }}*/
                                />
                            </div>
                            <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={() => {
                                this.handleSearchDrawingHistory(true)
                            }} />
                            <Divider />
                            <div style={{ marginTop: 70 }}>
                                <h5 style={{ float: 'left' }}>{(this.state.singleDeskInfo.room === 1 ? '新手练习场--' : '欢乐竞技场--')}{this.state.singleDeskInfo.name}</h5>
                                <RaisedButton label="返回" style={{ float: 'right' }} onTouchTap={() => {
                                    var minDate = new Date();
                                    var maxDate = new Date();
                                    minDate.setHours(0, 0, 0, 0);
                                    minDate.setDate(1);

                                    maxDate.setHours(23, 59, 59, 0);

                                    this.setState({
                                        showDrawingRecord: false,
                                        data: [],
                                        allData: [],
                                        playerStakeResult: false,
                                        selectedData: { players: [] },
                                        selectedDrawingInnings: false,
                                        minDate: minDate,
                                        maxDate: maxDate
                                    })
                                }} />
                            </div>

                            <div>
                                <CommonTable
                                    table={Lang[window.Lang].Setting.GamePage[14].table}
                                    data={this.state.data}
                                    handleGridSort={(sortColumn, sortDirection) => {
                                        {/*this.state.sort = {}
                                        if (sortDirection === 'ASC') {
                                            this.state.sort[sortColumn] = 1
                                        } else {
                                            this.state.sort[sortColumn] = -1
                                        }
                                        this.takePhoto();*/}
                                    }}
                                    rowGetter={(i) => {
                                        if (i === -1) { return {} }
                                        return {
                                            innings: this.state.data[i].innings,
                                            time: Util.time.getTimeString(this.state.data[i].time),
                                            type: Lang[window.Lang].Setting.GamePage[gameID].type[this.state.data[i].type[0]] + (this.state.data[i].type[0] === 4 ? ('(' + this.state.data[i].result.length + ')') : this.state.data[i].type[0] === 3 ? ('(' + this.state.data[i].type[1] + ')') : ''),
                                            bonus: this.state.data[i].bonus,
                                            animal_color: this.state.data[i].animal_color,
                                            /*special: this.state.data[i].special[0],*/
                                            zhx_stake: this.state.data[i].zhx_result === 1 ? '庄(2)' : this.state.data[i].zhx_result === 2 ? '和(8)' : '闲(2)',
                                            total_stake: this.state.data[i].total_stake,
                                            total_win: this.state.data[i].total_win,
                                            isSelected: this.state.recordSelectedOne === i
                                        }
                                    }}
                                    maxHeight={350}
                                    onRowClick={(rowIdx, row) => {
                                        if (rowIdx === -1) {
                                            return;
                                        }
                                        this.state.recordSelectedOne = rowIdx;
                                        this.handleSelectedInnings(row.innings);
                                    }}
                                />
                                <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton}
                                    onMouseUp={this.showPre} />
                                {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                                <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton}
                                    onMouseUp={this.showNext} />
                            </div>
                            {this.state.playerStakeResult === true ?
                                <div style={{ position: 'relative' }}>


                                    {/*<RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} onTouchTap={(event) => {
                                            this.setState({
                                                selectedDrawingInnings: true,
                                            })
                                            this.state.selectedDrawingInnings = true;
                                            this.handleSelectedInnings(true, this.state.data);
                                            this.handleSearchDrawingHistory();

                                        }} />*/}


                                    {(this.state.selectedData.players.length === 0 && this.state.selectedDrawingInnings === true) ?
                                        <h2 style={{ position: 'absolute', top: 150, textAlign: 'center', color: '#ff0000', zIndex: 10000, width: '100%' }}>该期桌上无玩家</h2> : ''
                                    }
                                    <h5>查询期号：{this.state.selectedData.innings}</h5>
                                    <ReactDataGrid
                                        columns={this.getAnimalRate(this.state.selectedData)}
                                        rowsCount={this.state.selectedData.players.length}
                                        minHeight={290}
                                        rowHeight={30}
                                        rowGetter={(i) => {
                                            if (i === -1) { return {} }
                                            return {
                                                seat: this.state.selectedData.players[i].seat,
                                                id: this.state.selectedData.players[i].id,
                                                bank: this.state.selectedData.players[i].bank,
                                                tie: this.state.selectedData.players[i].tie,
                                                play: this.state.selectedData.players[i].play,
                                                l_r: this.state.selectedData.players[i].l_r,
                                                l_g: this.state.selectedData.players[i].l_g,
                                                l_y: this.state.selectedData.players[i].l_y,
                                                p_r: this.state.selectedData.players[i].p_r,
                                                p_g: this.state.selectedData.players[i].p_g,
                                                p_y: this.state.selectedData.players[i].p_y,
                                                m_r: this.state.selectedData.players[i].m_r,
                                                m_g: this.state.selectedData.players[i].m_g,
                                                m_y: this.state.selectedData.players[i].m_y,
                                                r_r: this.state.selectedData.players[i].r_r,
                                                r_g: this.state.selectedData.players[i].r_g,
                                                r_y: this.state.selectedData.players[i].r_y,
                                                stake: Util.lion.player_stake(this.state.selectedData.players[i]),
                                                win: this.get_player_win(this.state.selectedData.players[i].id, this.state.selectedData)
                                            }
                                        }}
                                    />
                                </div> : ''
                            }
                        </div>
                    </div> : ''
                }
                {
                    (this.state.openPumping === true && this.state.singleDeskInfo.room === 2) ? this.PumpingDialog() : ''
                    //(this.state.pre_result === true) ? this.PreResult() : ''
                }
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.code}
                    content={this.state.content}
                    handleCertainClose={() => {
                        this.setState({ alertOpen: false })
                    }}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false })
                    }}>
                </CommonAlert>
            </Paper >
        )
    }
}
