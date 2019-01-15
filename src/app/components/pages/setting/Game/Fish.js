import { SINGLE_DESK_C2S, DESK_SCORE_CLEAN_C2S, DESK_SET_STATE_C2S, ADD_ONE_DESK_C2S, REDUCE_DESK_C2S, MODIFY_DESK_C2S, QUERY_GAME_DESK_C2S, DESK_MODIFY_RESULT_S2C, SINGLE_DESK_S2C, DESK_SCORE_CLEAN_S2C, DESK_SET_STATE_S2C, QUERY_FISH_DESK_S2C, GET_DRAW_WATER_COIN_C2S, GET_DRAW_WATER_COIN_S2C, DESK_DRAW_WATER_C2S, DESK_DRAW_WATER_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React from 'react';
import Title from 'react-title-component';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'angonsoft_textfield';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SelectField from 'angon_selectedfield';

import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import ReactDataGrid from 'angon_react_data_grid';


import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';



const gameID = 11;


export default class FishGame extends React.Component {

    errorMessages = {
        numericError: Lang[window.Lang].Setting.GamePage.numericError
    };

    state = {
        type: "",
        open: false,
        canSubmit: false,
        allData: {},
        tilesData: [],
        roomsItem: [],
        room: 1,
        game_df: 1,
        hall_type: 1,
        default_game_df: 1,
        default_hall_type: 1,
        default_exchange_rate: 0,
        game_df_changed: false,
        hall_type_changed: false,
        exchange_rate_changed: false,
        currentDesk: 1,
        alertOpen: false,
        alertType: "notice",
        alertCode: 0,
        alertContent: "",
        selectedOne: undefined,
        singleDeskInfo: { dpi: [] },
        room1_created: 0,
        room1_can_created: 0,
        room2_created: 0,
        room2_can_created: 0,
        onloading: false,
        openPumping: false,
        gen_pumpingValue: '',
        input_pumpingValue: '',
        selected_lv: 1,
        lv: {},
        dialogType: ''
    }

    popUpNotice = (type, code, content) => {
        this.setState({ alertType: type, code: code, content: content, alertOpen: true });
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

    handleChangeRoom = (event, index, value) => {
        this.setState({ room: value })
    }

    handleChangeDF = (event, index, value) => {
        // if (this.state.singleDeskInfo.state !== 2 && value !== this.state.default_game_df) {
        //     this.state.game_df_changed = true;
        //     this.disableButton();
        // } else {
        //     this.state.game_df_changed = false;
        //     this.enableButton();
        // }
        this.setState({ game_df: value })
    }

    handleChangeHall = (event, index, value) => {
        // if (this.state.singleDeskInfo.state !== 2 && value !== this.state.default_hall_type) {
        //     this.state.hall_type_changed = true;
        //     this.disableButton();
        // } else {
        //     this.state.hall_type_changed = false;
        //     this.enableButton();
        // }
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

    handleRefresh = (deskId) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }
        var cb = function (id, message, args) {
            if (id !== SINGLE_DESK_S2C) {
                return;
            }
            var self = args;

            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            if (message.code === LOGIC_SUCCESS) {
                self.state.singleDeskInfo.total_stake = parseInt(message.sdi.total_stake);
                self.state.singleDeskInfo.total_win = parseInt(message.sdi.total_win);
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
        // if (this.state.exchange_rate_changed || this.state.hall_type_changed || this.state.game_df_changed) {
        //     return
        // }
        this.setState({
            canSubmit: true,
        });
    };

    disableButton = () => {
        this.setState({
            canSubmit: false,
        });
    };

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
                var consume_min = Number(document.getElementsByName("consume_min")[0].value);
                var consume_max = Number(document.getElementsByName("consume_max")[0].value);
                var step = Number(document.getElementsByName("step")[0].value);
                var get_out = Number(document.getElementsByName("get_out")[0].value);
                var save = Number(document.getElementsByName("save")[0].value);
                var exchange_rate = Number(document.getElementsByName("exchange_rate")[0].value);
                var patt1 = new RegExp("[\u4e00-\u9fa5]");
                if (patt1.test(patt1) && name.length > 5) {
                    this.popUpNotice("notice", 99019, Lang[window.Lang].ErrorCode[99019]);
                    return;
                }
                if (isNaN(min_coin) || isNaN(consume_min) || isNaN(consume_max) || isNaN(step) || isNaN(get_out) || isNaN(save) || isNaN(exchange_rate)) {
                    this.popUpNotice("notice", 99017, Lang[window.Lang].ErrorCode[99017]);
                    return;
                }
                if (consume_max > 1000) {
                    this.popUpNotice("notice", 99020, Lang[window.Lang].ErrorCode[99020]);
                    return;
                }
                var obj = {
                    "game": gameID,
                    "room": this.state.room,
                    "name": name,
                    "min_coin": min_coin,
                    "consume": [consume_min, consume_max],
                    "step": step,
                    "get_out": get_out,
                    "save": save,
                    "exchange_rate": exchange_rate,
                    "game_df": this.state.game_df,
                    "hall_type": this.state.hall_type
                };
                MsgEmitter.emit(ADD_ONE_DESK_C2S, obj, cb, this);
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
                var desk = Number(document.getElementsByName("desk")[0].value);
                var min_coin = Number(document.getElementsByName("min_coin")[0].value);
                var consume_min = Number(document.getElementsByName("consume_min")[0].value);
                var consume_max = Number(document.getElementsByName("consume_max")[0].value);
                var step = Number(document.getElementsByName("step")[0].value);
                var get_out = Number(document.getElementsByName("get_out")[0].value);
                var save = Number(document.getElementsByName("save")[0].value);
                var exchange_rate = Number(document.getElementsByName("exchange_rate")[0].value);
                var sort = Number(document.getElementsByName("sort")[0].value);
                if (isNaN(desk) || isNaN(min_coin) || isNaN(consume_min) || isNaN(consume_max) || isNaN(step) || isNaN(get_out) || isNaN(save) || isNaN(exchange_rate)) {
                    this.popUpNotice("notice", 99017, Lang[window.Lang].ErrorCode[99017]);
                    return;
                }
                if (consume_max > 1000) {
                    this.popUpNotice("notice", 99020, Lang[window.Lang].ErrorCode[99020]);
                    return;
                }
                var obj = {
                    "game": gameID,
                    "room": this.state.singleDeskInfo.room,
                    "name": name,
                    "desk": desk,
                    "min_coin": min_coin,
                    "consume": [consume_min, consume_max],
                    "step": step,
                    "get_out": get_out,
                    "save": save,
                    "exchange_rate": exchange_rate,
                    "sort": sort,
                    "game_df": this.state.game_df,
                    "hall_type": this.state.hall_type
                };
                MsgEmitter.emit(MODIFY_DESK_C2S, obj, cb, this);
                this.handleClose();
                break;
        }
    };
    handlePumping = (event) => {

    }
    handleDeleteDesk = (event) => {
        this.setState({ type: "delete" });
        if (window.socket === undefined || window.socket.readyState !== 1) {
            return;
        }

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

    constructor(props) {
        super(props);
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

    componentWillUnmount() {
        window.onerror = (error) => { }
    }

    showDesks = () => {
        var cb = (id, message) => {
            if (id !== QUERY_FISH_DESK_S2C) {
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
                    gen_pumpingValue: message.coin
                })
            }
        }
        MsgEmitter.emit(GET_DRAW_WATER_COIN_C2S, {}, cb, this);
    }
    getDeskSetting(id) {
        return this.state.singleDeskInfo;
    }
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
    PumpingDialog() {
        return (
            <div>
                <Paper style={{ marginTop: 10, paddingTop: 3, paddingBottom: 10 }}>
                    <h5>{Lang[window.Lang].Setting.GamePage[11].room[this.state.singleDeskInfo.room] + '--' + this.state.singleDeskInfo.name + '--抽水设置'}</h5>
                    <Divider />
                    <TextField
                        floatingLabelText={'可用额度(币)'}
                        fullWidth={true}
                        disabled={true}
                        hintText="可用额度(币)"
                        value={this.state.gen_pumpingValue}
                    />

                    <br />
                    <TextField
                        middleWidth={true}
                        disabled={false}
                        hintText="设置抽水值(币)"
                        style={{ marginRight: 30 }}
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
                disabled={!this.state.canSubmit}
                onTouchTap={this.submitForm}
            />,
        ];

        return (
            <div>
                <Paper>
                    <Dialog
                        style={{ textAlign: 'center' }}
                        title={this.state.type === "add" ? "创建新桌子" : "修改桌子"}
                        actions={this.state.type === "modify" ? actions : actions[1]}
                        modal={false}
                        desk={this.state.currentDesk}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                        autoScrollBodyContent={true}
                    >
                        {this.state.type === 'add' ? <SelectField
                            name="room"
                            floatingLabelText="房间号"
                            onChange={this.handleChangeRoom}
                            value={this.state.room}
                            middleWidth={true}
                            style={Styles.selecteField2}
                        >
                            <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage[gameID].room[1]} />
                            <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage[gameID].room[2]} />
                        </SelectField> : <div>
                                {this.state.singleDeskInfo.state !== 2 ? <h3>修改参数需要关闭桌子</h3> : ""}
                                {Lang[window.Lang].Setting.GamePage.modify_warning}
                            </div>}

                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="name"
                            // validations="isEmptyString"
                            // validationError={this.wordsError}
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
                            hintText="请输入一个未有的桌号"
                            floatingLabelText="桌号"
                            defaultValue={this.state.currentDesk}
                        /> : ""}
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="min_coin"
                            hintText="请输入最小携带币"
                            floatingLabelText="最小携带(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).min_coin : "1"}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="consume_min"
                            hintText="请输入最小炮数"
                            floatingLabelText="最小炮数"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).consume[0] : "100"}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="consume_max"
                            hintText="请输入最大炮数,不能超过1000"
                            floatingLabelText="最大炮数"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).consume[1] : "1000"}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="step"
                            hintText="输入步长"
                            floatingLabelText="步长"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).step : "100"}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="get_out"
                            hintText="一次取分数"
                            floatingLabelText="一次取分数(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).get_out : "100"}
                        />
                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}

                            name="save"
                            hintText="一次存分数"
                            floatingLabelText="一次存分数(币)"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).save : "100"}
                        />



                        <TextField
                            middleWidth={true}
                            style={Styles.selecteField2}
                            onChange={(e) => {
                                // if (this.state.singleDeskInfo.state !== 2 && document.getElementsByName("exchange_rate")[0].value != this.state.default_exchange_rate) {
                                //     this.state.exchange_rate_changed = true;
                                //     this.disableButton();
                                // } else if (document.getElementsByName("exchange_rate")[0].value == this.state.default_exchange_rate) {
                                //     this.state.exchange_rate_changed = false;
                                //     this.enableButton();
                                // }
                            }}
                            name="exchange_rate"
                            hintText="一币分值"
                            floatingLabelText="一币分值"
                            defaultValue={this.state.type === 'modify' ? this.getDeskSetting(this.state.currentDesk).exchange_rate : "100"}
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

                            name="game_df"
                            floatingLabelText="游戏难度"
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

    handleChangeSelectedLv = (event, index, value) => this.setState({ selected_lv: value });

    handleGetRCPercent = () => {
        console.log('获得返利比');
    }

    handleSetRCPercent = () => {
        console.log('设置返利比');
    }



    render() {

        return (
            <Paper
                style={Styles.noPadding}
            >
                <Title render={(previousTitle) => `${Lang[window.Lang].Statistics.Game.fish} - ${Lang[window.Lang].Setting.game} - ${previousTitle}`} />
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
                <h5 style={Styles.fontLeftFloat}>新手练习场:已开启{this.state.room1_created}, 还可以开启{this.state.room1_can_created - this.state.room1_created}</h5>
                <h5 style={Styles.fontLeftFloat}>欢乐竞技场:已开启{this.state.room2_created}, 还可以开启{this.state.room2_can_created - this.state.room2_created}</h5>
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
                        this.setState({ selectedOne: rowIdx, singleDeskInfo: this.state.tilesData[rowIdx], openPumping: false, input_pumpingValue: '' })
                        if (this.state.singleDeskInfo === undefined) {
                            this.state.selectedOne === undefined;
                            this.state.singleDeskInfo = { consume: [], dpi: [] };
                        }
                        this.state.selectedOne = rowIdx;
                        this.handleGetRCPercent();
                        // this.show();
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
                            isSelected: this.state.selectedOne === i
                        }
                    }}
                    rowHeight={30}
                    rowsCount={this.state.tilesData.length}
                    minHeight={210}
                />
                {this.DeskDialog()}
                {this.operateDialog()}
                <br />
                {this.state.selectedOne === undefined ? "" :
                    <Card
                        key={this.state.singleDeskInfo.room + '_' + this.state.singleDeskInfo.desk}
                        style={{ padding: 0 }}
                    >
                        <CardHeader
                            id={this.state.singleDeskInfo.desk}
                            title={Lang[window.Lang].Setting.GamePage[14].room[this.state.singleDeskInfo.room] + '--' + this.state.singleDeskInfo.name}
                            style={Styles.noPadding}
                        />
                        <CardText
                            style={Styles.noPadding}
                        >
                            <div style={{ paddingTop: 5, paddingBottom: 5, display: 'flex', justifyContent: 'space-between', width: this.state.singleDeskInfo.room === 2 ? '60%' : '44%' }}>
                                <span>总押(分): {parseInt(this.state.singleDeskInfo.total_stake)}</span>
                                <span>总得(分): {parseInt(this.state.singleDeskInfo.total_win)}</span>
                                {this.state.singleDeskInfo.room === 2 ? <span>总抽水额(分)：{(parseInt(this.state.singleDeskInfo.draw) - parseInt(this.state.singleDeskInfo.pour))}</span> : ""}
                                <span>总赢额(分): {parseInt(this.state.singleDeskInfo.total_stake) - parseInt(this.state.singleDeskInfo.total_win) + (parseInt(this.state.singleDeskInfo.draw) - parseInt(this.state.singleDeskInfo.pour))}</span>

                            </div>
                        </CardText>
                        <CardMedia>
                            <ReactDataGrid
                                rowKey="id"
                                columns={[
                                    {
                                        key: "seat",
                                        name: "座位号",
                                        resizable: true
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
                                rowHeight={30}
                                rowsCount={this.state.singleDeskInfo === undefined ? 0 : this.state.singleDeskInfo.dpi.length}
                                minHeight={175}
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
                                        this.setState({
                                            openPumping: false
                                        })
                                        this.handleCloseDesk(this.state.singleDeskInfo.desk);
                                    }
                                }}
                            >
                            </FlatButton>
                            <FlatButton
                                label="修改参数"
                                primary={true}
                                id={this.state.singleDeskInfo.desk + "modify"}
                                onTouchTap={(event) => {
                                    this.setState({ currentDesk: this.state.singleDeskInfo.desk });
                                    this.setState({ type: "modify", openPumping: false, dialogType: '' });
                                    this.state.game_df = this.getDeskSetting(this.state.currentDesk).game_df;
                                    this.state.hall_type = this.getDeskSetting(this.state.currentDesk).hall_type;
                                    if (this.state.singleDeskInfo.state === 2) {
                                        this.enableButton();
                                    } else if (this.state.singleDeskInfo.state === 1) {
                                        this.disableButton();
                                        // this.state.default_game_df = this.getDeskSetting(this.state.currentDesk).game_df;
                                        // this.state.default_hall_type = this.getDeskSetting(this.state.currentDesk).hall_type;
                                        // this.state.default_exchange_rate = this.getDeskSetting(this.state.currentDesk).exchange_rate;
                                        // this.state.game_df_changed = false;
                                        // this.state.hall_type_changed = false;
                                        // this.state.exchange_rate_changed = false;
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
                                        openPumping: false
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
                                        dialogType: 'deleteDesk'
                                    })
                                }}
                            />
                            {this.state.singleDeskInfo.room === 2 ?
                                <FlatButton
                                    label="抽水"
                                    disabled={this.state.openPumping}
                                    primary={true}
                                    onTouchTap={() => {
                                        this.setState({
                                            openPumping: true
                                        })
                                        this.getMaxPumping();
                                    }}
                                /> : ''
                            }
                        </CardActions>
                    </Card>
                }
                {(this.state.openPumping === true && this.state.singleDeskInfo.room === 2) ?
                    this.PumpingDialog() : ''
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
