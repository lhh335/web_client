import { QUERY_PROMOTER_EXCHANGE_HISTORY_C2S, QUERY_PROMOTER_EXCHANGE_HISTORY_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";
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
            selectedMenu: "operation",
            serchInput: "",
            total_refuse: 0,
            total_approved: 0,
            sort: { time: -1 },
            onloading: false,
            count: 0,
            total_confiscated: 0
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
            this.queryExchange(false, false);
        } else {
            this.state.onloading = false;
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.setState({ data: data });
        }
    }


    handleChange = (event, index, value) => this.setState({ searchWay: value });

    handleOpenDetail = () => {
        if (this.state.selectedOne !== undefined) {
            this.setState({ detail: true });
        }
    };

    handleCloseDetail = () => {
        this.setState({ detail: false });
    };

    detailDialog = () => {
        return (<Dialog
            modal={false}
            open={this.state.detail}
            onRequestClose={this.handleCloseDetail}
            autoScrollBodyContent={true}
        >
            {this.insertDetail().map((key) => (key))}

        </Dialog>)
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== undefined && selectedRow.length === 1) {
            this.state.selectedOne = selectedRow[0];
            this.state.singleInfo = this.state.data[this.state.selectedOne];
            if (this.state.singleInfo === undefined) {
                this.state.singleInfo = {};
            }
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

    handleSelectAll = (selectable, allable, cView) => {
        this.setState(
            {
                selectable: selectable,
                enableSelectAll: allable,
                currentView: cView,
            }
        );
    }

    handlePasswordDialog = () => {
        this.setState({ passwordDialog: true });
    }

    handleClosePasswordDialog = () => {
        this.setState({ passwordDialog: false });
    };

    componentDidUspdate() {

    }

    componentDidMount() {
        window.currentPage = this;
        this.queryExchange(true, false);
    }

    refresh() {
        this.takePhoto();
    }

    takePhoto = () => {
        // var serchInput = document.getElementById('serch_player_text_field').value||this.props.promoter.account;
        // this.state.serchInput = serchInput;
        this.queryExchange(true, true);
    }

    // 搜索按钮查询兑换历史
    queryExchange = (reload = false, notice = false) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.state.onloading = false;
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        if (reload) {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1, total_approved: 0, total_refuse: 0 });
        }

        var minDate = this.state.minDate.getTime() / 1000;
        var maxDate = this.state.maxDate.getTime() / 1000;
        if (minDate > maxDate) {
            this.state.onloading = false;
            this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
            return;
        }

        var cb = (id = 0, message = null, args) => {
            var self = args[0];
            self.state.onloading = false;
            if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
            if (id !== QUERY_PROMOTER_EXCHANGE_HISTORY_S2C) {
                return;
            }
            var self = args[0];
            var result = [];
            var total = [];
            self.state.count = message.count;
            if (message.code === LOGIC_SUCCESS) {
                result = message.pei;
                total = message.ti;
                var total_approved = 0;
                var total_refuse = 0;
                for (var i = 0; i < total.length; i++) {
                    switch (total[i].type % 10) {
                        case 2:
                            total_approved += total[i].sum;
                            break;
                        case 3:
                            total_refuse += total[i].sum;
                            break;
                        case 5:
                            total_refuse += total[i].sum;
                            break;
                    }
                }
                self.setState({ total_approved: total_approved, total_refuse: total_refuse });
                self.state.totalPage = Util.page.getTotalPage(message.count, this.props.promoter.account === undefined ? 10 : this.state.rowsPerPage);
                self.handleUpdataAllData(result);
                self.handleUpdata(self.state.currentPage);
                self.handleSelectAll(true, false, 'all');
            }
            self.setState({ queryType: "$one", totalPage: Util.page.getTotalPage(message.count, this.props.promoter.account === undefined ? 10 : this.state.rowsPerPage) });

            if (args[1] === true) {
                if (message.code === ERROR_HAVE_NO_MORE_PAGES && result.length === 0) {
                    self.popUpNotice("notice", ERROR_HAVE_NO_MORE_PAGES, Lang[window.Lang].Master.no_data);
                } else {
                    self.popUpNotice("notice", message.code, Lang[window.Lang].Master.search_success);
                }
            }
        }
        var account = this.state.serchInput || document.getElementById("serch_player_text_field").value;

        if (account === undefined || account === "") {
            var searchObj = {
                time: { "$gte": minDate, "$lte": maxDate },
                approve: 22
            }
            var obj = {
                account: "",
                search: JSON.stringify(searchObj),
                data_length: this.state.allData.length,
                sort: JSON.stringify(this.state.sort),
            }
        } else {
            var searchObj = {
                approve: 22,
                time: { "$gte": minDate, "$lte": maxDate }
            }
            var obj = {
                account: account,
                data_length: this.state.allData.length,
                search: JSON.stringify(searchObj),
                sort: JSON.stringify(this.state.sort),
            }

        }
        MsgEmitter.emit(QUERY_PROMOTER_EXCHANGE_HISTORY_C2S, obj, cb, [this, notice]);

    }

    componentWillUnmount() {

    }


    PasswordDialog = () => {
        return (<Dialog
            title={
                Lang[window.Lang].Promoter.ExchangePage.promoter_pw_front
                + Lang[window.Lang].Master.you
                + Lang[window.Lang].Promoter.ExchangePage.promoter_pw_back}
            actions={[<FlatButton
                label={Lang[window.Lang].Promoter.approve_button}
                primary={true}
                onTouchTap={this.approveSelect}
            />, <FlatButton
                label={Lang[window.Lang].Promoter.refuse_button}
                primary={true}
                onTouchTap={this.refuseSelect}
            />]}
            modal={false}
            open={this.state.passwordDialog}
            onRequestClose={this.handleClosePasswordDialog}
            autoScrollBodyContent={true}
        >
            <TextField
                id="promoter_password_text_field"
                disabled={false}
                multiLine={false}
                type="password"
                hintText={Lang[window.Lang].Master.you + Lang[window.Lang].Promoter.ExchangePage.promoter_pw_back}
                defaultValue=''
                fullWidth={true}
            />
        </Dialog>)
    }
    insertDetail = () => {
        var table = Lang[window.Lang].Promoter.ExchangePage.Table;
        var list = [];
        for (var key in table) {
            if (key !== "invalid_time" && key !== "end_time") {
                list.push(
                    <ul key={key}>
                        <li>
                            {table[key].name}: {this.state.singleInfo === {} ? "" :
                                key === "approve" ? (this.state.singleInfo.approve === 1 && this.state.singleInfo.invalid_time - this.state.singleInfo.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > this.state.singleInfo.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                                    this.state.singleInfo.approve === 1 && Util.time.getTimeSecond() < this.state.singleInfo.invalid_time ? Lang[window.Lang].TableCommon.approving :
                                        Lang[window.Lang].Master.approve_status[this.state.singleInfo.approve]) :
                                    key === "time" ? Util.time.getTimeString(this.state.singleInfo[key]) : this.state.singleInfo[key]}
                            <br />
                        </li>
                    </ul>
                )
            } else {
                if (this.state.singleInfo.approve === 1 && key === "invalid_time") {
                    list.push(
                        <ul key={key}>
                            <li>
                                {table[key].name}: {Util.time.getTimeString(this.state.singleInfo["invalid_time"])}
                                <br />
                            </li>
                        </ul>
                    )
                } else if (this.state.singleInfo.approve === 2 && key === "end_time") {
                    list.push(
                        <ul key={key}>
                            <li>
                                {table[key].name}: {Util.time.getTimeString(this.state.singleInfo["end_time"])}
                                <br />
                            </li>
                        </ul>
                    )
                }
                else if (this.state.singleInfo.approve === 3 && key === "end_time") {
                    list.push(
                        <ul key={key}>
                            <li>
                                {table[key].name}: {Util.time.getTimeString(this.state.singleInfo["end_time"])}
                                <br />
                            </li>
                        </ul>
                    )
                }
            }

        }
        return list;
    }

    render() {
        var {
      promoter
    } = this.props;
        this.state.serchInput = promoter.account;
        return (
            <div>
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
                                    this.takePhoto();
                                }
                            }
                        }}
                    /> : ''
                }
                <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={() => { this.takePhoto() }} />

                <div>
                    <CommonTable
                        table={Lang[window.Lang].Promoter.ConfiscatedPage.Table}
                        data={this.state.data}
                        handleGridSort={(sortColumn, sortDirection) => {
                            this.state.sort = {}
                            if (sortDirection === 'ASC') {
                                this.state.sort[sortColumn] = 1
                            } else {
                                this.state.sort[sortColumn] = -1
                            }
                            this.takePhoto();
                        }}
                        rowGetter={(i) => {
                            if (i === -1) { return {} }
                            return {
                                exchange_id: this.state.data[i].exchange_id,
                                account: this.state.data[i].account,
                                id: this.state.data[i].id,
                                coin: this.state.data[i].coin,
                                time: Util.time.getTimeString(this.state.data[i].time),
                            }
                        }}
                        maxHeight={promoter.account === undefined ? 350 : 270}
                        onRowClick={(rowIdx, row) => {
                            this.handleSelection(rowIdx);
                        }}
                    />
                </div>
                <div style={Styles.totalApproveAndRefuse}>
                    <h5>总扣除:{this.state.total_approved}元</h5>
                </div>
                <div style={Styles.fontLeftFloat}>
                    <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
                    {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                    <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
                </div>
                <br />
                {this.detailDialog()}
                {this.PasswordDialog()}

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

class PromoterConfiscatedHistory extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Title render={(previousTitle) => `推广员扣除历史 - ${previousTitle}`} />
                <PageComplex promoter={this.props.promoter} />
            </div>
        )
    }
}
export default PromoterConfiscatedHistory;

