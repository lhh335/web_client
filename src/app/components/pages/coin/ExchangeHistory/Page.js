import {QUERY_PROMOTER_EXCHANGE_HISTORY_C2S,QUERY_PROMOTER_EXCHANGE_HISTORY_S2C,} from "../../../../proto_enum";
import {ERROR_SELECTED_TIME, LOGIC_SUCCESS} from "../../../../ecode_enum";
import React from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MsgEmitter from '../../../../MsgEmitter';
import Util from '../../../../util';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import Paper from 'material-ui/Paper';

const styles = {
  simple: {
    margin: 'auto 20px auto 10px'
  }
};

class PageComplex extends React.Component {

  constructor(props) {
    super(props);

    const minDate = new Date();
    const maxDate = new Date();

    minDate.setHours(0, 0, 0, 0);

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
      cData: [],
      allData: [],
      selectedData: [],
      isSelectAll: false,
      searchWay: 2,
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
      total_refuse: 0,
      total_approved: 0,
      serchInput: "",
      sort: { time: -1 }
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
    var sortData = newData.sort(function (a, b) {
      return b.time - a.time;
    });
    this.state.allData = this.state.allData.concat(sortData);
  }

  handleUpdata = (page) => {
    if (page <= 0) {
      page = 1;
    }
    if (page > this.state.totalPage) {
      page = this.state.totalPage;
    }
    this.state.currentPage = page;
    if (this.state.rowsPerPage * (page) > this.state.allData.length && this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
      this.queryExchange();
    } else {
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

  handleCurrent = () => {
    this.handleOpenDetail()
  }

  handleSelection = (selectedRow) => {
    if (selectedRow !== undefined && selectedRow.length === 1) {

      this.state.selectedOne = selectedRow[0];
      this.state.singleInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleInfo === undefined) {
        this.state.singleInfo = {};
      }
    }
    this.handleOpenDetail()
  }

  showPre = () => {
    this.handleUpdata(this.state.currentPage - 1);
  }

  showNext = () => {
    this.handleUpdata(this.state.currentPage + 1);
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
    this.queryExchange();
  }

  refresh() {
    this.queryExchange();
  }

  queryExchange = () => {
    var minDate = this.state.minDate.getTime() / 1000;
    var maxDate = this.state.maxDate.getTime() / 1000;
    if (minDate > maxDate) {
      this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
      return;
    }

    var cb = (id = 0, message = null, args) => {
      if (id !== QUERY_PROMOTER_EXCHANGE_HISTORY_S2C) {
        return;
      }
      var self = args[0];
      var result = [];
      var total = [];
      self.state.count = message.count;
      self.state.totalPage = Util.page.getTotalPage(message.count);
      if (message.code === LOGIC_SUCCESS) {
        result = message.pei;
        total = message.ti;
        for (var i = 0; i < total.length; i++) {
          switch (total[i].type) {
            case 2:
              self.setState({ total_approved: total[i].sum });
              break;
            case 3:
              self.setState({ total_refuse: total[i].sum });
              break;
          }
        }
        this.handleUpdataAllData(result);

        this.handleUpdata(this.state.currentPage);

      }
      self.setState({ cData: message.cei });
    }
    var searchObj = {
      account: sessionStorage.account,
      // approve: this.state.search_way === "approved" ? 2 : 3,
      time: { "$gte": minDate, "$lte": maxDate }
    }
    var obj = {
      "account": sessionStorage.account,
      search: JSON.stringify(searchObj),
      data_length: this.state.allData.length,
      sort: JSON.stringify(this.state.sort),
    }

    MsgEmitter.emit(QUERY_PROMOTER_EXCHANGE_HISTORY_C2S, obj, cb, [this]);
  }


  componentWillUnmount() {

  }


  PasswordDialog = () => {
    return (<Dialog
      title={
        Lang[window.Lang].User.ChargePage.promoter_pw_front
        + Lang[window.Lang].Master.you
        + Lang[window.Lang].User.ChargePage.promoter_pw_back}
      actions={[<FlatButton
        label={Lang[window.Lang].User.approve_button}
        primary={true}
        onTouchTap={this.approveSelect}
      />, <FlatButton
        label={Lang[window.Lang].User.refuse_button}
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
        hintText={Lang[window.Lang].Master.you + Lang[window.Lang].User.ChargePage.promoter_pw_back}
        defaultValue=''
        fullWidth={true}
      />
    </Dialog>)
  }
  insertDetail = () => {
    var table = Lang[window.Lang].User.ExchangePage.Table;
    var list = [];
    for (var key in table) {
      if (key !== "invalid_time" && key !== "end_time") {
        list.push(
          <ul key={key}>
            <li>
              {table[key]}: {this.state.singleInfo === {} ? "" :
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
                {table[key]}: {Util.time.getTimeString(this.state.singleInfo["invalid_time"])}
                <br />
              </li>
            </ul>
          )
        } else if (this.state.singleInfo.approve === 2 && key === "end_time") {
          list.push(
            <ul key={key}>
              <li>
                {table[key]}: {Util.time.getTimeString(this.state.singleInfo["end_time"])}
                <br />
              </li>
            </ul>
          )
        } else if (this.state.singleInfo.approve === 3 && key === "end_time") {
          list.push(
            <ul key={key}>
              <li>
                {table[key]}: {Util.time.getTimeString(this.state.singleInfo["end_time"])}
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
        {this.state.cData !== [] ?
          <div>
            <Table
              height="50px"
              fixedHeader={this.state.fixedHeader}
              fixedFooter={this.state.fixedFooter}
              selectable={this.state.selectable}
              multiSelectable={this.state.multiSelectable}
              onRowSelection={this.handleCurrent}
            >
              <TableHeader
                displaySelectAll={this.state.showCheckboxes}
                adjustForCheckbox={this.state.showCheckboxes}
                enableSelectAll={this.state.enableSelectAll}
              >
                <TableRow>
                  <TableHeaderColumn colSpan="49" tooltip={Lang[window.Lang].Coin.ExchangePage.table_title1} style={{ textAlign: 'center' }}>
                    {Lang[window.Lang].Coin.ExchangePage.table_title1}
                  </TableHeaderColumn>
                </TableRow>
                {
                  this.state.showCol === "all" ?
                    <TableRow>
                      <TableHeaderColumn colSpan="8" tooltip="The Exchange_ID">{Lang[window.Lang].User.ExchangePage.Table.exchange_id}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="6" tooltip="The Account">{Lang[window.Lang].User.ExchangePage.Table.account}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="5" tooltip="The User_ID">{Lang[window.Lang].User.ExchangePage.Table.id}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="5" tooltip="The RMB">{Lang[window.Lang].User.ExchangePage.Table.coin}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="5" tooltip="The Approve">{Lang[window.Lang].User.ExchangePage.Table.approve}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="10" tooltip="The Time">{Lang[window.Lang].User.ExchangePage.Table.time}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="10" tooltip="The Invalid_Time">{this.state.queryType === "$all" ?
                        Lang[window.Lang].User.ChargePage.Table.invalid_time : Lang[window.Lang].User.ChargePage.Table.end_time}
                      </TableHeaderColumn>
                    </TableRow>
                    : <TableRow>
                      <TableHeaderColumn colSpan="16" tooltip="The Account">{Lang[window.Lang].User.ExchangePage.Table.account}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="16" tooltip="The RMB">{Lang[window.Lang].User.ExchangePage.Table.coin}</TableHeaderColumn>
                      <TableHeaderColumn colSpan="17" tooltip="The Approve">{Lang[window.Lang].User.ExchangePage.Table.approve}</TableHeaderColumn>
                    </TableRow>
                }
              </TableHeader>
              <TableBody
                displayRowCheckbox={this.state.showCheckboxes}
                deselectOnClickaway={this.state.deselectOnClickaway}
                preScanRows={this.state.preScanRows}
                showRowHover={this.state.showRowHover}
                stripedRows={this.state.stripedRows}
              >
                {this.state.cData.map((row, index) => (
                  this.state.showCol === "all" ?
                    <TableRow key={index} selectable={row.selected}>
                      <TableRowColumn colSpan="8">{row.exchange_id}</TableRowColumn>
                      <TableRowColumn colSpan="6">{row.account}</TableRowColumn>
                      <TableRowColumn colSpan="5">{row.id}</TableRowColumn>
                      <TableRowColumn colSpan="5">{row.coin}</TableRowColumn>
                      <TableRowColumn colSpan="5">{
                        row.approve === 1 && row.invalid_time - row.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > row.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                          row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time ? Lang[window.Lang].TableCommon.approving :
                            Lang[window.Lang].Master.approve_status[row.approve]
                      }</TableRowColumn>
                      <TableRowColumn colSpan="10">{Util.time.getTimeString(row.time)}</TableRowColumn>
                      <TableRowColumn colSpan="10">{Util.time.getTimeString(row.invalid_time)}</TableRowColumn>
                    </TableRow>
                    :
                    <TableRow key={index} selectable={row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time}>
                      <TableRowColumn colSpan="16">{row.account}</TableRowColumn>
                      <TableRowColumn colSpan="16">{row.coin}</TableRowColumn>
                      <TableRowColumn colSpan="17">{row.approve === 1 && row.invalid_time - row.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > row.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                        row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time ? Lang[window.Lang].TableCommon.approving :
                          row.approve === 2 ? Lang[window.Lang].TableCommon.approved :
                            row.approve === 3 ? Lang[window.Lang].TableCommon.refuse : ""}
                      </TableRowColumn>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
          </div >
          : ""
        }
        <TimeSelector
          callbackMinDateFuction={this.handleChangeMinDate}
          callbackMinTimeFuction={this.handleChangeMinTime}
          callbackMaxDateFuction={this.handleChangeMaxDate}
          callbackMaxTimeFuction={this.handleChangeMaxTime}
        />
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={styles.simple} onMouseUp={() => {
          this.state.data = [];
          this.state.allData = [];
          this.setState({ currentPage: 1, totalPage: 1 });
          this.queryExchange();
        }} />
        <div>
          <Table
            height={this.state.height}
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            onRowSelection={this.handleSelection}
          >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
            >
              <TableRow>
                <TableHeaderColumn colSpan="49" tooltip={Lang[window.Lang].Coin.ExchangePage.table_title2} style={{ textAlign: 'center' }}>
                  {Lang[window.Lang].Coin.ExchangePage.table_title2}
                </TableHeaderColumn>
              </TableRow>
              {
                this.state.showCol === "all" ?
                  <TableRow>
                    <TableHeaderColumn colSpan="8" tooltip="The Exchange_ID">{Lang[window.Lang].User.ExchangePage.Table.exchange_id}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="6" tooltip="The Account">{Lang[window.Lang].User.ExchangePage.Table.account}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="5" tooltip="The User_ID">{Lang[window.Lang].User.ExchangePage.Table.id}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="5" tooltip="The RMB">{Lang[window.Lang].User.ExchangePage.Table.coin}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="5" tooltip="The Approve">{Lang[window.Lang].User.ExchangePage.Table.approve}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="10" tooltip="The Time">{Lang[window.Lang].User.ExchangePage.Table.time}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="10" tooltip="The Invalid_Time">{this.state.queryType === "$all" ?
                      Lang[window.Lang].User.ChargePage.Table.invalid_time : Lang[window.Lang].User.ChargePage.Table.end_time}
                    </TableHeaderColumn>
                  </TableRow>
                  : <TableRow>
                    <TableHeaderColumn colSpan="16" tooltip="The Account">{Lang[window.Lang].User.ExchangePage.Table.account}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="16" tooltip="The RMB">{Lang[window.Lang].User.ExchangePage.Table.coin}</TableHeaderColumn>
                    <TableHeaderColumn colSpan="17" tooltip="The Approve">{Lang[window.Lang].User.ExchangePage.Table.approve}</TableHeaderColumn>
                  </TableRow>
              }
            </TableHeader>
            <TableBody
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              preScanRows={this.state.preScanRows}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
              {this.state.data.map((row, index) => (
                this.state.showCol === "all" ?
                  <TableRow key={index} selectable={row.selected}>
                    <TableRowColumn colSpan="8">{row.exchange_id}</TableRowColumn>
                    <TableRowColumn colSpan="6">{row.account}</TableRowColumn>
                    <TableRowColumn colSpan="5">{row.id}</TableRowColumn>
                    <TableRowColumn colSpan="5">{row.coin}</TableRowColumn>
                    <TableRowColumn colSpan="5">{
                      row.approve === 1 && row.invalid_time - row.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > row.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                        row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time ? Lang[window.Lang].TableCommon.approving :
                          row.approve === 2 ? Lang[window.Lang].TableCommon.approved :
                            row.approve === 3 ? Lang[window.Lang].TableCommon.refuse : ""
                    }</TableRowColumn>
                    <TableRowColumn colSpan="10">{Util.time.getTimeString(row.time)}</TableRowColumn>
                    <TableRowColumn colSpan="10">{Util.time.getTimeString(row.invalid_time)}</TableRowColumn>
                  </TableRow>
                  :
                  <TableRow key={index} selectable={row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time}>
                    <TableRowColumn colSpan="16">{row.account}</TableRowColumn>
                    <TableRowColumn colSpan="16">{row.coin}</TableRowColumn>
                    <TableRowColumn colSpan="17">{row.approve === 1 && row.invalid_time - row.time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > row.invalid_time ? Lang[window.Lang].TableCommon.invalid :
                      row.approve === 1 && Util.time.getTimeSecond() < row.invalid_time ? Lang[window.Lang].TableCommon.approving :
                        row.approve === 2 ? Lang[window.Lang].TableCommon.approved :
                          row.approve === 3 ? Lang[window.Lang].TableCommon.refuse : ""}
                    </TableRowColumn>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <h4 style={styles.totals}>总通过:{this.state.total_approved}元, 总拒绝:{this.state.total_refuse}元</h4>
        <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={styles.simple} onMouseUp={this.showPre} />
        {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
        <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={styles.simple} onMouseUp={this.showNext} />
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

const UserExchange = () => (
  <div>
    <Title render={(previousTitle) => `${Lang[window.Lang].Coin.exchangeHistory} - ${previousTitle}`} />
    <PageComplex />
  </div>
);

export default UserExchange;

