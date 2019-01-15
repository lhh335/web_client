import { COIN_STREAM_BLOCK_C2S, COIN_STREAM_BLOCK_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import Util from '../../../../util';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import protobuf from 'protobufjs';

import ReactDataGrid from 'angon_react_data_grid';
import { accountInfo } from '../Account/Page';



class TableExampleComplex extends Component {
    static PropTypes = {
        player: PropTypes.string
    }

    static defaultProps = {
        player: {}
    }
    constructor(props) {
        super(props);
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(1);

        maxDate.setHours(23, 59, 59, 0);

        this.state = {
            currentPage: 1,
            rowsPerPage: 4,
            totalPage: 1,
            minDate: minDate,
            maxDate: maxDate,
            allData: [],
            data: [],
            showCol: window.innerWidth > window.innerHeight ? "all" : "",
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            count: 0,
            coinDetail: false,
            selectedOne: undefined,
            singleLogInfo: {},
            selectedMenu: "operation",
            selectedCoin: 2,
            selectedError: true,
            all_correct: true,
            sort: { record_time: -1 },
            onloading: false
        };
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
        if (this.state.allData.length <= this.state.rowsPerPage * page && this.state.allData.length < this.state.count) {
            this.getPageData(this.state.currentPage);
        } else {
            this.state.onloading = false;
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.setState({ data: data });
        }
    }

    showPre = () => {
        this.handleUpdata(this.state.currentPage - 1);
    }

    showNext = () => {
        if (this.state.onloading === true) {
            return
        } else {
            this.handleUpdata(this.state.currentPage + 1);
        }
    }
    // 获取查询的金币流水信息
    getPageData = (page, notice = false) => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }

        var account = this.props.player;
        if (account === "") {
            this.state.onloading = false;
            this.popUpNotice("notice", 99007, Lang[window.Lang].ErrorCode[99007]);
            //表示查询账号为空
            return;
        }
        var minDate = this.state.minDate.getTime() / 1000;
        var maxDate = this.state.maxDate.getTime() / 1000;
        if (minDate > maxDate) {
            this.state.onloading = false;
            this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
            // 表示选择的时间有误
            return;
        }
        if (maxDate > Util.time.getTimeStamp()) {
            maxDate = Util.time.getTimeStamp()
        }

        var SearchObj = {
            record_time: { "$gte": minDate, "$lte": maxDate }
        }
        var obj = {
            account: account,
            search: JSON.stringify(SearchObj),
            sort: JSON.stringify(this.state.sort),
            data_length: this.state.allData.length,
        }
        var cb = (id = 0, message = null, args) => {
            var self = args[0];
            self.state.onloading = false;
            if (id !== COIN_STREAM_BLOCK_S2C) {
                return;
            }
            var result = message.bsi;
            if (message.code === LOGIC_SUCCESS) {
                self.state.totalPage = Util.page.getTotalPage(message.count, this.state.rowsPerPage);
                self.handleUpdataAllData(result);
                self.handleUpdata(self.state.currentPage);
            }
            self.setState({ count: message.count, totalPage: Util.page.getTotalPage(message.count, this.state.rowsPerPage) })
            if (result.length > 0 && args[1] === true) {
                self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
            } else if (result.length === 0) {
                self.popUpNotice("notice", 99009, Lang[window.Lang].ErrorCode[99009]);
            }
        }
        MsgEmitter.emit(COIN_STREAM_BLOCK_C2S, obj, cb, [this, notice]);
    }

    componentDidUpdate() {

    }

    componentDidMount() {
        // window.currentPage = this;
    }

    refresh() {
        this.state.data = [];
        this.state.allData = [];
        this.setState({ currentPage: 1, totalPage: 1 });
        this.getPageData(1, true);
    }

    // 各种错误通告
    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    handleChangeMinDate = (event, date) => {
        date.setHours(this.state.minDate.getHours(), this.state.minDate.getMinutes(), this.state.minDate.getSeconds());
        this.state.minDate = date;
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

    handleUpdataAllData = (newData) => {
        this.state.allData = this.state.allData.concat(newData);

        for (var i = 0; i < this.state.allData.length; i++) {
            var game_coin_change = Util.number.blockGameCoinChange(this.state.allData[i]);

            var taste_coin_change = Util.number.blockTasteCoinChange(this.state.allData[i]);

            var taste_score_exchange_coin = this.state.allData[i].room === 1 ? (this.state.allData[i].score / this.state.allData[i].ex_rate) : 0;

            var game_score_exchange_coin = this.state.allData[i].room !== 1 ? (this.state.allData[i].score / this.state.allData[i].ex_rate) : 0;


            if (i < this.state.allData.length - 1) {
                var pre_game_score_exchange_coin = this.state.allData[i + 1].room !== 1 ? (this.state.allData[i + 1].score / this.state.allData[i + 1].ex_rate) : 0;

                var pre_taste_score_exchange_coin = this.state.allData[i + 1].room === 1 ? (this.state.allData[i + 1].score / this.state.allData[i + 1].ex_rate) : 0;

                var pre_game_coin_change = Util.number.blockGameCoinChange(this.state.allData[i + 1]);

                var pre_taste_coin_change = Util.number.blockTasteCoinChange(this.state.allData[i + 1]);

            }

            this.state.allData[i].game_vertify = (i === this.state.allData.length - 1 ? '--' : Util.number.coinVerify(parseInt(this.state.allData[i + 1].record_game_coin) + pre_game_coin_change + pre_game_score_exchange_coin, parseInt(this.state.allData[i].record_game_coin) + game_score_exchange_coin, 10) === 0 ? '正确' : '有误差');

            this.state.allData[i].taste_vertify = (i === this.state.allData.length - 1 ? '--' : Util.number.coinVerify(parseInt(this.state.allData[i + 1].record_taste_coin) + pre_taste_coin_change + pre_taste_score_exchange_coin, parseInt(this.state.allData[i].record_taste_coin) + taste_score_exchange_coin, 10) === 0 ? '正确' : '有误差');

            this.state.allData[i].game_coin_change = game_coin_change;

            this.state.allData[i].taste_coin_change = taste_coin_change;

            this.state.allData[i].game_score_exchange_coin = game_score_exchange_coin;

            this.state.allData[i].taste_score_exchange_coin = taste_score_exchange_coin;



        }
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== undefined && selectedRow.length === 1) {

            this.state.selectedOne = selectedRow[0];
            this.state.singleLogInfo = this.state.data[this.state.selectedOne];
            if (this.state.singleLogInfo === undefined) {
                this.state.singleLogInfo = {};
            }
            this.handleOpenDetail()
        }
    }

    handleOpenDetail = () => {
        this.setState({ coinDetail: true });
    };

    handleCloseDetail = () => {
        this.setState({ coinDetail: false });
    };

    handleChange = (event, index, value) => this.setState({ showCol: value, selectedMenu: value });
    handleChangeCoin = (event, index, value) => this.setState({ selectedCoin: value });
    handleSearch = (event, index, value) => this.setState({ selectedError: value });

    LogDialog = () => {
        return (<Dialog
            modal={false}
            open={this.state.coinDetail}

            onRequestClose={this.handleCloseDetail}
            autoScrollBodyContent={true}
        >
            {this.insertDetail().map((key) => (key))}

        </Dialog>)
    }

    insertMenuItem = () => {
        var table = Lang[window.Lang].User.CoinPage.Table;
        var list = [];
        for (var key in table) {
            list.push(<MenuItem value={key} key={key} primaryText={table[key]} />)
        }
        return list;
    }

    insertDetail = () => {
        var table = Lang[window.Lang].User.CoinPage.Table;
        let row = this.state.singleLogInfo;
        var list = [];
        for (var key in table) {
            list.push(
                <ul key={key}>
                    <li>
                        {table[key]}: {this.state.singleLogInfo === {} ? "" :
                            key === "flag" ? (row.flag === 1 ? (Lang[window.Lang].User.CoinPage.add + row.change_coin) : (Lang[window.Lang].User.CoinPage.reduce + row.change_coin)) :
                                key === "operation" ? Lang[window.Lang].User.CoinPage.action[row.operation] :
                                    key === "game_name" ? Lang[window.Lang].Setting.GamePage[row.game].game_name :
                                        key === "room" && Lang[window.Lang].Setting.GamePage[this.state.singleLogInfo.game] !== undefined ? Lang[window.Lang].Setting.GamePage[this.state.singleLogInfo.game].room[row.room] :
                                            key === "time" ? Util.time.getTimeString(parseInt(this.state.singleLogInfo.time) / 1000) : this.state.singleLogInfo[key]}
                        <br />
                    </li>
                </ul>
            )
        }
        return list;
    }

    render() {
        return (
            <div>
                <Divider />
                <div style={Styles.normalFloat}>
                    <TimeSelector
                        callbackMinDateFuction={this.handleChangeMinDate}
                        callbackMinTimeFuction={this.handleChangeMinTime}
                        callbackMaxDateFuction={this.handleChangeMaxDate}
                        callbackMaxTimeFuction={this.handleChangeMaxTime}
                    />
                </div>
                <SelectField
                    value={this.state.selectedCoin}
                    onChange={this.handleChangeCoin}
                    style={Styles.selecteField}
                    shortWidth={true}
                >
                    <MenuItem value={1} key={"taste_coin"} primaryText={Lang[window.Lang].User.CoinPage.taste_coin} />
                    <MenuItem value={2} key={"game_coin"} primaryText={Lang[window.Lang].User.CoinPage.game_coin} />
                </SelectField>
                <RaisedButton
                    label={Lang[window.Lang].Master.search_button}
                    primary={true} style={Styles.coinSearch}
                    onTouchTap={
                        () => {
                            this.state.data = [];
                            this.state.allData = [];
                            this.setState({ currentPage: 1, totalPage: 1 });
                            this.getPageData(1, true)
                        }
                    } />
                <Divider />
                <div style={{ float: 'right', paddingLeft: 10 }}>
                    <p style={Styles.coinBlockLeftFloat}>游戏币变化量=充值-兑换+总得-总玩+总返利+赠予-收回;</p>
                    <p style={Styles.coinBlockLeftFloat}>体验币变化量=申请+总得-总玩;</p>
                    <p style={Styles.coinBlockLeftFloat}>统计起始总币数=起始币数+游戏分数对应币数;</p>
                    <p style={Styles.coinBlockLeftFloat}>结束币数=起始币数+变化量+游戏分数对应币数;</p>
                    <p style={Styles.coinBlockLeftFloat}>正确性判断:上一期结束币数≈>=下一期统计起始总币数;(正确性记录在下一期)</p>
                </div>
                <ReactDataGrid
                    rowKey="id"
                    columns={this.state.selectedCoin === 2 ? [
                        {
                            key: 'timePeriod',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.timePeriod.name,
                            resizable: true,
                            width: 200
                        },
                        {
                            key: 'beginCoin',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.beginCoin.name,
                            resizable: true
                        },
                        {
                            key: 'score_exchange_coin',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.score_exchange_coin.name,
                            resizable: true
                        },
                        {
                            key: 'record_recharge',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_recharge.name,
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'record_exchange',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_exchange.name,
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'record_given',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_given.name,
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'record_confiscated',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_confiscated.name,
                            resizable: true,
                            width: 100
                        },
                        {
                            key: 'record_stake',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_stake.name,
                            resizable: true
                        },
                        {
                            key: 'record_win',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_win.name,
                            resizable: true
                        },
                        {
                            key: 'record_return',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.record_return.name,
                            resizable: true
                        },
                        {
                            key: 'flag',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.flag.name,
                            resizable: true
                        },
                        {
                            key: 'statisticsBeginAllCoin',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.statisticsBeginAllCoin.name,
                            resizable: true
                        },
                        {
                            key: 'endCoin',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.endCoin.name,
                            resizable: true
                        },
                        {
                            key: 'verify',
                            name: Lang[window.Lang].User.CoinPage.TableBlock.verify.name,
                            resizable: true
                        }
                    ] : [
                            {
                                key: 'timePeriod',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.timePeriod.name,
                                resizable: true,
                                width: 200
                            },
                            {
                                key: 'beginCoin',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.beginCoin.name,
                                resizable: true
                            },
                            {
                                key: 'score_exchange_coin',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.score_exchange_coin.name,
                                resizable: true
                            },
                            {
                                key: 'record_stake',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.record_stake.name,
                                resizable: true
                            },
                            {
                                key: 'record_win',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.record_win.name,
                                resizable: true
                            },
                            {
                                key: 'record_asked',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.record_asked.name,
                                resizable: true
                            },
                            {
                                key: 'flag',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.flag.name,
                                resizable: true
                            },
                            {
                                key: 'statisticsBeginAllCoin',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.statisticsBeginAllCoin.name,
                                resizable: true
                            },
                            {
                                key: 'endCoin',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.endCoin.name,
                                resizable: true
                            },
                            {
                                key: 'verify',
                                name: Lang[window.Lang].User.CoinPage.TableBlock.verify.name,
                                resizable: true
                            }
                        ]}
                    rowGetter={(i) => {
                        if (i === -1) { return {} }

                        if (this.state.selectedCoin === 2) {
                            return {
                                beginCoin: parseInt(this.state.data[i].record_game_coin),
                                timePeriod: Util.time.getDateStringByTS(this.state.data[i].record_time) + " " + Util.time.getHourMiniteStringByTS(this.state.data[i].record_time) + '--' + Util.time.getHourMiniteStringByTS(this.state.data[i].record_time + 600),
                                flag: Util.number.toFixed2(this.state.data[i]["game_coin_change"]),
                                score_exchange_coin: this.state.data[i].room !== 1 ? parseFloat(this.state.data[i].score / this.state.data[i].ex_rate) : 0,
                                record_recharge: parseInt(this.state.data[i].record_recharge),
                                record_exchange: parseInt(this.state.data[i].record_exchange),
                                record_given: parseInt(this.state.data[i].record_given),
                                record_confiscated: parseInt(this.state.data[i].record_confiscated),
                                record_stake: Util.number.toFixed2(parseFloat(this.state.data[i].record_game_stake / 1000)),
                                record_win: Util.number.toFixed2(parseFloat(this.state.data[i].record_game_win / 1000)),
                                record_return: Util.number.toFixed2(parseFloat(this.state.data[i].record_return)),
                                statisticsBeginAllCoin: Util.number.toFixed2(parseInt(this.state.data[i].record_game_coin) + (this.state.data[i].room !== 1 ? parseFloat(this.state.data[i].score / this.state.data[i].ex_rate) : 0)),
                                endCoin: Util.number.toFixed2(parseInt(this.state.data[i].record_game_coin) + this.state.data[i]["game_coin_change"] + this.state.data[i]["game_score_exchange_coin"]),
                                verify: this.state.data[i]["game_vertify"]
                            }
                        } else {
                            return {
                                beginCoin: parseInt(this.state.data[i].record_taste_coin),
                                timePeriod: Util.time.getDateStringByTS(this.state.data[i].record_time) + " " + Util.time.getHourMiniteStringByTS(this.state.data[i].record_time) + '--' + Util.time.getHourMiniteStringByTS(this.state.data[i].record_time + 600),
                                flag: Util.number.toFixed2(this.state.data[i]["taste_coin_change"]),
                                score_exchange_coin: this.state.data[i].room === 1 ? parseFloat(this.state.data[i].score / this.state.data[i].ex_rate) : 0,
                                record_stake: Util.number.toFixed2(parseFloat(this.state.data[i].record_taste_stake / 1000)),
                                record_win: Util.number.toFixed2(parseFloat(this.state.data[i].record_taste_win / 1000)),
                                record_asked: parseInt(this.state.data[i].record_asked),
                                statisticsBeginAllCoin: Util.number.toFixed2(parseInt(this.state.data[i].record_taste_coin) + (this.state.data[i].room === 1 ? parseFloat(this.state.data[i].score / this.state.data[i].ex_rate) : 0)),
                                endCoin: Util.number.toFixed2(parseInt(this.state.data[i].record_taste_coin) + this.state.data[i]["taste_coin_change"] + this.state.data[i]["taste_score_exchange_coin"]),
                                verify: this.state.data[i]["taste_vertify"]
                            }
                        }
                    }}
                    rowsCount={this.state.data.length}
                    minHeight={165}
                    rowHeight={29}
                    rowSelection={{
                        showCheckbox: false,
                        selectBy: {
                            isSelectedKey: 'isSelected'
                        }
                    }}
                    onRowClick={(rowIdx, row) => {
                        this.handleSelection(rowIdx);
                    }}
                    onGridKeyDown={(e) => {
                        if (e.ctrlKey && e.keyCode === 65) {
                            e.preventDefault();

                            let rows = [];
                            this.state.data.forEach((r) => {
                                rows.push(Object.assign({}, r, { isSelected: true }));
                            });

                            this.setState({ rows });
                        }
                    }}
                />
                <div style={Styles.fontLeftFloat}>
                    <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
                    {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                    <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
                </div>

                <br />
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
            </div >
        );
    }
}

class CoinBlockLog extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Title render={(previousTitle) => `${Lang[window.Lang].User.coin} - ${previousTitle}`} />
                <TableExampleComplex player={this.props.player} />
            </div>
        )
    }
}
export default CoinBlockLog;
