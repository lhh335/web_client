
import { QUERY_PLAYERS_RECHARGE_C2S, QUERY_PLAYER_RECHARGE_C2S, QUERY_RECHARGED_HISTORY_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";

import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import MsgEmitter from '../../../../MsgEmitter';
import Util from '../../../../util';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import CommonTable from '../../../myComponents/Table/CommonTable';
import { accountInfo } from '../Account/Page';

class PageComplex extends Component {
  static PropTypes = {
    player: PropTypes.string
  }

  static defaultProps = {
    player: ""
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
      rowsPerPage: 4,
      data: [],
      allData: [],
      selectedData: [],
      isSelectAll: false,
      searchWay: 2,
      selectedOne: [],
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      queryType: "$all",
      detail: false,
      singleInfo: {},
      serchInput: "",
      total_refuse: 0,
      total_approved: 0,
      search_way: "approved",
      sort: { time: -1 },
      onloading: false,
      count: 0
    };
  }

  popUpNotice = (type, code, content) => {
    this.setState({ type: type, code: code, content: content, alertOpen: true });
  }

  handleChangeMinDate = (event, date) => {
    if (date.getTime() < this.state.maxDate.getTime()) {
      date.setHours(this.state.minDate.getHours(), this.state.minDate.getMinutes(), this.state.minDate.getSeconds());
      this.state.minDate = date;
    }
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
  //点击上、下一页更新页数
  handleUpdata = (page) => {
    this.state.onloading = true;

    if (page <= 0) {
      page = 1;
    }
    if (page > this.state.totalPage) {
      page = this.state.totalPage;
    }
    this.state.currentPage = page;
    if (this.props.player === '') {
      this.state.rowsPerPage = 10;
    }
    if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
      this.queryRecharge(false, false);
    } else {
      var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
      this.state.onloading = false;
      this.setState({ data: data });
    }
  }


  handleChange = (event, index, value) => this.setState({ searchWay: value });
  handleChargeSearchWay = (event, index, value) => {
    this.setState({ search_way: value });
    this.state.search_way = value;
    this.queryRecharge(true, true);
  };

  handleOpenDetail = () => {
    if (this.state.selectedOne !== undefined) {
      this.setState({ detail: true });
    }
  };

  handleCloseDetail = () => {
    this.setState({ detail: false });
  };

  handleSelection = (selectedRow) => {
    if (selectedRow !== undefined && selectedRow.length === 1) {

      this.state.selectedOne = selectedRow[0];
      this.state.singleInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleInfo === undefined) {
        this.state.singleInfo = {};
      }
    }
    // this.handleOpenDetail()
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

  componentDidUpdate() {

  }

  componentDidMount() {
    var {
      player
    } = this.props;
    if (player.id === null) {
      window.currentPage = this;
    }
    this.queryRecharge(true, false);
  }

  refresh() {
    this.takePhoto();
  }

  takePhoto = () => {
    this.queryRecharge(true, true);
  }
  queryRecharge = (reload = false, notice = false) => {
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
    // if (this.state.searchWay === 2) {
    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_RECHARGED_HISTORY_S2C) {
        return;
      }
      var result = [];
      var total = [];
      self.state.count = message.count;
      if (message.code === LOGIC_SUCCESS) {
        result = message.ri;
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
        self.state.totalPage = Util.page.getTotalPage(message.count, this.props.player === '' ? 10 : this.state.rowsPerPage);
        self.handleUpdataAllData(result);
        self.handleUpdata(self.state.currentPage);
      }
      self.setState({ totalPage: Util.page.getTotalPage(message.count, this.props.player === '' ? 10 : this.state.rowsPerPage) });
      if (args[1] === true) {
        if (message.code === ERROR_HAVE_NO_MORE_PAGES && result.length === 0) {
          self.popUpNotice("notice", 0, Lang[window.Lang].Master.no_data);
        } else {
          self.popUpNotice("notice", message.code, Lang[window.Lang].Master.search_success);
        }
      }
      self.setState({ queryType: "$one" });
    }
    var obj;
    var account = this.state.serchInput || document.getElementById("serch_player_text_field").value;
    if (account === "") {
      var searchObj = {
        approve: this.state.search_way === "approved" ? [2, 12] : [3, 13],
        time: { "$gte": minDate, "$lte": maxDate }
      }
      obj = {
        search: JSON.stringify(searchObj),
        data_length: this.state.allData.length,
        sort: JSON.stringify(this.state.sort),
      }
      MsgEmitter.emit(QUERY_PLAYERS_RECHARGE_C2S, obj, cb, [this, notice]);
    } else {
      var searchObj = {
        approve: this.state.search_way === "approved" ? [2, 12] : [3, 13],
        time: { "$gte": minDate, "$lte": maxDate }
      }
      obj = {
        account: account,
        data_length: this.state.allData.length,
        search: JSON.stringify(searchObj),
        sort: JSON.stringify(this.state.sort),
      }
      MsgEmitter.emit(QUERY_PLAYER_RECHARGE_C2S, obj, cb, [this, notice]);
    }

  }
  render() {
    var {
          player
        } = this.props;
    this.state.serchInput = player;
    return (
      <div>
        <Divider />
        <div style={Styles.normalFloat}>
          <TimeSelector
            callbackMinDateFuction={this.handleChangeMinDate}
            callbackMinTimeFuction={this.handleChangeMinTime}
            callbackMaxDateFuction={this.handleChangeMaxDate}
            callbackMaxTimeFuction={this.handleChangeMaxTime}
            minDate={this.state.minDate.getTime()}
          />
        </div>

        <SelectField
          value={this.state.search_way}
          onChange={this.handleChargeSearchWay}
          style={Styles.selecteField}
          middleWidth={true}
        >
          <MenuItem value={"approved"} key={"approved"} primaryText={Lang[window.Lang].User.ChargeHistoryPage.approved_order} />
          <MenuItem value={"refused"} key={"refused"} primaryText={Lang[window.Lang].User.ChargeHistoryPage.refused_order} />
        </SelectField>
        {player === "" ?
          <TextField
            middleWidth={true}

            style={Styles.selecteField}
            id="serch_player_text_field"
            disabled={false}
            multiLine={false}
            hintText={Lang[window.Lang].Master.search_by_account}
            defaultValue=""
            onChange={(event) => {
              this.state.serchInput = event.target.value;
              document.getElementById('serch_player_text_field').onkeydown = (e) => {
                var ev = e || window.event;
                if (ev.keyCode === 13) {
                  this.takePhoto();
                }
              }
            }}
          /> : ""}
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={() => { this.takePhoto() }} />


        <CommonTable
          table={Lang[window.Lang].User.ChargeHistoryPage.Table}
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
              order_id: this.state.data[i].order_id,
              account: this.state.data[i].account,
              id: this.state.data[i].id,
              rmb: this.state.data[i].rmb,
              recommend: this.state.data[i].recommend === "" ? Lang[window.Lang].Master.admin : this.state.data[i].recommend,
              approve: this.state.data[i].approve === 1 && this.state.data[i].invalid_time - this.state.data[i].time === 2 * Util.time.one_hour && Util.time.getTimeSecond() > this.state.data[i].invalid_time ? Lang[window.Lang].TableCommon.invalid :
                this.state.data[i].approve === 1 && Util.time.getTimeSecond() < this.state.data[i].invalid_time ? Lang[window.Lang].TableCommon.approving :
                  Lang[window.Lang].Master.approve_status[this.state.data[i].approve % 10],
              type: Lang[window.Lang].Master.recharge_approve_type[Math.floor(this.state.data[i].approve / 10)],
              remarks: this.state.data[i].remarks,
              time: Util.time.getTimeString(this.state.data[i].time),
              invalid_time: Util.time.getTimeString(this.state.data[i].invalid_time),
              end_time: Util.time.getTimeString(this.state.data[i].end_time)
            }
          }}
          maxHeight={player === "" ? 350 : 170}
          onRowClick={(rowIdx, row) => {
            this.handleSelection(rowIdx);
          }}
        />
        <div style={Styles.totalApproveAndRefuse}>
          <h5 style={Styles.fontLeftFloat}>总通过:{this.state.total_approved}元</h5>
          <h5 style={Styles.fontLeftFloat}>总拒绝:{this.state.total_refuse}元</h5>
        </div>
        <div style={Styles.fontLeftFloat}>
          <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
          {this.state.currentPage} {Lang[window.Lang].Master.page} /{this.state.totalPage}{Lang[window.Lang].Master.page}
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
      </div>
    );
  }
}

class UserChargeHistory extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].User.player_charge_history} - ${previousTitle}`} />
        <PageComplex player={this.props.player} />
      </div>
    )
  }
}
export default UserChargeHistory;

