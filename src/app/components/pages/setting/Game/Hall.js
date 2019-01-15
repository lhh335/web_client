
import { SET_RECHARGE_COIN_URL_C2S, ADD_RECHARGE_RETURN_COIN_S2C, ADD_RECHARGE_RETURN_COIN_C2S, DELETE_RECHARGE_RETURN_COIN_C2S, DELETE_RECHARGE_RETURN_COIN_S2C, SET_RECHARGE_RETURN_COIN_S2C, SET_RECHARGE_RETURN_COIN_C2S, GET_RECHARGE_RETURN_COIN_S2C, GET_RECHARGE_RETURN_COIN_C2S, CHANGE_GAME_ARGS_CONFIG_C2S, CHANGE_GAME_ARGS_CONFIG_S2C, QUERY_GAME_ARGS_CONFIG_C2S, QUERY_GAME_ARGS_CONFIG_S2C, QUERY_GAME_STATUS_C2S, QUERY_SERVER_ARGS_CONFIG_C2S, CHANGE_SERVER_ARGS_CONFIG_C2S, CHANGE_GAME_STATUS_C2S, RECHARGE_ALLOWED_C2S, EXCHANGE_ALLOWED_C2S, RESET_RANKING_C2S, RESET_RANKING_S2C, QUERY_GAME_STATUS_S2C, QUERY_SERVER_ARGS_CONFIG_S2C, CHANGE_SERVER_ARGS_CONFIG_S2C, CHANGE_GAME_STATUS_S2C, TRADE_ALLOWED_S2C, GET_DRAW_WATER_COIN_C2S, GET_DRAW_WATER_COIN_S2C } from "../../../../proto_enum";

import { LOGIC_SUCCESS } from "../../../../ecode_enum";


import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';
import Title from 'react-title-component';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';

import SelectField from 'angon_selectedfield';
import Divider from 'material-ui/Divider';

import TextField from 'angonsoft_textfield';
import MenuItem from 'material-ui/MenuItem';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Util from '../../../../util';


class Hall extends Component {
    state = {
        hall: 1,
        tree: 1,
        bull: 1,
        lion: 1,
        pirate: 1,
        recharge: 1,
        exchange: 1,
        player_big_bang: 0,
        recharge_code_url: "",
        origin_url: "",
        return_coin_rc_percent: "",
        change_bang_value: false,
        alertOpen: false,
        type: "notice",
        origin_bang_value: 0,
        showDetail: "", // bang  url  percent
        rankingDialog: false,
        addRRCDialog: false,
        deleteRRCDialog: false,
        Lv: {},
        selected_lv: 1,
        drawWaterCoin: 0,
        selected_class: 1,
        class_select_items: 0,
        recharge_return_coin: {},
        rrc_items: [],
        selectedButton: ''
    }

    componentWillMount() {
        this.showStatus();
    }
    // 通告提示
    popUpNotice = (type, code, content, handleCertainClose = this.handleCertainClose) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true, handleCertainClose, handleCertainClose });
    }

    handleCertainClose = () => {
        this.setState({ alertOpen: false });
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
                    } else if (message.gsi[i].game === 14) {
                        args[0].setState({ lion: message.gsi[i].state });
                    } else if (message.gsi[i].game === 15) {
                        args[0].setState({ pirate: message.gsi[i].state });
                    }
                }
            }
            this.handleQueryConfig();
        }
        MsgEmitter.emit(QUERY_GAME_STATUS_C2S, {}, cb, [this]);
    }

    handleQueryConfig = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== QUERY_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                var result = [];
                result = message.sai;
                for (var i = 0; i < result.length; i++) {
                    if ((Util.text.unicode_to_string(JSON.parse(result[i]).key)) === "player_recharge") {
                        self.setState({
                            recharge: Number(Util.text.unicode_to_string(JSON.parse(result[i]).value))
                        })
                    } else if ((Util.text.unicode_to_string(JSON.parse(result[i]).key)) === "player_exchange") {
                        self.setState({
                            exchange: Number((Util.text.unicode_to_string(JSON.parse(result[i]).value)))
                        })
                    } else if ((Util.text.unicode_to_string(JSON.parse(result[i]).key)) === "player_big_bang") {
                        self.setState({
                            player_big_bang: Number((Util.text.unicode_to_string(JSON.parse(result[i]).value))),
                            origin_bang_value: Number((Util.text.unicode_to_string(JSON.parse(result[i]).value)))
                        })
                    } else if ((Util.text.unicode_to_string(JSON.parse(result[i]).key)) === "recharge_code_url") {
                        self.setState({
                            recharge_code_url: Util.text.unicode_to_string(JSON.parse(result[i]).value),
                            origin_url: Util.text.unicode_to_string(JSON.parse(result[i]).value)
                        })
                    }
                }
                // self.setState({ recharge: result.player_recharge, exchange: result.player_exchange });
                // self.handleUpdataAllData(result);
                // self.handleUpdata(self.state.currentPage);
                // self.setState({ totalPage: message.count });
                // self.handleUpdata(1);
            }
        }
        var obj = {
            // page: this.state.currentPage
        }

        MsgEmitter.emit(QUERY_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    handleSetRechargeCoinURL = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== SET_RECHARGE_COIN_URL_S2C) {
                return;
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            self.handleQueryConfig(true);
            // var self = args[0];
            // if (message.code === LOGIC_SUCCESS) {
            //     var result = [];
            //     result = message.sai;
            //     self.setState({ data: message.sai });
            //     // self.handleUpdataAllData(result);
            //     // self.handleUpdata(self.state.currentPage);
            //     // self.setState({ totalPage: message.count });
            //     // self.handleUpdata(1);
            // }

            if (message.code === LOGIC_SUCCESS) {

            }
        }

        var obj = {
            url: String(this.state.recharge_code_url)
        }
        MsgEmitter.emit(SET_RECHARGE_COIN_URL_C2S, obj, cb, [this]);
    }

    handleGetRCPercent = () => {
        var cb = (id = 0, message = null, args) => {
            if (id !== QUERY_GAME_ARGS_CONFIG_S2C) {
                return;
            }

            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                var result = message.wai;

                for (var i = 0; i < result.length; i++) {
                    if ((Util.text.unicode_to_string(JSON.parse(result[i]).key)) === "rc_rc_percent") {
                        var rc_percent = Util.text.unicode_to_string(JSON.parse(result[i]).value);
                        while (rc_percent.indexOf(" ") != -1) {
                            rc_percent = rc_percent.replace(" ", "");
                        }
                        var lv_list = rc_percent.replace("[{", "").replace("}]", "").split("},{");
                        var Lv = {}
                        for (var lv = 0; lv < lv_list.length; lv++) {
                            Lv[lv_list[lv].split(",")[0]] = lv_list[lv].split(",")[1]
                        }
                        self.setState({
                            showDetail: "percent",
                            Lv: Lv
                        })
                    }
                }
            }
        }

        var obj = {
            // page: this.state.currentPage
        }

        MsgEmitter.emit(QUERY_GAME_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    handleGetRRC = (update = false, selected = 0) => {
        var cb = (id = 0, message = null, args) => {
            if (id !== GET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                this.state.recharge_return_coin = [];
                for (var i = 0; i < message.rrci.length; i++) {
                    this.state.recharge_return_coin[message.rrci[i].class] = message.rrci[i];
                }
                this.state.rrc_items = message.rrci.sort((a, b) => {
                    return a.class - b.class;
                });
                if (args[1] && selected != 0) {
                    this.state.selected_class = selected
                } else {
                    this.state.selected_class = message.rrci[0].class;
                }


                this.setState({
                    /*change_bang_value: true,*/
                    recharge_return_coin: this.state.recharge_return_coin,
                    showDetail: "recharge_return_coin",
                })
            }
            // var self = args[0];
            // self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var obj = {}

        MsgEmitter.emit(GET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this, update]);
    }

    handleAddRRC = (number, return_coin) => {
        var cb = (id = 0, message = null, args) => {
            if (id !== ADD_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            console.log(message);
            if (message.code === LOGIC_SUCCESS) {
                var self = args[0];
                self.handleCloseDialog();
                self.handleGetRRC(true, message.class);
            }
        }
        if (isNaN(number) || isNaN(return_coin)) {
            this.popUpNotice('notice', 99021, Lang[window.Lang].ErrorCode[99021]);
            return;
        } else {
            if (Number(number) % 1 != 0 || Number(return_coin) % 1 != 0) {
                this.popUpNotice('notice', 99023, Lang[window.Lang].ErrorCode[99023]);
                return;
            }
            if (Number(number) < 0 || Number(return_coin) < 0) {
                this.popUpNotice('notice', 99024, Lang[window.Lang].ErrorCode[99024]);
                return;
            }
        }
        var obj = {
            rrci: { "class": 0, "number": Number(number), "return_coin": Number(return_coin) }
        }
        MsgEmitter.emit(ADD_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    handleDeleteRRC = (delete_class) => {
        var cb = (id = 0, message = null, args) => {
            if (id !== DELETE_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            console.log(message);
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                self.handleCloseDialog();
                self.handleGetRRC(true);
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = { class: delete_class }
        MsgEmitter.emit(DELETE_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    handleSetRRC = (class_index, number, return_coin) => {
        var cb = (id = 0, message = null, args) => {
            if (id !== SET_RECHARGE_RETURN_COIN_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                self.handleGetRRC();
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = {
            rrci: { "class": class_index, "number": Number(number), "return_coin": Number(return_coin) }
        }
        MsgEmitter.emit(SET_RECHARGE_RETURN_COIN_C2S, obj, cb, [this]);
    }

    handleSetRCPercent = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== CHANGE_GAME_ARGS_CONFIG_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                var self = args[0];
                self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
            }
        }

        var new_value = "[{1," + this.state.Lv["1"] + "}, {2," + this.state.Lv["2"] + "}, {3," + this.state.Lv["3"] + "}]"
        if (document.getElementById('set_rc_percent') === '') {
            this.popUpNotice('notice', 0, '数据不能为空');
            return;
        }
        var obj = {
            target_key: "rc_rc_percent",
            new_key: "rc_rc_percent",
            new_value: new_value
        }
        MsgEmitter.emit(CHANGE_GAME_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    handleSetBang = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== CHANGE_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            self.handleQueryConfig(true);
            // var self = args[0];
            // if (message.code === LOGIC_SUCCESS) {
            //     var result = [];
            //     result = message.sai;
            //     self.setState({ data: message.sai });
            //     // self.handleUpdataAllData(result);
            //     // self.handleUpdata(self.state.currentPage);
            //     // self.setState({ totalPage: message.count });
            //     // self.handleUpdata(1);
            // }

            if (message.code === LOGIC_SUCCESS) {

            }
        }
        if (this.state.player_big_bang >= 0) {
            if (this.state.player_big_bang >= 1000000000) {
                self.popUpNotice("notice", 0, '设置的爆机值过大');
            } else {
                var obj = {
                    target_key: 'player_big_bang',
                    new_key: 'player_big_bang',
                    new_value: String(this.state.player_big_bang)
                }
                MsgEmitter.emit(CHANGE_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
            }

        } else {
            self.popUpNotice("notice", 0, '设置的爆机值有误');
        }
    }

    getDrawWaterCoin = () => {
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
                    drawWaterCoin: message.coin
                })
            }
        }
        MsgEmitter.emit(GET_DRAW_WATER_COIN_C2S, {}, cb, this);
    }

    handleChangeSelectedClass = (event, index, value) => this.setState({ selected_class: value });

    handleChangeSelectedLv = (event, index, value) => this.setState({ selected_lv: value });

    getRechargeReturnCoinItem = () => {
        var items = [];
        for (var k = 0; k < this.state.rrc_items.length; k++) {
            items.push(<MenuItem value={this.state.rrc_items[k].class} key={this.state.rrc_items[k].class} label={'类型' + this.state.rrc_items[k].class} style={{ paddingTop: 10 }}
                primaryText={'类型' + this.state.rrc_items[k].class} />)
        }
        return items;
    }


    Detail = () => {
        if (this.state.showDetail === "bang") {
            return (
                <Paper style={{ padding: 10 }}>
                    <h5 style={{ paddingBottom: 10, paddingLeft: 20 }}>当前爆机值:{this.state.origin_bang_value}</h5>
                    <FlatButton
                        label={'收起'}
                        primary={true}
                        onTouchTap={(event) => {
                            this.setState({
                                showDetail: ""
                            })
                        }}
                    />
                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-start' }}>
                        <TextField
                            middleWidth={true}
                            id="set_bang_value"
                            disabled={false}
                            multiLine={false}
                            floatingLabelFixed={true}
                            floatingLabelStyle={Styles.floatingLabelStyle}
                            floatingLabelText={'爆机值'}
                            inputStyle={Styles.inputStyle}
                            value={this.state.player_big_bang}
                            onChange={(event, value) => {
                                this.setState({
                                    player_big_bang: Number(value)
                                })
                            }}
                        />
                        <FlatButton
                            // label={Lang[window.Lang].Master.refresh}
                            label={"100万"}
                            secondary={true}
                            disabled={this.state.player_big_bang === 1000000 ? true : false}
                            onTouchTap={(event) => {
                                this.setState({
                                    player_big_bang: 1000000
                                })
                            }}
                            style={Styles.big_bang}
                        />
                        <FlatButton
                            label={"200万"}
                            secondary={true}
                            disabled={this.state.player_big_bang === 2000000 ? true : false}
                            onTouchTap={(event) => {
                                this.setState({
                                    player_big_bang: 2000000
                                })
                            }}
                            style={Styles.big_bang}

                        />
                        <FlatButton
                            label={"300万"}
                            secondary={true}
                            disabled={this.state.player_big_bang === 3000000 ? true : false}
                            onTouchTap={(event) => {
                                this.setState({
                                    player_big_bang: 3000000
                                })

                            }}
                            style={Styles.big_bang}

                        />
                        <FlatButton
                            label={"500万"}
                            secondary={true}
                            disabled={this.state.player_big_bang === 5000000 ? true : false}
                            onTouchTap={(event) => {
                                this.setState({
                                    player_big_bang: 5000000
                                })
                            }}
                            style={Styles.big_bang}

                        />
                        <FlatButton
                            label={"1000万"}
                            secondary={true}
                            disabled={this.state.player_big_bang === 10000000 ? true : false}
                            onTouchTap={(event) => {
                                this.setState({
                                    player_big_bang: 10000000
                                })
                            }}
                            style={Styles.big_bang}

                        />
                    </div>
                    <RaisedButton
                        label={Lang[window.Lang].Master.certain_button}
                        primary={true}
                        onTouchTap={() => {
                            this.handleSetBang();

                        }}
                        style={Styles.big_bang}

                    />
                </Paper>
            )
        } else if (this.state.showDetail === "url") {
            return (
                <Paper style={{ padding: 10 }}>
                    <h5 style={{ paddingBottom: 10, paddingLeft: 20 }}>当前地址:{this.state.origin_url}</h5>
                    <FlatButton
                        label={'收起'}
                        primary={true}
                        onTouchTap={(event) => {
                            this.setState({
                                showDetail: ""
                            })
                        }}
                    />
                    <Divider />
                    <TextField
                        fullWidth={true}
                        id="set_recharge_code_url"
                        disabled={false}
                        multiLine={false}
                        floatingLabelFixed={true}
                        floatingLabelStyle={Styles.floatingLabelStyle}
                        floatingLabelText={'充值码地址'}
                        inputStyle={Styles.inputStyle}
                        value={this.state.recharge_code_url}
                        onChange={(event, value) => {
                            this.setState({
                                recharge_code_url: value
                            })
                        }}
                    />
                    <RaisedButton
                        label={Lang[window.Lang].Master.certain_button}
                        primary={true}
                        onTouchTap={() => {
                            this.handleSetRechargeCoinURL();
                        }}
                        style={Styles.raiseButton}
                    />
                </Paper>
            )
        } else if (this.state.showDetail === "percent") {
            return (
                <Paper style={{ padding: 10 }}>
                    <FlatButton
                        label={'收起'}
                        primary={true}
                        onTouchTap={(event) => {
                            this.setState({
                                showDetail: ""
                            })

                        }}
                    />
                    <Divider />
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
                        value={this.state.Lv[this.state.selected_lv]}
                        onChange={(event, value) => {
                            if (isNaN(value)) {
                                this.popUpNotice('notice', 0, '请输入0--1之间的小数');
                                return;
                            }
                            if (Number(value) < 0 || Number(value) > 1) {
                                this.popUpNotice('notice', 0, '返利比须在0--1之间');
                                return;
                            }
                            this.state.Lv[this.state.selected_lv] = value
                            this.setState({
                                Lv: this.state.Lv
                            })
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
                </Paper>
            )

        } else if (this.state.showDetail === "water") {
            return (
                <Paper style={{ padding: 10 }}>
                    <h5 style={{ paddingBottom: 10, paddingLeft: 20 }}>当前可用抽水额度:{this.state.drawWaterCoin}</h5>
                    <FlatButton
                        label={'收起'}
                        primary={true}
                        onTouchTap={(event) => {
                            this.setState({
                                showDetail: ""
                            })
                        }}
                    />
                </Paper>
            )
        } else if (this.state.showDetail === "recharge_return_coin") {
            return (
                <Paper style={{ padding: 10 }}>
                    <FlatButton
                        label={'收起'}
                        primary={true}
                        onTouchTap={(event) => {
                            this.setState({
                                showDetail: ""
                            })
                        }}
                    />
                    <Divider />
                    <SelectField
                        value={this.state.selected_class}
                        onChange={this.handleChangeSelectedClass}
                        style={{ float: 'left', marginRight: 20 }}
                        inputStyle={{ paddingLeft: 20 }}
                        middleWidth={true}
                        floatingLabelText={'修改充值返回金币'}
                        floatingLabelStyle={{ paddingLeft: 25 }}
                    >
                        {this.getRechargeReturnCoinItem()}
                    </SelectField>
                    <TextField
                        middleWidth={true}
                        id="set_number"
                        disabled={false}
                        multiLine={false}
                        floatingLabelFixed={true}
                        floatingLabelStyle={Styles.floatingLabelStyle}
                        floatingLabelText={'数量'}
                        inputStyle={Styles.inputStyle}
                        value={this.state.recharge_return_coin[this.state.selected_class].number}
                        onChange={(event, value) => {
                            this.state.recharge_return_coin[this.state.selected_class].number = value
                            this.setState({
                                recharge_return_coin: this.state.recharge_return_coin
                            })
                        }}
                    />
                    <TextField
                        middleWidth={true}
                        id="set_return_coin"
                        disabled={false}
                        multiLine={false}
                        floatingLabelFixed={true}
                        floatingLabelStyle={Styles.floatingLabelStyle}
                        floatingLabelText={'金额'}
                        inputStyle={Styles.inputStyle}
                        value={this.state.recharge_return_coin[this.state.selected_class].return_coin}
                        onChange={(event, value) => {
                            this.state.recharge_return_coin[this.state.selected_class].return_coin = value
                            this.setState({
                                recharge_return_coin: this.state.recharge_return_coin
                            })
                        }}
                    />
                    <RaisedButton
                        label={Lang[window.Lang].Master.certain_button}
                        primary={true}
                        onTouchTap={() => {
                            var class_index = Number(this.state.selected_class);
                            var number = document.getElementById("set_number").value;
                            var return_coin = (document.getElementById("set_return_coin").value);
                            if (number.indexOf(".") !== -1 || isNaN(Number(number)) || Number(number) < 0) {
                                this.popUpNotice("notice", 0, "填入数量应该为正整数");
                                return
                            } else if (return_coin.indexOf(".") !== -1 || isNaN(Number(return_coin)) || Number(return_coin) < 0) {
                                this.popUpNotice("notice", 0, "填入金额应该为正整数");
                                return
                            }
                            this.handleSetRRC(class_index, number, return_coin);
                        }}
                        style={Styles.raiseButton}
                    />
                    <RaisedButton
                        label={"新增类型"}
                        primary={true}
                        onTouchTap={() => {
                            var maxType;
                            for (var i = 0; i < this.state.rrc_items.length; i++) {
                                maxType = this.state.rrc_items[0].class;
                                if (maxType < this.state.rrc_items[i].class) {
                                    maxType = this.state.rrc_items[i].class;
                                }

                            }
                            this.setState({
                                addRRCDialog: true,
                                maxType: maxType
                            })
                        }}
                        style={Styles.raiseButton}
                    />
                    <RaisedButton
                        label={"删除所选类型"}
                        primary={true}
                        onTouchTap={() => {
                            this.setState({
                                deleteRRCDialog: true
                            })
                        }}
                        style={Styles.raiseButton}
                    />

                </Paper>
            )
        } else {
            return ""
        }

    }
    handleCloseDialog = () => {
        this.setState({ rankingDialog: false, addRRCDialog: false, deleteRRCDialog: false });
    }
    deleteRRCDialog = () => {
        return (
            <div>
                <Dialog
                    style={{ textAlign: 'center' }}
                    title="确定删除该类型的充值返利？"
                    actions={[
                        <FlatButton
                            label="确定"
                            primary={true}
                            onClick={() => {
                                this.handleDeleteRRC(this.state.selected_class);
                            }
                            }
                        />,
                        <FlatButton
                            label="取消"
                            primary={true}
                            onClick={() => {
                                this.setState({
                                    deleteRRCDialog: false
                                })
                            }}
                        />,
                    ]}
                    modal={false}
                    open={this.state.deleteRRCDialog}
                    onRequestClose={this.handleCloseDialog}
                >

                </Dialog>
            </div>
        )
    }
    addRRCDialog = () => {
        return (
            <div>
                <Dialog
                    style={{ textAlign: 'center' }}
                    title="新增充值返利类型"
                    actions={[
                        <FlatButton
                            label="确定"
                            primary={true}
                            onClick={() => {
                                var coin = document.getElementById('recharge_return_coin').value;
                                var num = document.getElementById('recharge_return_num').value;
                                this.handleAddRRC(num, coin);
                            }
                            }
                        />,
                        <FlatButton
                            label="取消"
                            primary={true}
                            onClick={() => {
                                this.setState({
                                    addRRCDialog: false
                                })
                            }}
                        />,
                    ]}
                    modal={false}
                    open={this.state.addRRCDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                    <TextField
                        middleWidth={true}
                        id="recharge_return_type"
                        style={{ marginRight: 35 }}
                        hintText={'类型' + (this.state.maxType + 1)}
                        disabled={true}
                    />
                    <TextField
                        middleWidth={true}
                        id="recharge_return_num"
                        hintText={'数量'}
                        style={{ marginRight: 35 }}
                    />
                    <TextField
                        middleWidth={true}
                        id='recharge_return_coin'
                        hintText={'金额'}
                        style={{ marginRight: 35 }}
                    />
                </Dialog>
            </div>
        )
    }
    rankingDialog = () => {
        return (
            <div>
                <Dialog
                    style={{ textAlign: 'center' }}
                    title="您即将重置排行榜"
                    actions={[

                        <FlatButton
                            label="确定"
                            primary={true}
                            keyboardFocused={true}
                            onClick={() => {
                                var cb = (id, message, args) => {
                                    if (id != RESET_RANKING_S2C) {
                                        return;
                                    }
                                    var self = args[0];
                                    if (message.code === LOGIC_SUCCESS) {
                                        self.setState({
                                            rankingDialog: false
                                        })
                                        self.popUpNotice('notice', message.code, Lang[window.Lang].Master.action_success)
                                    }
                                }
                                MsgEmitter.emit(RESET_RANKING_C2S, {}, cb, [this]);
                            }}
                        />,
                        <FlatButton
                            label="取消"
                            primary={true}
                            onClick={() => {
                                this.setState({
                                    rankingDialog: false
                                })
                            }}
                        />,
                    ]}
                    modal={false}
                    open={this.state.rankingDialog}
                    onRequestClose={this.handleCloseDialog}
                >
                </Dialog>
            </div>
        );
    }
    render() {
        return <div>
            {sessionStorage.accountType === '2' ?
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.game_hall} - 超级管理员后台`} /> :
                <Title render={(previousTitle) => `${Lang[window.Lang].Setting.game_hall} - ${Lang[window.Lang].Setting.game} - ${previousTitle}`} />
            }
            <div style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
                <Toggle
                    label={this.state.hall === 1 ? "关闭大厅" : "开启大厅"}
                    style={{
                        marginBottom: 16,
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30

                    }}
                    disabled={this.state.hall === 3}
                    labelPosition="right"
                    defaultToggled={this.state.hall === 1 ? true : false}
                    toggled={this.state.hall === 1 ? true : false}
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
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30

                    }}
                    labelPosition="right"
                    defaultToggled={this.state.tree === 1 ? true : false}
                    toggled={this.state.tree === 1 ? true : false}
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
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30
                    }}
                    labelPosition="right"
                    defaultToggled={this.state.bull === 1 ? true : false}
                    toggled={this.state.bull === 1 ? true : false}
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
                <Toggle
                    label={this.state.lion === 1 ? "关闭幸运六狮" : "开启幸运六狮"}
                    style={{
                        marginBottom: 16,
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30

                    }}
                    labelPosition="right"
                    defaultToggled={this.state.lion === 1 ? true : false}
                    toggled={this.state.lion === 1 ? true : false}
                    onToggle={(e, isOn) => {
                        var cb = (id, message, args) => {
                            if (id !== CHANGE_GAME_STATUS_S2C) {
                                return;
                            }
                            if (message.code === LOGIC_SUCCESS) {
                                args[0].state.lion = args[1];
                                args[0].setState({ game_states: args[0].state.game_states });
                            }
                        }
                        let state = isOn === true ? 1 : 2;
                        MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, { game: 14, state: state }, cb, [this, state]);
                    }}
                />
                <Toggle
                    label={this.state.pirate === 1 ? "关闭海盗船" : "开启海盗船"}
                    style={{
                        marginBottom: 16,
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30

                    }}
                    labelPosition="right"
                    defaultToggled={this.state.pirate === 1 ? true : false}
                    toggled={this.state.pirate === 1 ? true : false}
                    onToggle={(e, isOn) => {
                        var cb = (id, message, args) => {
                            if (id !== CHANGE_GAME_STATUS_S2C) {
                                return;
                            }
                            if (message.code === LOGIC_SUCCESS) {
                                args[0].state.pirate = args[1];
                                args[0].setState({ game_states: args[0].state.game_states });
                            }
                        }
                        let state = isOn === true ? 1 : 2;
                        MsgEmitter.emit(CHANGE_GAME_STATUS_C2S, { game: 15, state: state }, cb, [this, state]);
                    }}
                />
                <Toggle
                    label={this.state.recharge === 1 ? "关闭充值" : "开启充值"}
                    style={{
                        marginBottom: 16,
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30

                    }}
                    labelPosition="right"
                    defaultToggled={this.state.recharge === 1 ? true : false}
                    toggled={this.state.recharge === 1 ? true : false}
                    onToggle={(e, isOn) => {
                        var cb = (id, message, args) => {
                            if (id !== TRADE_ALLOWED_S2C) {
                                return;
                            }
                            if (message.code === LOGIC_SUCCESS) {
                                var self = args[0];
                                args[0].state.recharge = args[1];
                                args[0].setState({ recharge: args[1] });
                            }
                        }
                        let state = isOn === true ? 1 : 2;
                        MsgEmitter.emit(RECHARGE_ALLOWED_C2S, { allow: isOn }, cb, [this, state]);
                    }}
                />
                <Toggle
                    label={this.state.exchange === 1 ? "关闭兑奖" : "开启兑奖"}
                    style={{
                        marginBottom: 16,
                        display: 'inline-block',
                        width: 140,
                        marginRight: 30
                    }}
                    labelPosition="right"
                    defaultToggled={this.state.exchange === 1 ? true : false}
                    toggled={this.state.exchange === 1 ? true : false}
                    onToggle={(e, isOn) => {
                        var cb = (id, message, args) => {
                            if (id !== TRADE_ALLOWED_S2C) {
                                return;
                            }

                            if (message.code === LOGIC_SUCCESS) {
                                var self = args[0];
                                args[0].state.exchange = args[1];
                                args[0].setState({ exchange: args[1] });
                            }
                        }
                        let state = isOn === true ? 1 : 2;
                        MsgEmitter.emit(EXCHANGE_ALLOWED_C2S, { allow: isOn }, cb, [this, state]);
                    }}
                />
            </div>

            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"重置排行榜"}
                primary={true}
                // id={}
                onTouchTap={() => {
                    this.setState({
                        rankingDialog: true
                    })

                }}
            />
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"设置爆机值"}
                primary={true}
                // id={}
                disabled={this.state.selectedButton === 'setBang' ? true : false}
                onTouchTap={(event) => {
                    this.setState({
                        /*change_bang_value: true,*/
                        showDetail: "bang",
                        selectedButton: 'setBang'
                    })
                }}
            />
            <FlatButton
                label={"抽水额度"}
                primary={true}
                // id={}
                disabled={this.state.selectedButton === 'drawWater' ? true : false}
                onTouchTap={(event) => {
                    this.setState({
                        showDetail: "water",
                        selectedButton: 'drawWater'
                    })
                    this.getDrawWaterCoin();
                }}
            />
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"设置充值码地址"}
                primary={true}
                // id={}
                disabled={this.state.selectedButton === 'setRechargeURL' ? true : false}
                onTouchTap={(event) => {
                    this.setState({
                        /*change_bang_value: true,*/
                        showDetail: "url",
                        selectedButton: 'setRechargeURL'
                    })
                }}
            />
            <FlatButton
                // label={Lang[window.Lang].Master.refresh}
                label={"设置充值返还金币"}
                primary={true}
                // id={}
                disabled={this.state.selectedButton === 'setReturnCoin' ? true : false}
                onTouchTap={(event) => {
                    this.setState({
                        selectedButton: 'setReturnCoin'
                    })
                    this.handleGetRRC()
                }}
            />

            <FlatButton
                label={"设置返利比例"}
                primary={true}
                // id={}
                disabled={this.state.selectedButton === 'setReturnPercent' ? true : false}
                onTouchTap={(event) => {
                    this.setState({
                        selectedButton: 'setReturnPercent'
                    })
                    this.handleGetRCPercent();
                }}
            />
            <br />
            {this.state.showDetail !== "" ?
                this.Detail() : ''
            }
            {this.state.drawWaterDetail === true ?
                this.drawWaterDialog() : ''
            }
            {this.state.rechargeCodeDetail === true ?
                this.rechargeCodeAddress() : ''
            }
            {this.rankingDialog()}
            {this.addRRCDialog()}
            {this.deleteRRCDialog()}
            <CommonAlert
                show={this.state.alertOpen}
                type={this.state.type}
                code={this.state.code}
                content={this.state.content}
                handleCertainClose={this.state.handleCertainClose}
                handleCancelClose={() => {
                    this.setState({ alertOpen: false })
                }}>
            </CommonAlert>
        </div>
    }
}

export default Hall;