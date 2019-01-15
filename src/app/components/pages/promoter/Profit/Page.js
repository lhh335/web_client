import { QUERY_PROMOTER_TOTAL_STATISTICS_C2S, QUERY_PROMOTER_STATISTICS_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";
import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MsgEmitter from '../../../../MsgEmitter';
import Util from '../../../../util';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import Paper from 'material-ui/Paper';
import areIntlLocalesSupported from 'intl-locales-supported';
import { accountInfo } from '../Account/Page';
import CommonTable from '../../../myComponents/Table/CommonTable';


class PageComplex extends Component {
    static PropTypes = {
        promoter: PropTypes.object
    }
    static defaultProps = {
        promoter: {}
    }
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
            currentPage: 1,
            totalPage: 1,
            rowsPerPage: 8,
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: true,
            deselectOnClickaway: true,
            showCheckboxes: false,
            preScanRows: true,
            height: '510px',
            data: [],
            allData: [],
            selectedData: [],
            isSelectAll: false,
            searchWay: 1,
            currentView: 'all',
            showCol: window.innerWidth > window.innerHeight ? "all" : "",
            selectedOne: [],
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            queryType: "$all",
            passwordDialog: false,
            selectPromoter: sessionStorage.accountType === "1" ? sessionStorage.account : "$all",
            detail: false,
            singleInfo: {},
            serchInput: "",
            onloading: false,
        };
    }

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
        if (this.props.promoter.account === undefined) {
            this.state.rowsPerPage = 10;
        }
        if (this.state.rowsPerPage * (page) > this.state.allData.length && this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
            this.queryProfit(false, false);
        } else {
            this.state.onloading = false;
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.setState({ data: data });
        }
    }


    handleCloseDetail = () => {
        this.setState({ detail: false });
    };

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

    componentDidMount() {
        window.currentPage = this;
    }

    refresh() {
        this.queryProfit(true);
    }

    queryProfit = (reload = false, notice = false) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.state.onloading = false;
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
        if (reload) {
            this.setState({ data: [], allData: [], totalPage: 1, currentPage: 1 });
        }

        var cb = (id = 0, message = null, args) => {
            if (id !== QUERY_PROMOTER_STATISTICS_S2C) {
                return;
            }
            var self = args[0];
            self.state.onloading = false;
            var result = message.psi;
            var newResult = [];
            var sortData = result.sort(function (a, b) {
                return parseInt(b.time) - parseInt(a.time);
            });
            this.state.allData = this.state.allData.concat(sortData);
            for (var i = 0; i < this.state.allData.length; i++) {
                this.state.allData[i]['date'] = Util.time.getTimeString(this.state.allData[i].time).split(' ')[0]
            }
            self.handleUpdata(self.state.currentPage);
            // for (var i = 0; i < sortData.length; i++) {
            //     dateArray.push(Util.time.getTimeString(sortData[i].time).split(' ')[0]);
            // }
            if (notice) {
                if (message.code === ERROR_HAVE_NO_MORE_PAGES || result.length === 0) {
                    self.popUpNotice("notice", 0, Lang[window.Lang].Master.no_data);
                } else {
                    self.popUpNotice("notice", message.code, Lang[window.Lang].Master.search_success);
                }
            }
            self.setState({ count: message.psi.length, totalPage: Util.page.getTotalPage(message.psi.length, this.props.promoter.account === undefined ? 10 : this.state.rowsPerPage) });

        }
        var account = this.state.serchInput || this.props.promoter.account || document.getElementById('serch_player_text_field').value;
        var searchObj = {
            time: { "$gte": minDate, "$lte": maxDate }
        }
        var obj = {
            filters: JSON.stringify(searchObj),
            account: account
        }

        MsgEmitter.emit(QUERY_PROMOTER_TOTAL_STATISTICS_C2S, obj, cb, [this]);

    }


    render() {
        const {
            promoter
        } = this.props;
        this.state.serchInput = promoter.account;
        return (
            <div>
                <Paper>
                    <div style={Styles.normalFloat}>
                        <TimeSelector
                            callbackMinDateFuction={this.handleChangeMinDate}
                            callbackMinTimeFuction={this.handleChangeMinTime}
                            callbackMaxDateFuction={this.handleChangeMaxDate}
                            callbackMaxTimeFuction={this.handleChangeMaxTime}
                        />
                    </div>

                    {promoter.account === undefined ?
                        <TextField
                            id="serch_player_text_field"
                            disabled={false}
                            multiLine={false}
                            hintText={Lang[window.Lang].Master.search_by_account}
                            defaultValue=""
                            style={Styles.selecteField}
                            middleWidth={true}

                            onChange={(event) => {
                                this.state.serchInput = event.target.value;
                                document.getElementById('serch_player_text_field').onkeydown = (e) => {
                                    var ev = e || window.event;
                                    if (ev.keyCode === 13) {
                                        this.queryProfit(true, true);
                                    }
                                }
                            }}
                        /> : ''
                    }
                    <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={() => {
                        this.queryProfit(true, true)
                    }} />
                </Paper>

                <div>

                    <CommonTable
                        table={Lang[window.Lang].Promoter.ProfitPage.Table}
                        data={this.state.data}
                        rowGetter={(i) => {
                            if (i === -1) {
                                return;
                            }
                            return {
                                id: this.state.data[i].id,
                                time: this.state.data[i].date,
                                totalStake: Math.round(parseInt(this.state.data[i].daily_stake) / 1000),
                                totalWin: Math.round(parseInt(this.state.data[i].daily_win) / 1000),
                                totalProfit: Math.round(parseInt(this.state.data[i].daily_stake) / 1000 - parseInt(this.state.data[i].daily_win) / 1000)
                            }
                        }}
                        maxHeight={promoter.account === undefined ? 350 : 270}
                        onRowClick={(rowIdx, row) => {
                        }}
                    />
                </div>
                <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
                {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
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
            </div>
        );
    }
}
class PromoterProfit extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Title render={(previousTitle) => `推广员盈利 - ${previousTitle}`} />
                <PageComplex promoter={this.props.promoter} />
            </div>
        )
    }
}
export default PromoterProfit;

