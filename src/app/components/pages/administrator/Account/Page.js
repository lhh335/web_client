import { QUERY_ADMINISTRATERS_C2S, REGIST_ADMINISTRATER_C2S, FROZEN_ACCOUNT_C2S, DELETE_ADMINISTRATER_C2S, RESET_ADMINISTRATER_C2S, FROZEN_ACCOUNT_S2C, QUERY_ADMINISTRATERS_S2C, REGIST_ADMINISTRATER_S2C, DELETE_ADMINISTRATER_S2C, RESET_ADMINISTRATER_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../proto_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'angonsoft_textfield';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Row } from 'react-data-grid';
import Util from '../../../../util';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import CommonTable from '../../../myComponents/Table/CommonTable';
import { Toolbar, Filters } from 'react-data-grid-addons';
import { Tabs, Tab } from 'material-ui/Tabs';

import AdminLog from '../Log/Page';
import {
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullWhite, fullBlack
} from 'material-ui/styles/colors';


class PageComplex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      rowsPerPage: 8,
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
      totalPage: 1,
      allData: [],
      data: [],
      showCol: window.innerWidth > window.innerHeight ? "all" : "status",
      selectedOne: undefined,
      AdministratorDetail: false,
      singlePlayerInfo: {},
      selectIndex: 1,
      addAdministratorDialog: false,
      resetDialog: false,
      deleteDialog: false,
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      count: 0,
      sort: { id: 1 },
      filters: {},
      textValue: '',
      sum: 0,
      onloading: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.textValue === 'resetPassword') {
      if (apptype === 1) {
        document.getElementById('reset_your_password_text_field').value = '';
      }
      document.getElementById('reset_password_text_field').value = '';
      document.getElementById('reset_again_password_text_field').value = '';
    }
    if (this.state.textValue === 'deleteAdmin') {
      if (apptype === 1) {
        document.getElementById('delete_your_password_text_field').value = '';
      }
    }
  }
  // 展示页面
  display = () => {
    switch (this.state.textValue) {
      case "resetPassword":
        return this.ResetDialog();
      case "deleteAdmin":
        return this.DeleteDialog();
      case "AdminLog":
        return <AdminLog admin={this.state.singlePlayerInfo} />
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
      this.queryAdmin(false);
    } else {
      this.state.onloading = false;
      var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
      this.setState({ data: data });
    }
  }


  componentDidMount() {
    window.currentPage = this;
    this.queryAdmin(true, false);
  }

  refresh() {
    this.queryAdmin(true);
  }

  showFirst = () => {
    this.handleUpdata(1);
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

  showLast = () => {
    var lastPage = Math.ceil(this.state.allData.length / this.state.rowsPerPage);
    this.handleUpdata(lastPage);
  }

  showGoto = () => {

  }

  handleUpdataAllData = (newData) => {
    this.state.allData = this.state.allData.concat(newData);
  }

  addNewAdministrator = () => {
    this.setState({ addAdministratorDialog: true })
  }

  handleSelection = (selectedRow) => {
    if (selectedRow !== -1) {
      this.state.selectedOne = selectedRow;
      this.state.singlePlayerInfo = this.state.data[this.state.selectedOne];
      if (this.state.singlePlayerInfo === undefined) {
        this.state.singlePlayerInfo = {};
      }
    }
    this.handleOpenDetail()
  }

  handleOpenReset = () => {
    this.setState({ resetDialog: true });
  }

  handleOpenDelete = () => {
    this.setState({ deleteDialog: true });
  }

  handleOpenDetail = () => {
    if (this.state.selectedOne !== undefined) {
      this.setState({ AdministratorDetail: true });
    }
  };
  // 查询管理员按钮
  queryAdmin = (reloadData = false, notice = true) => {
    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_ADMINISTRATERS_S2C) {
        return;
      }
      // if (message.code === LOGIC_SUCCESS) {
      if (args[1]) {
        this.state.data = [];
        this.state.allData = [];
        this.setState({ currentPage: 1, totalPage: 1 });
      }
      self.state.count = message.count;
      var result = [];
      result = message.ai;
      self.handleUpdataAllData(result);
      self.handleUpdata(self.state.currentPage);
      var page = Util.page.getTotalPage(message.count, this.state.rowsPerPage);
      self.setState({ count: message.count, totalPage: page, sum: message.sum });
      if (notice === true) {
        self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
      }
      // }
    }
    if (reloadData) {
      this.state.data = [];
      this.state.allData = [];
      this.setState({ currentPage: 1, totalPage: 1 });
    }
    var serchInput = document.getElementById("serch_text_field");
    var account = serchInput.value;
    if (account === "") {
      account = "$all"
    }
    var obj = {
      "account": account,
      data_length: this.state.allData.length,
      filters: JSON.stringify(this.state.filters),
      sort: JSON.stringify(this.state.sort)
    }

    MsgEmitter.emit(QUERY_ADMINISTRATERS_C2S, obj, cb, [this, reloadData]);
  }
  // 新增管理员确定按钮
  handleAddAdministrator = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }

    var account = document.getElementById("add_account_text_field");
    var password = document.getElementById("add_password_text_field");
    var again_password = document.getElementById("add_again_text_field");
    if (account.value === "" || password.value === "" || again_password.value === "") {
      return;
    }

    if (password.value !== again_password.value) {
      this.popUpNotice("notice", 10020, Lang[window.Lang].ErrorCode[10020]);
      return
    }

    var obj = {
      account: account.value,
      password: password.value,
      language: 1
    }

    var cb = (id = 0, message = null, args) => {
      if (id !== REGIST_ADMINISTRATER_S2C) {
        return;
      }
      var self = args;
      if (message.code === LOGIC_SUCCESS) {
        var result = message.pl;
        self.handleUpdata(1);
        self.queryAdmin(true);
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      self.handleCloseReset();
      self.handleCloseDetail();
    }
    MsgEmitter.emit(REGIST_ADMINISTRATER_C2S, obj, cb, this);
  }

  // 禁用按钮
  frozenAccount = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }
    var account = this.state.singlePlayerInfo.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === FROZEN_ACCOUNT_S2C) {
        var self = arg[0];
        if (message.code === LOGIC_SUCCESS) {
          self.handleUpdata(1);
        }
        arg[1] === true ? self.state.singlePlayerInfo.status = 1 : self.state.singlePlayerInfo.status = 0;
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      }
    }
    var frozen;
    if (this.state.singlePlayerInfo.status === 0) {
      frozen = true;
    } else if (this.state.singlePlayerInfo.status === 1) {
      frozen = false;
    }
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "type": 1,
      "be_frozen": frozen
    }
    MsgEmitter.emit(FROZEN_ACCOUNT_C2S, obj, cb, [this, frozen]);
  }
  // 删除管理员确定按钮
  deleteAdmin = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }
    var account = this.state.singlePlayerInfo.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== DELETE_ADMINISTRATER_S2C) {
        return;
      }
      var self = arg;
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      self.handleCloseReset();
      self.handleCloseDetail();
      self.queryAdmin(true);
      self.setState({
        textValue: ''
      })
    }
    var your_password;
    if (apptype === 2) {
      your_password = '';
    } else {
      your_password = document.getElementById("delete_your_password_text_field").value;
    }
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "your_password": your_password,
    }
    MsgEmitter.emit(DELETE_ADMINISTRATER_C2S, obj, cb, this);
  }
  // 重置密码确定按钮
  resetPassword = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }
    var account = this.state.singlePlayerInfo.account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== RESET_ADMINISTRATER_S2C) {
        return;
      }
      var self = arg;
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      self.handleCloseReset();
    }
    var your_password;
    if (apptype === 2) {
      your_password = "";
    } else {
      your_password = document.getElementById("reset_your_password_text_field").value;
    }
    var password = document.getElementById("reset_password_text_field").value;
    var again_password = document.getElementById("reset_again_password_text_field").value;
    if (password !== again_password) {
      this.popUpNotice("notice", 10020, Lang[window.Lang].ErrorCode[10020]);
      return
    }
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "your_password": your_password,
      "password": password,
    }
    MsgEmitter.emit(RESET_ADMINISTRATER_C2S, obj, cb, this);
  }


  handleCloseDetail = () => {
    this.setState({ AdministratorDetail: false });
    this.setState({ addAdministratorDialog: false });
  };
  // 关闭重置密码页面
  handleCloseReset = () => {
    this.setState({ resetDialog: false });
    this.setState({ deleteDialog: false });
    this.setState({ textValue: '' });
  }
  // 删除管理员页面
  DeleteDialog = () => {
    return (<Paper>
      {apptype === 2 ? '' :
        <TextField
          id="delete_your_password_text_field"
          disabled={false}
          multiLine={false}
          type="password"
          floatingLabelFixed={true}
          floatingLabelStyle={Styles.floatingLabelStyle}
          inputStyle={Styles.inputStyle}
          floatingLabelText={Lang[window.Lang].Administrator.AccountPage.your_password}
          defaultValue=""
          fullWidth={true}
        />
      }
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => { this.deleteAdmin() }}
      />
      <br />
    </Paper>)
  }
  // 重置密码
  ResetDialog = () => {
    return (<Paper>
      {apptype === 2 ? "" :
        <TextField
          id="reset_your_password_text_field"
          disabled={false}
          multiLine={false}
          type="password"
          floatingLabelFixed={true}
          floatingLabelStyle={Styles.floatingLabelStyle}
          inputStyle={Styles.inputStyle}
          floatingLabelText={Lang[window.Lang].Administrator.AccountPage.your_password}
          defaultValue=""
          fullWidth={true}
        />}
      <br />
      <TextField
        id="reset_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        inputStyle={Styles.inputStyle}
        floatingLabelText={Lang[window.Lang].Administrator.AccountPage.new_password}
        defaultValue=""
        fullWidth={true}

      />
      <br />
      <TextField
        id="reset_again_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        inputStyle={Styles.inputStyle}
        floatingLabelText={Lang[window.Lang].Administrator.AccountPage.again_password}
        defaultValue=""
        fullWidth={true}
      />
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => { this.resetPassword() }}
      />
      <br />



    </Paper>)
  }
  // 新增管理员页面
  AddDialog = () => {
    return (<Dialog
      title={Lang[window.Lang].Administrator.AccountPage.new_account}
      actions={[<FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={this.handleAddAdministrator}
      />]}
      modal={false}
      open={this.state.addAdministratorDialog}
      onRequestClose={this.handleCloseDetail}
      autoScrollBodyContent={true}
    >
      <TextField
        id="add_account_text_field"
        disabled={false}
        multiLine={false}
        hintText={Lang[window.Lang].Administrator.AccountPage.administrator_account}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="add_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Administrator.AccountPage.administrator_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="add_again_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Administrator.AccountPage.again_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />

    </Dialog>)
  }

  render() {
    return (
      <div>
        <TextField
          id="serch_text_field"
          disabled={false}
          multiLine={false}
          hintText={Lang[window.Lang].Master.search_by_account}
          defaultValue=""
          style={{ float: 'left', marginRight: 10, marginTop: 5 }}
          middleWidth={true}
          onChange={() => {
            document.getElementById('serch_text_field').onkeydown = (e) => {
              var ev = e || window.event;
              if (ev.keyCode === 13) {
                this.queryAdmin(true);
              }
            }
          }}

        />
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.raiseButton} onTouchTap={() => { this.queryAdmin(true) }} />
        <RaisedButton label={Lang[window.Lang].Administrator.AccountPage.add_button} primary={true} style={Styles.raiseButton} onTouchTap={() => {
          this.addNewAdministrator();
        }} />
        <div>
          <CommonTable
            table={Lang[window.Lang].Administrator.AccountPage.Table}
            /*table表示表格标题*/
            data={this.state.data}
            handleGridSort={(sortColumn, sortDirection) => {
              this.state.sort = {}
              if (sortDirection === 'ASC') {
                this.state.sort[sortColumn] = 1
              } else {
                this.state.sort[sortColumn] = -1
              }
              this.queryAdmin(true);
            }}
            rowGetter={(i) => {
              if (i === -1) { return {} }
              return {
                id: this.state.data[i].id,
                account: this.state.data[i].account,
                leader: this.state.data[i].leader,
                status: [Lang[window.Lang].Administrator.AccountPage.normal, Lang[window.Lang].Administrator.AccountPage.forbidden][this.state.data[i].status],
                language: Lang[window.Lang].Lang[1],
                time: Util.time.getTimeString(this.state.data[i].time),
                isSelected: this.state.selectedOne === i
              }
            }}
            maxHeight={270}
            onRowClick={(rowIdx, row) => {
              this.handleSelection(rowIdx);
            }}
          />
          <div style={Styles.totalApproveAndRefuse}>
            <h5 style={Styles.fontLeftFloat}>管理员总数:{this.state.sum}</h5>
            <h5 style={Styles.fontLeftFloat}>搜索管理员总数:{this.state.count}</h5>
          </div>

          <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
          {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
          <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />


          <br />
          {this.state.singlePlayerInfo.account !== undefined ?
            <div>
              <Tabs>
                <Tab label={Lang[window.Lang].Administrator.adminSet}
                  onActive={() => {
                    this.setState({
                      showSelect: 'adminSet',
                      textValue: ''
                    })
                  }}
                >
                  <div>
                    <FlatButton
                      label={Lang[window.Lang].Administrator.AccountPage.reset_pw_button}
                      primary={true}
                      disabled={this.state.textValue === 'resetPassword'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'resetPassword'
                        })
                      }}
                    />
                    <FlatButton
                      label={this.state.singlePlayerInfo.status === 0 ?
                        Lang[window.Lang].Promoter.AccountPage.frozen_button : Lang[window.Lang].Promoter.AccountPage.thaw_button}
                      primary={true}
                      disabled={sessionStorage.account === this.state.singlePlayerInfo.account}
                      onTouchTap={() => { this.frozenAccount() }}
                    />
                    <FlatButton
                      label={Lang[window.Lang].Administrator.AccountPage.delete_button}
                      primary={true}
                      disabled={this.state.textValue === 'deleteAdmin' || sessionStorage.account === this.state.singlePlayerInfo.account}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'deleteAdmin'
                        })
                      }}
                    />
                  </div>
                </Tab>
                <Tab label={Lang[window.Lang].Administrator.log}
                  onActive={() => {
                    this.setState({
                      showSelect: 'adminLog',
                      textValue: 'AdminLog'
                    })
                  }}
                >
                </Tab>
              </Tabs>

              {this.display()}
            </div> : ""}

          {this.AddDialog()}
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
            this.setState({ alertOpen: false });
          }}>
        </CommonAlert>
      </div>
    );
  }
}

const AdminAccount = () => (
  <div>
    {sessionStorage.accountType === '0' ?
      <Title render={(previousTitle) => `${Lang[window.Lang].Administrator.account} - ${previousTitle}`} /> :
      <Title render={(previousTitle) => `${Lang[window.Lang].Administrator.account} - 超级管理员后台`} />
    }
    <PageComplex />
  </div>
);
export default AdminAccount;
export { PageComplex as accountInfo };