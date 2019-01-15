import { QUERY_WX_ORDER_C2S, REFUSE_RECHARGE_C2S, APPROVE_RECHARGE_C2S, QUERY_WX_ORDER_S2C, REFUSE_RECHARGE_S2C, APPROVE_RECHARGE_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";
import React from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ReactDataGrid from 'angon_react_data_grid';

import { Row } from 'react-data-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MsgEmitter from '../../../../MsgEmitter';
import Util from '../../../../util';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import CommonTable from '../../../myComponents/Table/CommonTable';

class PageComplex extends React.Component {

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
            rowsPerPage: 10,
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
            searchWay: 2,
            currentView: 'all',
            showCol: window.innerWidth > window.innerHeight ? "all" : "",
            selectedOne: -1,
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
            count: 0,
            sort: { time: 1 },
            filters: {},
            onloading: false
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
        // var sortData = newData.sort(function (a, b) {
        //     return b.time - a.time;
        // });
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
        if (this.state.rowsPerPage * (page) > this.state.allData.length && this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
            this.showAll(false, false);
        } else {
            this.state.onloading = false;
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.setState({ data: data });
        }
    }


    handleChange = (event, index, value) => this.setState({ searchWay: value });

    handleOpenDetail = () => {
        if (this.state.selectedOne !== -1) {
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
        // actions={[<FlatButton
        //     label={Lang[window.Lang].User.to_approve_button}
        //     primary={true}
        //     disabled={this.state.singleInfo.approve !== 1 || Util.time.getTimeSecond() > this.state.singleInfo.invalid_time}
        //     onTouchTap={this.handlePasswordDialog}
        //     />]}
        >
            {this.insertDetail().map((key) => (key))}

        </Dialog>)
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== -1) {
            this.state.selectedOne = selectedRow;
            this.state.singleInfo = this.state.data[selectedRow];

            if (this.state.singleInfo === undefined) {
                this.state.singleInfo = {};
            }
            this.handleOpenDetail()
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

    // handleSelectAll = (selectable, allable, cView) => {
    //     this.setState(
    //         {
    //             selectable: selectable,
    //             enableSelectAll: allable,
    //             currentView: cView,
    //         }
    //     );
    // }

    handlePasswordDialog = () => {
        // if (this.state.selectPromoter === "$all" && (this.state.isSelectAll === true || this.state.selectedData.length > 1)) {
        //   this.popUpNotice("notice", 0, Lang[window.Lang].ErrorCode[99001]);
        //   return;
        // }
        // if (this.state.isSelectAll === false && this.state.selectedData.length === 0) {
        //   this.popUpNotice("notice", 0, Lang[window.Lang].ErrorCode[99003]);
        //   return;
        // }
        this.setState({ passwordDialog: true });
    }

    handleClosePasswordDialog = () => {
        this.setState({ passwordDialog: false });
    };

    componentDidUpdate() {

    }

    componentDidMount() {
        window.currentPage = this;
        this.showAll(true, false);
    }

    refresh() {
        this.takePhoto();
    }

    takePhoto = () => {
        // var serchInput = document.getElementById("serch_player_text_field").value;
        // if (serchInput != '') {
        //     this.state.serchInput = serchInput;
        // }
        this.showAll(true, true);
    }

    showAll = (reload = false, notice = false) => {
        if (reload) {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1 });
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
            if (id !== QUERY_WX_ORDER_S2C) {
                return;
            }
            self.state.count = message.count;
            var result = [];
            if (message.code === LOGIC_SUCCESS) {
                result = message.woi;
                self.state.totalPage = Util.page.getTotalPage(message.count);
                self.handleUpdataAllData(result);
                self.handleUpdata(self.state.currentPage);
                // self.handleSelectAll(true, false, 'all');
            }
            self.setState({ totalPage: Util.page.getTotalPage(message.count) });
            if (args[1] === true) {
                if (message.code === ERROR_HAVE_NO_MORE_PAGES && result.length === 0) {
                    self.popUpNotice("notice", 0, Lang[window.Lang].Master.no_data);
                } else {
                    self.popUpNotice("notice", message.code, Lang[window.Lang].Master.search_success);
                }
            }

        }
        var account = this.state.serchInput || document.getElementById("serch_player_text_field").value;
        var searchObj = {
            time: { "$gte": minDate, "$lte": maxDate }
        }
        if (account !== "") {
            Object.assign(searchObj, { account: account })
        }

        var obj = {
            search: JSON.stringify(searchObj),
            data_length: this.state.allData.length,
            sort: JSON.stringify(this.state.sort)
        }

        MsgEmitter.emit(QUERY_WX_ORDER_C2S, obj, cb, [this, notice]);
    };

    refuseSelect = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var args = [this, this.state.selectedData];
        var obj = {
            "refuser": this.state.singleInfo.recommend,
            password: document.getElementById("promoter_password_text_field").value,
            order_id: [this.state.singleInfo.order_id]
        };


        var cb = function (id, message, args) {
            if (id !== REFUSE_RECHARGE_S2C) {
                return;
            }
            var self = args[0];
            var selectedData = args[1];
            for (var i = selectedData.length - 1; i >= 0; i--) {
                for (var j = 0; j < message.refused.length; j++) {
                    if (self.state.data[selectedData[i]].order_id === message.refused[j]) {
                        if (self.state.currentView === "allow") {
                            self.state.data.splice(selectedData[i], 1);
                        } else {
                            self.state.data[selectedData[i]].approve = 3;
                        }
                    }
                    // self.handleUpdata(self.state.data);
                }
            }
            if (message.refused.length === 0) {
                self.popUpNotice("notice", message.code, "操作失败");
            } else {
                self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
                self.state.singleInfo.approved = 3;
                self.state.singleInfo.invalid_time = Util.time.getTimeSecond();
                self.handleClosePasswordDialog();
                self.showAll(true, false);
            }
        }
        MsgEmitter.emit(REFUSE_RECHARGE_C2S, obj, cb, args);
    }

    approveSelect = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var args = [this, this.state.selectedData];

        var obj = {
            approver: this.state.singleInfo.recommend,
            password: document.getElementById("promoter_password_text_field").value,
            order_id: [this.state.singleInfo.order_id]
        };

        var cb = function (id, message, args) {
            if (id !== APPROVE_RECHARGE_S2C) {
                return;
            }
            var self = args[0];
            var selectedData = args[1];
            for (var i = selectedData.length - 1; i >= 0; i--) {
                for (var j = 0; j < message.approved.length; j++) {
                    if (self.state.data[selectedData[i]].order_id === message.approved[j]) {
                        if (self.state.currentView === "allow") {
                            self.state.data.splice(selectedData[i], 1);
                        } else {
                            self.state.data[selectedData[i]].approve = 2;
                        }
                    }
                    // self.handleUpdata(self.state.data);
                }
            }
            if (message.approved.length === 0) {
                self.popUpNotice("notice", message.code, "操作失败");
            } else {
                self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
                self.state.singleInfo.approved = 2;
                self.state.singleInfo.invalid_time = Util.time.getTimeSecond();
                self.handleClosePasswordDialog();
                self.showAll(true, false);
            }
        }
        MsgEmitter.emit(APPROVE_RECHARGE_C2S, obj, cb, args);
    };

    componentWillUnmount() {

    }

    insertDetail = () => {
        var table = Lang[window.Lang].User.WXChargePage.Table;
        var list = [];
        for (var key in table) {
            if (key !== "invalid_time" && key !== "end_time") {
                list.push(
                    <ul key={key}>
                        <li>
                            {table[key].name}: {this.state.singleInfo === {} ? "" :
                                key === "status" ? Lang[window.Lang].User.WXChargePage.Status[this.state.singleInfo.status] :
                                    key === "total_fee" ? this.state.singleInfo[key] :
                                        key === "approve" ? (this.state.singleInfo.approve === 1 && this.state.singleInfo.invalid_time - this.state.singleInfo.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > this.state.singleInfo.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                                            key === "recommend" && this.state.singleInfo.approve === "" ? Lang[window.Lang].Master.admin :
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
                } else if (this.state.singleInfo.approve === 3 && key === "end_time") {
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

                <TextField
                    middleWidth={true}

                    id="serch_player_text_field"
                    disabled={false}
                    multiLine={false}
                    hintText={Lang[window.Lang].User.AccountPage.search_by_account}
                    defaultValue=""
                    style={Styles.selecteField}
                    onChange={() => {
                        document.getElementById('serch_player_text_field').onkeydown = (e) => {
                            var ev = e || window.event;
                            if (ev.keyCode === 13) {
                                this.showAll(true, true);
                            }
                        }
                    }}
                />
                <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={
                    () => {
                        this.showAll(true, true)
                    }
                } />

                <div>
                    <CommonTable
                        table={Lang[window.Lang].User.WXChargePage.Table}
                        data={this.state.data}
                        handleGridSort={(sortColumn, sortDirection) => {
                            this.state.sort = {}
                            if (sortDirection === 'ASC') {
                                this.state.sort[sortColumn] = 1
                            } else {
                                this.state.sort[sortColumn] = -1
                            }
                            this.showAll(true);
                        }}
                        rowGetter={(i) => {
                            if (i === -1) { return {} }
                            return {
                                out_trade_no: this.state.data[i].out_trade_no,
                                account: this.state.data[i].account,
                                id: this.state.data[i].id,
                                total_fee: this.state.data[i].total_fee,
                                status: Lang[window.Lang].User.WXChargePage.Status[this.state.data[i].status],
                                code: this.state.data[i].code,
                                time: Util.time.getTimeString(this.state.data[i].time),
                            }
                        }}
                        onRowClick={(rowIdx, row) => {
                            this.handleSelection(rowIdx);
                        }}
                    />
                </div>
                <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
                {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
                <br />

                {this.detailDialog()}
                {
                    //this.PasswordDialog()
                }
                {
                    //<RaisedButton label={Lang[window.Lang].User.refuse_button} primary={true}  onMouseUp={this.refuseSelect} />
                }
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

const UserWXCharge = () => (
    <div>
        {
            <Title render={(previousTitle) => `${Lang[window.Lang].User.player_wxcharge_page} - ${previousTitle}`} />
        }
        <PageComplex />
    </div>
);

export default UserWXCharge;

