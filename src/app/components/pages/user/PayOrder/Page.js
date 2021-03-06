import { QUERY_PAY_ORDER_C2S, QUERY_PAY_ORDER_S2C } from "../../../../proto_enum";
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
            selectable: true,
            data: [],
            allData: [],
            selectedData: [],
            searchWay: 2,
            currentView: 'all',
            showCol: window.innerWidth > window.innerHeight ? "all" : "",
            selectedOne: -1,
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            singleInfo: {},
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


    handleSelection = (selectedRow) => {
        if (selectedRow !== -1) {
            this.state.selectedOne = selectedRow;
            this.state.singleInfo = this.state.data[selectedRow];

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


    componentDidMount() {
        window.currentPage = this;
        this.showAll(true, false);
    }

    refresh() {
        this.takePhoto();
    }

    takePhoto = () => {
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
            if (id !== QUERY_PAY_ORDER_S2C) {
                return;
            }
            console.log(message);
            self.state.count = message.count;
            var result = [];
            if (message.code === LOGIC_SUCCESS) {
                result = message.poi;
                self.state.totalPage = Util.page.getTotalPage(message.count);
                self.handleUpdataAllData(result);
                self.handleUpdata(self.state.currentPage);
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
        var id = document.getElementById("serch_player_text_field").value;
        var searchObj = {
            time: { "$gte": minDate, "$lte": maxDate }
        }
        if (id !== "") {
            if (isNaN(id)) {
                this.popUpNotice('notice', 99021, Lang[window.Lang].ErrorCode[99021]);
                return;
            } else {
                if (Number(id) < 0) {
                    this.popUpNotice('notice', 99024, '不能为负数');
                    return;
                }
                if (Number(id) % 1 != 0) {
                    this.popUpNotice('notice', 99023, Lang[window.Lang].ErrorCode[99023]);
                    return;
                } else {
                    Object.assign(searchObj, { id: Number(id) })
                }
            }
        }
        var obj = {
            search: JSON.stringify(searchObj),
            data_length: this.state.allData.length,
            sort: JSON.stringify(this.state.sort)
        }
        console.log(obj);
        MsgEmitter.emit(QUERY_PAY_ORDER_C2S, obj, cb, [this, notice]);
    };

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
                    hintText={Lang[window.Lang].User.AccountPage.search_by_id}
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
                        table={Lang[window.Lang].User.PayOrderPage.Table}
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
                                order_id: this.state.data[i].order_id,
                                account: this.state.data[i].account,
                                id: this.state.data[i].id,
                                number: this.state.data[i].number,
                                status: Lang[window.Lang].User.PayOrderPage.Status[this.state.data[i].status],
                                promoter: this.state.data[i].promoter,
                                time: Util.time.getTimeString(this.state.data[i].time),
                                complete_time: this.state.data[i].complete_time === 0 ? '下单未支付' : Util.time.getTimeString(this.state.data[i].complete_time),
                                pay_platform: Lang[window.Lang].User.PayOrderPage.Platform[this.state.data[i].pay_platform],
                                platform_order_id: this.state.data[i].platform_order_id,
                                actual_number: this.state.data[i].actual_number
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

const UserPayOrder = () => (
    <div>
        {
            <Title render={(previousTitle) => `${Lang[window.Lang].User.pay_order} - ${previousTitle}`} />
        }
        <PageComplex />
    </div>
);

export default UserPayOrder;

