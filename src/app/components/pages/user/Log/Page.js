import { QUERY_PLAYER_LOG_C2S, QUERY_PLAYER_LOG_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS } from "../../../../ecode_enum";
import React from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Util from '../../../../util';
import MsgEmitter from '../../../../MsgEmitter';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';
import CommonTable from '../../../myComponents/Table/CommonTable';


import protobuf from 'protobufjs';
import areIntlLocalesSupported from 'intl-locales-supported';

let DateTimeFormat;

const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/zh-Hans-CN');

class TableExampleComplex extends React.Component {

  constructor(props) {
    super(props);


    const minDate = new Date();
    const maxDate = new Date();

    minDate.setHours(0, 0, 0, 0);
    minDate.setDate(1);
    maxDate.setHours(23, 59, 59, 0);



    this.state = {
      currentPage: 1,
      rowsPerPage: 10,
      totalPage: 1,
      minDate: minDate,
      maxDate: maxDate,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: true,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      preScanRows: true,
      height: '510px',
      allData: [],
      data: [],
      showCol: window.innerWidth > window.innerHeight ? "all" : "",
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      coinType: 1,
      LogDetail: false,
      selectedOne: undefined,
      singleLogInfo: {},
      selectedMenu: "login_time",
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
    if (this.state.rowsPerPage * (page) > this.state.allData.length && this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
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

  getPageData = (page, notice = false) => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.state.onloading = false;
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }

    var input = document.getElementById("serch_text_field");
    if (input.value === "") {
      this.state.onloading = false;
      this.popUpNotice("notice", 99007, Lang[window.Lang].ErrorCode[99007]);
      return;
    }

    var minDate = this.state.minDate.getTime() / 1000;
    var maxDate = this.state.maxDate.getTime() / 1000;
    if (minDate > maxDate) {
      this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
      return;
    }
    var obj = {
      account: input.value,
      from: minDate,
      to: maxDate,
      data_length: this.state.allData.length,
    }
    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_PLAYER_LOG_S2C) {
        return;
      }
      var result = message.pl;
      if (message.code === LOGIC_SUCCESS) {
        self.state.totalPage = Util.page.getTotalPage(message.count);
        self.handleUpdataAllData(result);
        self.handleUpdata(self.state.currentPage);
      }
      if (result.length > 0) {
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      } else if (result.length === 0) {
        self.popUpNotice("notice", 99009, Lang[window.Lang].ErrorCode[99009]);
      }
    }
    MsgEmitter.emit(QUERY_PLAYER_LOG_C2S, obj, cb, [this]);
  }

  componentDidUpdate() {

  }

  componentDidMount() {
    window.currentPage = this;
  }

  refresh() {
    this.state.data = [];
    this.state.allData = [];
    this.setState({ currentPage: 1, totalPage: 1 });
    this.getPageData(1, true)
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
    var sortData = newData.sort(function (a, b) {
      return b.time - a.time;
    });
    this.state.allData = this.state.allData.concat(sortData);
  }

  handleSelection = (selectedRow) => {
    if (selectedRow !== undefined && selectedRow.length === 1) {

      this.state.selectedOne = selectedRow[0];
      this.state.singleLogInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleLogInfo === undefined) {
        this.state.singleLogInfo = {};
      }
    }
    this.handleOpenDetail()
  }

  handleOpenDetail = () => {
    if (this.state.selectedOne !== undefined) {
      this.setState({ LogDetail: true });
    }
  };

  handleCloseDetail = () => {
    this.setState({ LogDetail: false });
  };


  handleChange = (event, index, value) => this.setState({ showCol: value, selectedMenu: value });
  handleCoinTypeChange = (event, index, value) => this.setState({ coinType: value });

  LogDialog = () => {
    return (<Dialog
      modal={false}
      open={this.state.LogDetail}
      onRequestClose={this.handleCloseDetail}
      autoScrollBodyContent={true}
    >
      {this.insertDetail().map((key) => (key))}

    </Dialog>)
  }

  insertMenuItem = () => {
    var table = Lang[window.Lang].User.LogPage.Table;
    var list = [];
    for (var key in table) {
      list.push(<MenuItem value={key} key={key} primaryText={table[key].name} />)
    }
    return list;
  }

  insertDetail = () => {
    var table = Lang[window.Lang].User.LogPage.Table;
    var list = [];
    for (var key in table) {
      list.push(
        <ul key={key}>
          <li>
            {table[key].name}: {this.state.singleLogInfo === {} ? "" :
              key === "login_time" ? Util.time.getTimeString(this.state.singleLogInfo.login_time) : this.state.singleLogInfo[key]}
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
        <div style={Styles.normalFloat}>
          <TimeSelector
            callbackMinDateFuction={this.handleChangeMinDate}
            callbackMinTimeFuction={this.handleChangeMinTime}
            callbackMaxDateFuction={this.handleChangeMaxDate}
            callbackMaxTimeFuction={this.handleChangeMaxTime}
          />
        </div>
        <TextField
          id="serch_text_field"
          disabled={false}
          multiLine={false}
          hintText={'请输入玩家账号'}
          defaultValue=""
          middleWidth={true}
          style={Styles.selecteField}
          onChange={() => {
            document.getElementById('serch_text_field').onkeydown = (e) => {
              var ev = e || window.event;
              if (ev.keyCode === 13) {
                this.state.data = [];
                this.state.allData = [];
                this.setState({ currentPage: 1, totalPage: 1 });
                this.getPageData(1, true)
              }
            }

          }}
        />

        <RaisedButton label={Lang[window.Lang].User.LogPage.search_button} primary={true} style={Styles.coinSearch} onTouchTap={
          () => {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1 });
            this.getPageData(1, true)
          }
        } />

        <CommonTable
          table={Lang[window.Lang].User.LogPage.Table}
          data={this.state.data}
          rowGetter={(i) => {
            if (i === -1) { return {} }
            return {
              account: this.state.data[i].account,
              vendoridentfier: this.state.data[i].vendoridentfier,
              system_version: this.state.data[i].system_version,
              device_model: this.state.data[i].device_model,
              device_name: this.state.data[i].device_name,
              device_type: this.state.data[i].device_type,
              device_uniqueidentifier: this.state.data[i].device_uniqueidentifier,
              operating_system: this.state.data[i].operating_system,
              ip: this.state.data[i].ip,
              login_time: Util.time.getTimeString(this.state.data[i].login_time)
            }
          }}
          maxHeight={550}

        />

        <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
        {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
        <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
        <br />
        {this.LogDialog()}

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

const UserLog = () => (
  <div>
    {sessionStorage.accountType === "2" ?
      <Title render={(previousTitle) => `${Lang[window.Lang].User.log} - 超级管理员后台`} /> :
      <Title render={(previousTitle) => `${Lang[window.Lang].User.log} - 工厂后台`} />
    }
    <TableExampleComplex />
  </div>
);

export default UserLog;