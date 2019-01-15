import {QUERY_PLAYERS_C2S,QUERY_PLAYERS_S2C,} from "../../../../proto_enum";
import {ERROR_INPUT_NUMBER, LOGIC_SUCCESS} from "../../../../proto_enum";
import React from 'react';
import Title from 'react-title-component';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import ReactDataGrid from 'angon_react_data_grid';
import { Row } from 'react-data-grid';
import Avatar from 'material-ui/Avatar';
import { blue300, indigo900 } from 'material-ui/styles/colors';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';

import UserSetting from '../Setting/Page';

const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    },
    right: {
        float: 'right',
        margin: '20px 20px'
    },
    chip: {
        margin: 4,
        float: 'left'
    },
    wrapper: {
        marginTop: 20

    },
};

class PageComplex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            rowsPerPage: 10,
            totalPage: 1,
            allData: [],
            data: [],
            search_way: "account",
            selectedOne: -1,
            playerSetting: false,
            singlePlayerInfo: {},
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            lastSearch: "",
            filters: {},
            sort: { id: 1 },
            sum: 0,
            count: 0,
            onloading: false,
            totals: {}
        }
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
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
        if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
            this.queryInputPlayer(false);
        } else {
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            for (var i = 0; data.length > 0 && i < data.length; i++) {
                var current_coin = data[i].game_coin;
                var current_taste = data[i].taste_coin;
                var cr = data[i]["cr"];
                var sw = data[i]["game_coin_sw"];
                var cd = data[i]["cd"];
                var tsw = data[i]["taste_coin_sw"];
                if (data[i].playing === 1) {
                    data[i].correct = 2;
                } else {
                    var history = parseInt(cr.record_recharge) - parseInt(cr.record_game_stake) / 1000 + parseInt(cr.record_game_win) / 1000 - parseInt(cr.record_exchange) + parseInt(cr.record_given) - parseInt(cr.record_confiscated);
                    var now = parseInt(cd.total_recharge) - parseInt(sw.total_stake) / 1000 + parseInt(sw.total_win) / 1000 - parseInt(cd.total_exchange) + parseInt(cd.total_given) - parseInt(cd.total_confiscated);
                    var thistory = parseInt(cr.record_asked) - parseInt(cr.record_taste_stake) / 1000 + parseInt(cr.record_taste_win) / 1000;
                    var tnow = parseInt(cd.total_asked) - parseInt(tsw.total_stake) / 1000 + parseInt(tsw.total_win) / 1000;
                    // 显示玩家正确的时候  对小数位进行四舍五入计算
                    // 如果 整数位 已经出错 则四舍五入不会造成影响
                    // 如果 整数位 略小于  则忽略此错误
                    if ((Math.round(now - history) < parseInt(current_coin) - parseInt(cr.record_game_coin))) {
                        data[i].correct = 3;
                    } else if (Math.round(tnow - thistory) < parseInt(current_taste) - parseInt(cr.record_taste_coin)) {
                        data[i].correct = 4;
                    } else {
                        data[i].correct = 1;
                    }
                }
            }
            this.state.onloading = false;
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

    handleUpdataAllData = (newData) => {
        this.state.allData = this.state.allData.concat(newData);
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== -1) {
            this.state.selectedOne = selectedRow;
            this.state.singlePlayerInfo = this.state.data[this.state.selectedOne];
            if (this.state.singlePlayerInfo === undefined) {
                this.state.singlePlayerInfo = {};
            }
            this.handleOpenSetting();
        }
    }

    /*展开细节操作：重点*/
    handleOpenSetting = () => {
        if (this.state.selectedOne !== undefined) {
            this.setState({
                playerSetting: true,
            });
        }
    };

    handleCloseDetail = () => {
        // this.setState({ playerDetail: false });
        this.handleQueryPage(true);
        this.handleUpdata(this.state.currentPage);
    };

    handleChangeSearchWay = (event, index, value) => this.setState({ search_way: value });

    componentDidUpdate() {

    }

    componentDidMount() {
        window.currentPage = this;
        this.handleQueryPage(true);
    }

    refresh() {
        this.handleQueryPage(true);
    }

    // 查询所有玩家
    handleQueryPage = (reloadData) => {
        var cb = (id = 0, message = null, args) => {
            var self = args;
            self.state.onloading = false;
            if (id !== QUERY_PLAYERS_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                var result = [];
                result = message.pi;
                self.handleUpdataAllData(result);
                self.handleUpdata(self.state.currentPage);
            }
            for (var i = 0; i < message.ti.length; i++) {
                self.state.totals[message.ti[i].kind] = message.ti[i];
            }
            self.setState({ count: message.count, totalPage: Util.page.getTotalPage(message.count), sum: message.sum });
        }

        if (reloadData) {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1, totals: {} });
        }
        var obj = {
            data_length: this.state.allData.length,
            filters: JSON.stringify(this.state.filters),
            sort: JSON.stringify(this.state.sort)
        }
        MsgEmitter.emit(QUERY_PLAYERS_C2S, obj, cb, this);
    }

    queryInputPlayer = (reloadData) => {
        var serchInput = document.getElementById("serch_text_field").value;
        if (serchInput !== this.state.lastSearch) {
            this.state.lastSearch = serchInput;
            this.state.currentPage = 1;
        }
        var searchObj = new Object();
        if (serchInput !== "") {
            switch (this.state.search_way) {
                case "id":
                    var value = parseInt(serchInput);
                    if (value === NaN) {
                        popUpNotice("notice", ERROR_INPUT_NUMBER, Lang[window.Lang].ErrorCode[ERROR_INPUT_NUMBER])
                        return;
                    } else {
                        searchObj[this.state.search_way] = { type: "integer", value: value };
                    }
                    break;
                case "kind":
                    searchObj[this.state.search_way] = { type: "integer", value: parseInt(serchInput) };
                    break;
                default:
                    searchObj[this.state.search_way] = { type: "string", value: serchInput };
            }
            this.state.filters = searchObj;
        } else if (this.state.filters === {}) {
            this.state.filters = {};
        }
        // this.state.filters = ;
        this.handleQueryPage(reloadData);
    }

    componentWillUnmount() {

    }

    renderColor = (idx) => {
        if (this.state.data[idx].correct === 1) {
            return "black"
        } else if (this.state.data[idx].correct === 2) {
            return "blue"
        } else if (this.state.data[idx].correct === 3 || this.state.data[idx].correct === 4) {
            return "red"
        }
    }

    RowRenderer = (renderColor) => {
        return {
            propTypes: {
                idx: React.PropTypes.number.isRequired
            },

            setScrollLeft(scrollBy) {
                // if you want freeze columns to work, you need to make sure you implement this as apass through
                this.refs.row.setScrollLeft(scrollBy);
            },

            getRowStyle() {
                return {
                    color: this.getRowBackground()
                };
            },

            getRowBackground() {
                return renderColor(this.props.idx);
            },

            render: function () {
                // here we are just changing the style
                // but we could replace this with anything we liked, cards, images, etc
                // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
                return (<div style={this.getRowStyle()}><Row ref="row" {...this.props} /></div>);
            }
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        <SelectField
                            value={this.state.search_way}
                            onChange={this.handleChangeSearchWay}
                            style={{ float: 'left', marginRight: 10 }}
                            middleWidth={true}
                        >
                            <MenuItem value={"account"} key={"account"}
                                primaryText={Lang[window.Lang].User.AccountPage.search_by_account} />
                            <MenuItem value={"name"} key={"name"}
                                primaryText={Lang[window.Lang].User.AccountPage.search_by_name} />
                            <MenuItem value={"id"} key={"id"}
                                primaryText={Lang[window.Lang].User.AccountPage.search_by_id} />
                        </SelectField>
                        <TextField
                            middleWidth={true}

                            id="serch_text_field"
                            disabled={false}
                            multiLine={false}
                            hintText={this.state.search_way === "account" ? Lang[window.Lang].User.AccountPage.pleaseAccount :
                                this.state.search_way === "name" ? Lang[window.Lang].User.AccountPage.pleaseName :
                                    this.state.search_way === "kind" ? Lang[window.Lang].User.AccountPage.pleaseKind :
                                        this.state.search_way === "recommend" ? Lang[window.Lang].User.AccountPage.pleaseRecommend :
                                            this.state.search_way === "id" ? Lang[window.Lang].User.AccountPage.pleaseId : ""}
                            defaultValue=""
                            style={{ float: 'left', marginRight: 10 }}
                            onChange={() => {
                                document.getElementById('serch_text_field').onkeydown = (e) => {
                                    var ev = e || window.event;
                                    if (ev.keyCode === 13) {
                                        this.state.currentPage = 1;
                                        this.queryInputPlayer(true);
                                    }
                                }
                            }}
                        />
                        <RaisedButton label={Lang[window.Lang].User.AccountPage.search_button} primary={true}
                            style={styles.simple} onTouchTap={() => {
                                this.state.currentPage = 1;
                                this.queryInputPlayer(true)
                            }} />
                    </div>

                    <div style={styles.wrapper}>
                        {this.state.totals[0] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    var searchObj = { kind: { type: "integer", value: 0 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={styles.chip}
                            >
                                {"游客：" + this.state.totals[0].sum + "人, 金币数：" + this.state.totals[0].coin}
                            </Chip> : ""}
                        {this.state.totals[1] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    var searchObj = { kind: { type: "integer", value: 1 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={styles.chip}
                            >

                                {"注册用户：" + this.state.totals[1].sum + "人, 金币数：" + this.state.totals[1].coin}
                            </Chip> : ""}
                        {this.state.totals[2] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    var searchObj = { kind: { type: "integer", value: 2 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={styles.chip}
                            >
                                {"微信用户：" + this.state.totals[2].sum + "人, 金币数：" + this.state.totals[2].coin}
                            </Chip> : ""}
                    </div>
                    <div>
                        <ReactDataGrid
                            rowKey="id"
                            columns={[
                                {
                                    key: 'id',
                                    name: Lang[window.Lang].User.AccountPage.Table.id,
                                    sortable: true,
                                    resizable: true,
                                    width: 40
                                },
                                {
                                    key: 'account',
                                    name: Lang[window.Lang].User.AccountPage.Table.account,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'name',
                                    name: Lang[window.Lang].User.AccountPage.Table.name,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'level',
                                    name: Lang[window.Lang].User.AccountPage.Table.level,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'status',
                                    name: Lang[window.Lang].User.AccountPage.Table.status,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'recommend',
                                    name: Lang[window.Lang].User.AccountPage.Table.recommend,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'sex',
                                    name: Lang[window.Lang].User.AccountPage.Table.sex,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'mobile_phone',
                                    name: '绑定手机号',
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'game_coin',
                                    name: Lang[window.Lang].User.AccountPage.Table.game_coin,
                                    sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'taste_coin',
                                    name: Lang[window.Lang].User.AccountPage.Table.taste_coin,
                                    sortable: true,
                                    resizable: true
                                },
                                // {
                                //     key: 'login_time',
                                //     name: Lang[window.Lang].User.AccountPage.Table.login_time,
                                //     sortable: true,
                                //     resizable: true
                                // },
                                {
                                    key: 'vertify_game_coin',
                                    name: Lang[window.Lang].User.AccountPage.vertify + "(游戏:币)",
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'vertify_game_score',
                                    name: Lang[window.Lang].User.AccountPage.vertify + "(游戏:分)",
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'vertify_taste_coin',
                                    name: Lang[window.Lang].User.AccountPage.vertify + "(体验:币)",
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'vertify_taste_score',
                                    name: Lang[window.Lang].User.AccountPage.vertify + "(体验:分)",
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'correct',
                                    name: Lang[window.Lang].User.AccountPage.correct,
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'game_info',
                                    name: Lang[window.Lang].User.AccountPage.game_info,
                                    // sortable: true,
                                    resizable: true
                                },
                                {
                                    key: 'score',
                                    name: Lang[window.Lang].User.AccountPage.score,
                                    // sortable: true,
                                    resizable: true
                                }
                            ]}
                            rowGetter={(i) => {
                                if (i === -1) {
                                    return {}
                                }
                                return {
                                    account: this.state.data[i].account,
                                    id: this.state.data[i].id,
                                    name: this.state.data[i].name,
                                    level: this.state.data[i].level,
                                    status: this.state.data[i].status === 0 ? Lang[window.Lang].Promoter.AccountPage.normal : Lang[window.Lang].Promoter.AccountPage.forbidden,
                                    recommend: this.state.data[i].recommend === "" ? Lang[window.Lang].Master.admin : this.state.data[i].recommend,
                                    sex: this.state.data[i].sex === 0 ? Lang[window.Lang].TableCommon.girl : Lang[window.Lang].TableCommon.boy,
                                    mobile_phone: this.state.data[i].mobile_phone,
                                    game_coin: this.state.data[i].game_coin,
                                    taste_coin: this.state.data[i].taste_coin,
                                    // login_time: Util.time.getTimeString(this.state.data[i].login_time),
                                    // 体验  币分  游戏币 币分
                                    vertify_game_coin: (this.state.data[i].vertify >> 2) & 1 === 1 ? "错误" : "正确",
                                    vertify_game_score: (this.state.data[i].vertify >> 3) & 1 === 1 ? "错误" : "正确",
                                    vertify_taste_coin: (this.state.data[i].vertify >> 0) & 1 === 1 ? "错误" : "正确",
                                    vertify_taste_score: (this.state.data[i].vertify >> 1) & 1 === 1 ? "错误" : "正确",
                                    correct: Lang[window.Lang].User.AccountPage.Correct[this.state.data[i].correct],
                                    game_info: Lang[window.Lang].Setting.GamePage[this.state.data[i].game].game_name +
                                    (this.state.data[i].room !== 0 ? (Lang[window.Lang].Setting.GamePage[this.state.data[i].game].room[this.state.data[i].room] +
                                        (this.state.data[i].desk !== 0 ? ("桌号" + this.state.data[i].desk) : "")) : ""),
                                    score: this.state.data[i].score,
                                    isSelected: this.state.selectedOne === i
                                }
                            }}
                            onGridSort={(sortColumn, sortDirection) => {
                                this.state.sort = {}
                                if (sortDirection === 'ASC') {
                                    this.state.sort[sortColumn] = 1
                                } else {
                                    this.state.sort[sortColumn] = -1
                                }
                                this.handleQueryPage(true);
                            }}
                            rowsCount={this.state.data.length}
                            minHeight={386}
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
                            rowRenderer={React.createClass(this.RowRenderer(this.renderColor))}
                        />
                        <h5 style={styles.right}>玩家总数:{this.state.sum}</h5>
                        <h5 style={styles.right}>搜索玩家总数:{this.state.count}</h5>
                        <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={styles.simple}
                            onMouseUp={this.showPre} />
                        {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                        <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={styles.simple}
                            onMouseUp={this.showNext} />
                        <br />
                    </div>
                </div>
                <div>
                    {/*调整金币*/}
                    <FlatButton
                        label={Lang[window.Lang].User.AccountPage.coin_button}
                        primary={true}
                        disabled={this.state.showSelect === "promoter_trade"}
                        onTouchTap={() => {
                            this.setState({ showSelect: "promoter_trade" })
                        }
                        }
                    />
                    <FlatButton
                        label={Lang[window.Lang].User.AccountPage.reset_pw_button}
                        primary={true}
                        disabled={this.state.showSelect === "resetPassword"}
                        onTouchTap={() => {
                            this.setState({
                                showSelect: 'resetPassword'
                            })
                        }}
                    />
                    <FlatButton
                        label={Lang[window.Lang].User.AccountPage.delete_account}
                        primary={true}
                        disabled={this.state.showSelect === "deletePlayer"}
                        onTouchTap={() => {
                            this.setState({
                                showSelect: 'deletePlayer'
                            })
                        }}
                    />
                    <FlatButton
                        label={this.state.singlePlayerInfo.status === 0 ?
                            Lang[window.Lang].User.AccountPage.frozen_button : Lang[window.Lang].User.AccountPage.thaw_button}
                        primary={true}
                        onTouchTap={this.frozenAccount}
                    />
                    {apptype === 0 ?
                        <FlatButton
                            label={Lang[window.Lang].User.AccountPage.resetPlayerInfo}
                            primary={true}
                            disabled={this.state.showSelect === 'resetPlayerInfo'}
                            onTouchTap={() => {
                                this.setState({
                                    showSelect: 'resetPlayerInfo'
                                })
                            }}
                        /> : ""}

                    {this.state.showSelect === "resetPassword" ?
                        <Paper>
                            <TextField
                                id="your_password_text_field"
                                disabled={false}
                                multiLine={false}
                                type="password"
                                floatingLabelText={Lang[window.Lang].User.AccountPage.your_password}
                                defaultValue=""
                                fullWidth={true}
                                floatingLabelStyle={styles.floating}
                                floatingLabelFixed={true}
                                inputStyle={{ marginLeft: '20px' }}
                                style={styles.simple}
                            />
                            <br />
                            <TextField
                                id="reset_password_text_field"
                                disabled={false}
                                multiLine={false}
                                type="password"
                                floatingLabelText={Lang[window.Lang].User.AccountPage.new_password}
                                defaultValue=""
                                fullWidth={true}
                                floatingLabelFixed={true}

                                floatingLabelStyle={styles.floating}
                                inputStyle={{ marginLeft: '20px' }}
                                style={styles.simple}
                            />
                            <br />
                            <TextField
                                id="reset_again_password_text_field"
                                disabled={false}
                                multiLine={false}
                                type="password"
                                floatingLabelText={Lang[window.Lang].User.AccountPage.again_password}
                                defaultValue=""
                                fullWidth={true}
                                floatingLabelFixed={true}

                                floatingLabelStyle={styles.floating}
                                inputStyle={{ marginLeft: '20px' }}
                                style={styles.simple}
                                onChange={() => {
                                    document.getElementById('reset_again_password_text_field').onkeydown = (e) => {
                                        var ev = e || window.event;
                                        if (ev.keyCode === 13) {
                                            this.resetPassword();
                                        }
                                    }
                                }}
                            />
                            <br />
                            <FlatButton
                                label={Lang[window.Lang].Master.certain_button}
                                primary={true}
                                onTouchTap={this.resetPassword}
                            />
                            <br />
                        </Paper> : this.state.showSelect === "deletePlayer" ?
                            <Paper >
                                <TextField
                                    id="delete_your_password_text_field"
                                    disabled={false}
                                    multiLine={false}
                                    type="password"
                                    floatingLabelText='您的密码'
                                    floatingLabelStyle={styles.floating}
                                    inputStyle={{ marginLeft: '20px' }}
                                    defaultValue=""
                                    fullWidth={true}
                                    floatingLabelFixed={true}

                                    style={styles.simple}
                                    onChange={() => {
                                        document.getElementById('delete_your_password_text_field').onkeydown = (e) => {
                                            var ev = e || window.event;
                                            if (ev.keyCode === 13) {
                                                this.deletePlayer();
                                            }
                                        }
                                    }}
                                />
                                <FlatButton
                                    label={Lang[window.Lang].Master.certain_button}
                                    primary={true}
                                    onTouchTap={this.deletePlayer}
                                />
                                <br />
                            </Paper> : this.state.showSelect === "promoter_trade" ?
                                <Paper>
                                    <TextField
                                        style={styles.simple}
                                        id="coin_value_text_field"
                                        disabled={false}
                                        multiLine={false}
                                        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.coin_value}
                                        defaultValue=""
                                        fullWidth={true}
                                        floatingLabelFixed={true}

                                        floatingLabelStyle={styles.floating}
                                        inputStyle={{ marginLeft: '20px' }}
                                        style={styles.simple}
                                    />
                                    <br />
                                    <TextField
                                        id="set_coin_your_password_text_field"
                                        disabled={false}
                                        multiLine={false}
                                        type="password"
                                        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.your_password}
                                        defaultValue=""
                                        fullWidth={true}
                                        floatingLabelFixed={true}

                                        floatingLabelStyle={styles.floating}
                                        inputStyle={{ marginLeft: '20px' }}
                                        style={styles.simple}
                                        onChange={() => {
                                            document.getElementById('set_coin_your_password_text_field').onkeydown = (e) => {
                                                var ev = e || window.event;
                                                if (ev.keyCode === 13) {
                                                    this.handleSetCoin();
                                                }
                                            }
                                        }}
                                    />
                                    <FlatButton
                                        label={Lang[window.Lang].Master.certain_button}
                                        primary={true}
                                        onTouchTap={this.handleSetCoin}

                                    />
                                    <br />
                                </Paper> : this.state.showSelect === "resetPlayerInfo" ?
                                    <Paper style={styles.hidden}>

                                        <TextField
                                            id={"account_textfield"}
                                            floatingLabelFixed={true}
                                            defaultValue={this.state.singlePlayerInfo.account}

                                            floatingLabelText="玩家账号"
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            fullWidth={true}
                                            disabled={true}
                                            onChange={(e) => {
                                                this.state.resetPlayerAccount = e.target.value;
                                            }}
                                        /><br />
                                        <TextField
                                            id={"avatar_textfield"}
                                            defaultValue={this.state.singlePlayerInfo.head_portrait}
                                            floatingLabelText="玩家头像编号"
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            fullWidth={true}
                                            floatingLabelFixed={true}

                                            onChange={(e) => {
                                                this.state.resetPlayerAvatar = Number(e.target.value);
                                            }} />
                                        <br />
                                        <TextField
                                            id={"name_textfield"}
                                            defaultValue={this.state.singlePlayerInfo.name}
                                            floatingLabelText="玩家昵称"
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            fullWidth={true}
                                            floatingLabelFixed={true}

                                            onChange={(e) => {
                                                this.state.resetPlayerName = e.target.value;
                                            }}
                                        /><br />
                                        <RadioButtonGroup name="sex" valueSelected={this.state.resetPlayerSex} style={styles.flex}
                                            onChange={(event, value) => {
                                                this.state.resetPlayerSex = Number(value);
                                            }}
                                        >
                                            <RadioButton
                                                value={0}
                                                label="女"
                                            />
                                            <RadioButton
                                                value={1}
                                                label="男"
                                            />
                                        </RadioButtonGroup>
                                        <Divider style={{ marginTop: '10px' }} />
                                        <br />
                                        <TextField
                                            id={"phone_textfield"}
                                            defaultValue={this.state.singlePlayerInfo.mobile_phone}
                                            floatingLabelFixed={true}
                                            floatingLabelText="手机号"
                                            fullWidth={true}
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            onChange={(e) => {
                                                this.state.resetPlayerPhone = e.target.value;
                                            }}
                                        /><br />
                                        <TextField
                                            id={"level_textfield"}
                                            defaultValue={this.state.singlePlayerInfo.level}
                                            floatingLabelText="等级"
                                            fullWidth={true}
                                            floatingLabelFixed={true}
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            onChange={(e) => {
                                                this.state.resetPlayerLevel = Number(e.target.value);
                                            }}
                                        /><br />
                                        <TextField
                                            id={"recommend_textfield"}
                                            defaultValue={this.state.singlePlayerInfo.recommend}
                                            floatingLabelFixed={true}
                                            floatingLabelText="推广员"
                                            fullWidth={true}
                                            floatingLabelStyle={styles.text}
                                            inputStyle={styles.text}
                                            onChange={(e) => {
                                                this.state.resetPlayerRecommend = e.target.value;
                                            }}
                                        /><br />

                                        <RaisedButton label={Lang[window.Lang].Master.certain_button} primary={true} style={styles.button}
                                            onTouchTap={() => {
                                                this.resetPlayerInfo();
                                            }} />
                                    </Paper>
                                    : ''}


                </div>
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

const UserInfo = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].User.account} - ${previousTitle}`} />
        <PageComplex />
    </div>
);

export default UserInfo;
export { PageComplex as accountInfo };
