import { QUERY_RECHARGED_C2S, REFUSE_RECHARGE_C2S, APPROVE_RECHARGE_C2S, QUERY_RECHARGED_S2C, REFUSE_RECHARGE_S2C, APPROVE_RECHARGE_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";
import React from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactDataGrid from 'angon_react_data_grid';
import { Row } from 'react-data-grid';
import MsgEmitter from '../../../../MsgEmitter';
import Util from '../../../../util';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import CommonTable from '../../../myComponents/Table/CommonTable';


class PageComplex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      totalPage: 1,
      rowsPerPage: 10,
      data: [],
      search_way: "account",
      allData: [],
      selectedData: [],
      selectedOne: undefined,
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      queryType: "$all",
      passwordDialog: false,
      detail: false,
      singleInfo: {},
      searchInput: "",
      sort: { approve: 1, time: -1 },
      onloading: false,
      count: 0,
    };
  }

  popUpNotice = (type, code, content) => {
    this.setState({ type: type, code: code, content: content, alertOpen: true });
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
    if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
      this.showAll(false, false);
    } else {
      this.state.onloading = false;
      var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
      this.setState({ data: data });
    }
  }

  handleChargeSearchWay = (event, index, value) => this.setState({ search_way: value });

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
      actions={[<FlatButton
        label={Lang[window.Lang].User.to_approve_button}
        primary={true}
        disabled={this.state.singleInfo.approve !== 1 || Util.time.getTimeSecond() > this.state.singleInfo.invalid_time}
        onTouchTap={this.handlePasswordDialog}
      />]}
    >
      {this.insertDetail().map((key) => (key))}

    </Dialog>)
  }

  handleSelection = (selectedRow) => {
    if (selectedRow !== -1) {
      this.state.selectedOne = selectedRow;
      this.state.singleInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleInfo === undefined) {
        this.state.singleInfo = {};
      }
      this.handleOpenDetail();
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

  handlePasswordDialog = () => {
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
    var searchInput = document.getElementById("serch_player_text_field").value;
    this.state.searchInput = searchInput;
    this.showAll(true, true);
  }

  showAll = (reload = false, notice = false) => {
    if (reload) {
      this.state.data = [];
      this.state.allData = [];
      this.setState({ currentPage: 1, totalPage: 1 });
    }
    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_RECHARGED_S2C) {
        return;
      }
      var result = [];
      self.state.count = message.count;
      if (message.code === LOGIC_SUCCESS) {
        result = message.ri;
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
      this.setState({ queryType: "$all" });
    }

    var searchObj = new Object();
    if (this.state.searchInput !== "") {
      searchObj[this.state.search_way] = this.state.searchInput;
    }
    var obj = {
      search: JSON.stringify(searchObj),
      data_length: this.state.allData.length,
      sort: JSON.stringify(this.state.sort)
    }
    MsgEmitter.emit(QUERY_RECHARGED_C2S, obj, cb, [this, notice]);
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


  PasswordDialog = () => {
    return (<Dialog
      title={
        Lang[window.Lang].User.ChargePage.promoter_pw_front
        + (sessionStorage.accountType === "0" && this.state.singleInfo.recommend !== "" ? this.state.singleInfo.recommend : Lang[window.Lang].Master.you)
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
        hintText={(sessionStorage.accountType === "0" && this.state.singleInfo.recommend !== "" ? this.state.singleInfo.recommend : Lang[window.Lang].Master.you) + Lang[window.Lang].User.ChargePage.promoter_pw_back}
        defaultValue=''
        fullWidth={true}
      />
    </Dialog>)
  }

  insertDetail = () => {
    var table = Lang[window.Lang].User.ChargePage.Table;
    var list = [];
    for (var key in table) {
      if (key !== "invalid_time" && key !== "end_time") {
        list.push(
          <ul key={key}>
            <li>
              {table[key].name}: {this.state.singleInfo === {} ? "" :
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
        {sessionStorage.accountType === "0" ?
          <div>
            {/**<SelectField
              value={this.state.searchWay}
              onChange={this.handleChange}
              >
              <MenuItem value={1} primaryText="按推荐人查找玩家的充值" />
              <MenuItem value={2} primaryText="查找玩家的历史充值" />
            </SelectField>*/}

            <SelectField
              value={this.state.search_way}
              onChange={this.handleChargeSearchWay}
              style={Styles.selecteField2}
              middleWidth={true}
            >
              <MenuItem value={"account"} key={"account"} primaryText={Lang[window.Lang].User.AccountPage.search_by_account} />
              <MenuItem value={"recommend"} key={"recommend"} primaryText={Lang[window.Lang].Master.search_by_promoter} />
            </SelectField>
            <TextField
              middleWidth={true}

              id="serch_player_text_field"
              disabled={false}
              multiLine={false}
              hintText={this.state.search_way === "account" ? Lang[window.Lang].User.AccountPage.search_by_account : Lang[window.Lang].Master.search_by_promoter}
              defaultValue=""
              style={Styles.selecteField2}
              onChange={() => {
                document.getElementById('serch_player_text_field').onkeydown = (e) => {
                  var ev = e || window.event;
                  if (ev.keyCode === 13) {
                    this.takePhoto(true);
                  }
                }
              }}
            />
          </div> : <TextField
            id="serch_player_text_field"
            disabled={false}
            multiLine={false}
            hintText={this.state.search_way === "account" ? Lang[window.Lang].User.AccountPage.search_by_account : Lang[window.Lang].Master.search_by_promoter}
            defaultValue=""
            style={Styles.selecteField2}
            onChange={() => {
              document.getElementById('serch_text_field').onkeydown = (e) => {
                var ev = e || window.event;
                if (ev.keyCode === 13) {
                  this.tekePhoto(true);
                }
              }
            }}
          />}
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.raiseButton} onTouchTap={() => { this.takePhoto() }} />


        <div>
          <CommonTable
            table={Lang[window.Lang].User.ChargePage.Table}
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
                rmb: this.state.data[i].rmb,
                recommend: this.state.data[i].recommend === "" ? Lang[window.Lang].Master.admin : this.state.data[i].recommend,
                approve: this.state.data[i].approve === 1 && this.state.data[i].invalid_time - this.state.data[i].time >= 2 * Util.time.one_hour && Util.time.getTimeSecond() > this.state.data[i].invalid_time ? Lang[window.Lang].TableCommon.invalid :
                  this.state.data[i].approve === 1 && Util.time.getTimeSecond() < this.state.data[i].invalid_time ? Lang[window.Lang].TableCommon.approving :
                    Lang[window.Lang].Master.approve_status[this.state.data[i].approve],
                remarks: this.state.data[i].remarks,
                time: Util.time.getTimeString(this.state.data[i].time),
                invalid_time: Util.time.getTimeString(this.state.data[i].invalid_time),
                end_time: Util.time.getTimeString(this.state.data[i].end_time)
              }
            }}
            onRowClick={(rowIdx, row) => {
              this.handleSelection(rowIdx);
            }}
            renderColor={(idx) => {
              if (this.state.data[idx].approve === 1 && Util.time.getTimeSecond() < this.state.data[idx].invalid_time) {
                return "blue"
              } else {
                return "black"
              }
            }}
          />
        </div>
        <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
        {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
        <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
        <br />

        {this.detailDialog()}
        {this.PasswordDialog()}

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
      </div >
    );
  }
}

const UserCharge = () => (
  <div>
    {
      <Title render={(previousTitle) => `${Lang[window.Lang].User.charge_page} - ${previousTitle}`} />
    }
    <PageComplex />
  </div>
);

export default UserCharge;

