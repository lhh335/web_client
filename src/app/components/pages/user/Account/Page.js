import { QUERY_PLAYERS_C2S, QUERY_PLAYERS_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
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

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import Util from '../../../../util';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import HighSearch from '../../../myComponents/HighSearch/HighSearch';

import UserSetting from '../Setting/Page';

const assert = require('assert');

class PageComplex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            rowsPerPage: 4,
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
            totals: {},
            highSearchOpen: false,
            highSearchFilter: {}
        }
    }

    highSearchFilterChange = (filters) => {
        this.state.filters = filters;
        console.log(this.state.filters, 'filters');
    }

    highSearchExecuteSearch = () => {
        // 调用搜索
        this.setState({
            highSearchOpen: false
        })
        this.handleQueryPage(true)
    }

    highSearchCloseDialog = () => {
        this.setState({
            highSearchOpen: false
        })
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
                    var history = parseInt(cr.record_recharge) - parseInt(cr.record_game_stake) / 1000 + parseInt(cr.record_game_win) / 1000 + parseInt(cr.record_return) - parseInt(cr.record_exchange) + parseInt(cr.record_given) - parseInt(cr.record_confiscated);

                    var now = parseInt(cd.total_recharge) - parseInt(sw.total_stake) / 1000 + parseInt(sw.total_win) / 1000 - parseInt(cd.total_exchange) + parseInt(cd.total_return) + parseInt(cd.total_given) - parseInt(cd.total_confiscated);

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
            if (this.state.selectedOne === selectedRow) {
                return;
            }
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
        try {
          console.loog('2342');
        }
        catch (e) {
            console.log(e, 22222);
        }
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
            self.setState({ count: message.count, totalPage: Util.page.getTotalPage(message.count, this.state.rowsPerPage), sum: message.sum });
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
        console.log(obj, 'obj');
        MsgEmitter.emit(QUERY_PLAYERS_C2S, obj, cb, this);
    }

    handleQueryPlayer = (player_account) => {
        var cb = (id = 0, message = null, args) => {
            var self = args;
            self.state.onloading = false;
            if (id !== QUERY_PLAYERS_S2C) {
                return;
            }
            if (message.pi !== undefined || message.pi.length === 1) {
                for (var i = 0; i < self.state.data.length; i++) {
                    if (message.pi[0].id === self.state.data[i].id) {
                        self.state.data[i] = message.pi[0];
                        break;
                    }
                }
                self.setState({
                    data: self.state.data
                })
            }

        }
        var obj = {
            data_length: 0,
            filters: JSON.stringify({ account: player_account }),
            sort: JSON.stringify({ id: -1 })
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
                        popUpNotice("notice", 99021, Lang[window.Lang].ErrorCode[99021])
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
        } else {
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
                    <div style={{ float: 'left' }}>
                        <SelectField
                            value={this.state.search_way}
                            onChange={this.handleChangeSearchWay}
                            style={Styles.selecteField2}
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
                            style={Styles.selecteField2}
                            id="serch_text_field"
                            disabled={false}
                            multiLine={false}
                            // hintText={this.state.search_way === 'account' ? Lang[window.Lang].Master.search_by_account : this.state.search_way === 'id' ? Lang[window.Lang].Master.search_by_id : Lang[window.Lang].Master.search_by_name}
                            defaultValue=""
                            onChange={(event) => {
                                this.state.serchInput = event.target.value;
                                document.getElementById('serch_text_field').onkeydown = (e) => {
                                    var ev = e || window.event;
                                    if (ev.keyCode === 13) {
                                        this.queryInputPlayer(true);
                                    }
                                }
                            }}
                        />

                        <RaisedButton label={Lang[window.Lang].User.AccountPage.search_button} primary={true}
                            style={Styles.raiseButton} onTouchTap={() => {
                                this.state.currentPage = 1;
                                this.queryInputPlayer(true)
                            }} />

                        <RaisedButton label={Lang[window.Lang].User.AccountPage.high_search} primary={true}
                            style={Styles.raiseButton} onTouchTap={() => {

                                this.setState({
                                    highSearchOpen: true
                                })
                            }} />
                    </div>
                    {this.state.highSearchOpen === true ?
                        <HighSearch
                            callbackFilterChange={this.highSearchFilterChange}
                            callbackExecuteSearch={this.highSearchExecuteSearch}
                            callbackCloseDialog={this.highSearchCloseDialog}
                        /> : ""}
                    <div style={Styles.wrapper}>
                        {this.state.totals[0] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    document.getElementById("serch_text_field").value = "";
                                    var searchObj = { kind: { type: "integer", value: 0 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={Styles.chip}
                            >
                                {"游客：" + this.state.totals[0].sum + "人, 金币数：" + this.state.totals[0].coin}
                            </Chip> : ""}
                        {this.state.totals[1] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    document.getElementById("serch_text_field").value = "";
                                    var searchObj = { kind: { type: "integer", value: 1 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={Styles.chip}
                            >

                                {"注册用户：" + this.state.totals[1].sum + "人, 金币数：" + this.state.totals[1].coin}
                            </Chip> : ""}
                        {this.state.totals[2] !== undefined ?
                            <Chip
                                // onRequestDelete={handleRequestDelete}
                                onTouchTap={() => {
                                    document.getElementById("serch_text_field").value = "";
                                    var searchObj = { kind: { type: "integer", value: 2 } };
                                    this.state.filters = searchObj;
                                    this.handleQueryPage(true);
                                }}
                                backgroundColor={blue300}
                                style={Styles.chip}
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
                                    resizable: false,
                                    width: 50
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
                                    resizable: true,
                                    width: 50
                                },
                                {
                                    key: 'status',
                                    name: Lang[window.Lang].User.AccountPage.Table.status,
                                    sortable: true,

                                    resizable: false,

                                },
                                {
                                    key: 'recommend',
                                    name: Lang[window.Lang].User.AccountPage.Table.recommend,
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
                                // {
                                //     key: 'login_time',
                                //     name: Lang[window.Lang].User.AccountPage.Table.login_time,
                                //     sortable: true,
                                //     resizable: true
                                // },
                                {
                                    key: 'vertify_game_coin',

                                    name: "币" + Lang[window.Lang].User.AccountPage.vertify,
                                    // sortable: false,
                                    resizable: true,
                                    width: 100
                                },
                                {
                                    key: 'vertify_game_score',
                                    name: "分" + Lang[window.Lang].User.AccountPage.vertify,
                                    // sortable: false,
                                    resizable: true,
                                    width: 100

                                },
                                {
                                    key: 'correct',
                                    name: Lang[window.Lang].User.AccountPage.correct,
                                    // sortable: true,
                                    resizable: true,
                                    width: 100
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
                                },
                                {
                                    key: 'login_time',
                                    name: Lang[window.Lang].User.AccountPage.login_time,
                                    // sortable: true,
                                    resizable: true,
                                    width: 150
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
                                    mobile_phone: this.state.data[i].mobile_phone,
                                    game_coin: this.state.data[i].game_coin,
                                    vertify_game_coin: (this.state.data[i].vertify >> 2) & 1 === 1 ? "错误" : "正确",
                                    vertify_game_score: (this.state.data[i].vertify >> 3) & 1 === 1 ? "错误" : "正确",
                                    correct: Lang[window.Lang].User.AccountPage.Correct[this.state.data[i].correct],
                                    game_info: Lang[window.Lang].Setting.GamePage[this.state.data[i].game].game_name +
                                    (this.state.data[i].room !== 0 ? (Lang[window.Lang].Setting.GamePage[this.state.data[i].game].room[this.state.data[i].room] +
                                        (this.state.data[i].desk !== 0 ? ("桌号" + this.state.data[i].desk) : "")) : ""),
                                    score: this.state.data[i].score,
                                    isSelected: this.state.selectedOne === i,
                                    login_time: Util.time.getTimeString(this.state.data[i].login_time)
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
                            minHeight={145}
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

                            onCellClick={() => {
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
                        <div style={Styles.totalApproveAndRefuse}>
                            <h5 style={Styles.fontLeftFloat}>玩家总数:{this.state.sum}</h5>
                            <h5 style={Styles.fontLeftFloat}>搜索玩家总数:{this.state.count}</h5>
                        </div>
                        <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton}
                            onMouseUp={this.showPre} />
                        {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                        <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton}
                            onMouseUp={this.showNext} />
                        <br />
                    </div>
                </div>
                <UserSetting player={this.state.data[this.state.selectedOne]} />
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

const UserAccount = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].User.account} - ${previousTitle}`} />
        <PageComplex />
    </div>
);

export default UserAccount;
export { PageComplex as accountInfo };
