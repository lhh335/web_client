import { SET_PROMOTER_BANG_C2S, RECHARGE_PROMOTER_C2S, EXCHANGE_PROMOTER_C2S, DELETE_PROMOTER_C2S, RESET_PROMOTER_C2S, QUERY_PROMOTER_C2S, REGIST_PROMOTER_C2S, FROZEN_ACCOUNT_C2S, DELETE_PROMOTER_S2C, RESET_PROMOTER_S2C, FROZEN_ACCOUNT_S2C, SET_PROMOTER_BANG_S2C, EXCHANGE_PROMOTER_S2C, QUERY_PROMOTER_S2C, REGIST_PROMOTER_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React from 'react';
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

import { Row } from 'react-data-grid';
import Util from '../../../../util';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import UserCharge from '../ChargeHistory/Page';
import UserExchange from '../ExchangeHistory/Page';
import PromoterGivenHistory from '../GivenHistory/Page';
import PromoterConfiscatedHistory from '../ConfiscatedHistory/Page';

import PromoterLog from '../Log/Page';
import PromoterProfit from '../Profit/Page';
import { Tabs, Tab } from 'material-ui/Tabs';


import CommonTable from '../../../myComponents/Table/CommonTable';


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
      showCol: window.innerWidth > window.innerHeight ? "all" : "game_coin",
      selectedOne: -1,
      promoterDetail: false,
      singlePlayerInfo: {},
      selectIndex: 1,
      addPromoterDialog: false,
      resetDialog: false,
      deleteDialog: false,
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      selectedMenu: "game_coin",
      count: 0,
      sort: { id: 1 },
      filters: {},
      textValue: '',
      sum: 0,
      onloading: false,
      showSelect: ''
    };
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
    if (this.state.rowsPerPage * (page) > this.state.allData.length && this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
      this.queryPromoter(false);
    } else {
      this.state.onloading = false;
      var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
      this.setState({ data: data });
    }
  }

  handleChange = (event, index, value) => this.setState({ showCol: value, selectedMenu: value });

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }

  componentDidMount() {
    window.currentPage = this;
    this.queryPromoter(true);
  }

  refresh() {
    this.queryPromoter(true);
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
  componentDidUpdate(prevProps, prevState) {
    if (this.state.textValue === 'setCoin') {
      document.getElementById('coin_value_text_field').value = '';
      document.getElementById('set_coin_your_password_text_field').value = '';
    }
    if (this.state.textValue === 'resetBang') {
      document.getElementById('bang_value_text_field').value = '';
      document.getElementById('set_bang_your_password_text_field').value = '';
    }
    if (this.state.textValue === 'resetPassword') {
      document.getElementById('your_password_text_field').value = '';
      document.getElementById('reset_password_text_field').value = '';
      document.getElementById('reset_again_password_text_field').value = '';
    }
    if (this.state.textValue === 'deletePromoter') {
      document.getElementById('delete_your_password_text_field').value = '';
    }
  }
  display = () => {
    switch (this.state.textValue) {
      case "setCoin":
        return this.SetCoinDialog();
      case "resetPassword":
        return this.ResetDialog();
      case "resetBang":
        return this.BangDialog();
      case "deletePromoter":
        return this.DeleteDialog();
      case "promoterCharge":
        return <UserCharge promoter={this.state.singlePlayerInfo} />;
      case "promoterExchange":
        return <UserExchange promoter={this.state.singlePlayerInfo} />;
      case "promoterGiven":
        return <PromoterGivenHistory promoter={this.state.singlePlayerInfo} />;
      case "promoterConfiscated":
        return <PromoterConfiscatedHistory promoter={this.state.singlePlayerInfo} />
      case "promoterLog":
        return <PromoterLog promoter={this.state.singlePlayerInfo} />;
      case 'promoterProfit':
        return <PromoterProfit promoter={this.state.singlePlayerInfo} />
    }
  }
  // 调整金币页面
  SetCoinDialog = () => {
    return (<Paper>
      <TextField
        id="coin_value_text_field"
        disabled={false}
        multiLine={false}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.coin_value}
        floatingLabelFixed={true}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
      />
      <br />
      <TextField
        id="set_coin_your_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.your_password}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
        onChange={() => {
          document.getElementById('set_coin_your_password_text_field').onkeydown = (e) => {
            var ev = e || window.event;
            if (ev.keyCode === 13) {
              this.handleSetCoin();

            }
          }
        }}
      />
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => {
          this.handleSetCoin();
        }}
      />
      <br />
    </Paper>)
  }

  // 重置密码操作页面
  ResetDialog = () => {
    return (<Paper>
      <TextField
        id="your_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.your_password}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}

      />
      <br />
      <TextField
        id="reset_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.new_password}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}

      />
      <br />
      <TextField
        id="reset_again_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.again_password}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
        onChange={() => {
          document.getElementById('reset_again_password_text_field').onkeydown = (e) => {
            var ev = e || window.event;
            if (ev.keyCode === 13) {
              this.resetPassword();

            }
          }
        }}
      />
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => {
          this.resetPassword();
        }}
      />
      <br />
    </Paper>)
  }
  //设置爆机值
  BangDialog = () => {
    return (<Paper>
      <TextField
        id="bang_value_text_field"
        disabled={false}
        multiLine={false}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.bang}
        floatingLabelFixed={true}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
      />
      <br />
      <TextField
        id="set_bang_your_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelFixed={true}
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={this.state.singlePlayerInfo.account + "的密码"}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
        onChange={() => {
          document.getElementById('set_bang_your_password_text_field').onkeydown = (e) => {
            var ev = e || window.event;
            if (ev.keyCode === 13) {
              this.handleSetBang();
            }
          }
        }}
      />
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => {
          this.handleSetBang();
        }}
      />
      <br />
    </Paper>)
  }
  //删除推广员页面 
  DeleteDialog = () => {
    return (<Paper>
      <TextField
        id="delete_your_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        floatingLabelStyle={Styles.floatingLabelStyle}
        floatingLabelText={'您的密码'}
        floatingLabelFixed={true}
        defaultValue=""
        fullWidth={true}
        inputStyle={Styles.inputStyle}
        onChange={() => {
          document.getElementById('delete_your_password_text_field').onkeydown = (e) => {
            var ev = e || window.event;
            if (ev.keyCode === 13) {
              this.deletePromoter();
            }
          }
        }}
      />
      <FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={() => {
          this.deletePromoter();
        }}
      />
      <br />
    </Paper>)
  }
  //设置爆机值确定按钮
  handleSetBang = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }
    var account = this.state.singlePlayerInfo.account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== SET_PROMOTER_BANG_S2C) {
        return;
      }
      var self = arg[0];
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      if (message.code === LOGIC_SUCCESS) {
        self.state.singlePlayerInfo.bang = Number(arg[3]);
        arg[2].value = "";
        arg[3] = "";
        self.queryPromoter(true);
      }


    }
    var password = document.getElementById("set_bang_your_password_text_field");
    var bang_value = document.getElementById("bang_value_text_field");
    if (Number(bang_value.value) >= 0) {
      var obj = {
        account: this.state.singlePlayerInfo.account,
        password: password.value,
        bang: Number(bang_value.value)
      }
      if (Number(bang_value.value) > 1000000000) {
        this.popUpNotice("notice", 0, "设置爆机值过大");
      }
      MsgEmitter.emit(SET_PROMOTER_BANG_C2S, obj, cb, [this, Number(bang_value.value), password, bang_value.value]);
    } else if (Number(bang_value.value) < 0) {
      this.popUpNotice("notice", 0, "设置的爆机值有误");
    }

  }
  // 调整金币确定按钮
  handleSetCoin = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }

    var account = this.state.singlePlayerInfo.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== EXCHANGE_PROMOTER_S2C && id !== 9778) {
        return;
      }
      var self = arg[0];
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      if (message.code === LOGIC_SUCCESS) {
        self.state.singlePlayerInfo.game_coin += arg[1];
        arg[2].value = "";
        arg[3].value = "";
        // self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      }

    }
    var your_password = document.getElementById("set_coin_your_password_text_field");
    var coin_value = document.getElementById("coin_value_text_field");
    if (isNaN(Number(coin_value.value))) {
      this.popUpNotice("notice", 0, '请输入正确数值型');
      return;
    }
    if (Number(coin_value.value) % 1 != 0) {
      this.popUpNotice("notice", 99023, Lang[window.Lang].ErrorCode[99023]);
      return;
    }
    if (Number(coin_value.value) > 0) {
      var obj = {
        "target_account": this.state.singlePlayerInfo.account,
        "your_password": your_password.value,
        "rmb": Number(coin_value.value)
      }
      if (Number(coin_value.value) > 100000) {
        this.popUpNotice("notice", 99022, Lang[window.Lang].ErrorCode[99022]);
        return;
      }
      MsgEmitter.emit(RECHARGE_PROMOTER_C2S, obj, cb, [this, Number(coin_value.value), your_password, coin_value]);
    } else if (Number(coin_value.value) < 0) {
      var game_coin = -Number(coin_value.value);
      if (game_coin > this.state.singlePlayerInfo.game_coin) {
        this.popUpNotice("notice", 99011, Lang[window.Lang].ErrorCode[99011]);
      } else {
        var obj = {
          "target_account": this.state.singlePlayerInfo.account,
          "your_password": your_password.value,
          "game_coin": game_coin
        }
        if (game_coin > 100000) {
          this.popUpNotice("notice", 99022, Lang[window.Lang].ErrorCode[99022]);
          return;
        }
        MsgEmitter.emit(EXCHANGE_PROMOTER_C2S, obj, cb, [this, Number(coin_value.value), your_password, coin_value]);
      }

    }

  }

  // 删除推广员确定按钮
  deletePromoter = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
      return;
    }

    var account = this.state.singlePlayerInfo.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === DELETE_PROMOTER_S2C) {
        var self = arg;
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        self.queryPromoter(true);
        // self.handleCloseDetail();
        if (message.code === LOGIC_SUCCESS) {
          document.getElementById("delete_your_password_text_field").value = '';
        }
      }
    }
    var your_password = document.getElementById("delete_your_password_text_field");
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "your_password": your_password.value,
    }
    MsgEmitter.emit(DELETE_PROMOTER_C2S, obj, cb, this);
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
    var your_password = document.getElementById("your_password_text_field");
    var password = document.getElementById("reset_password_text_field");
    var again_password = document.getElementById("reset_again_password_text_field");
    if (password.value !== again_password.value) {
      this.popUpNotice("notice", 10020, Lang[window.Lang].ErrorCode[10020]);
      return;
    }
    var cb = function (id, message, arg) {
      if (id === RESET_PROMOTER_S2C) {
        var self = arg;
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        if (message.code === LOGIC_SUCCESS) {
          your_password.value = '';
          password.value = '';
          again_password.value = '';
        }
      }
    }
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "your_password": your_password.value,
      "password": password.value
    }
    MsgEmitter.emit(RESET_PROMOTER_C2S, obj, cb, this);
  }

  handleUpdataAllData = (newData) => {
    // var sortData = newData.sort(function (a, b) {
    //   return b.time - a.time;
    // });
    this.state.allData = this.state.allData.concat(newData);
  }

  addNewPromoter = () => {
    this.setState({ addPromoterDialog: true })
  }
  // 选择特定某一行的数据
  handleSelection = (selectedRow) => {
    if (selectedRow !== -1) {
      this.state.selectedOne = selectedRow;
      this.state.singlePlayerInfo = this.state.data[this.state.selectedOne];
      if (this.state.singlePlayerInfo === undefined) {
        this.state.singlePlayerInfo = {};
      }
    }
    this.handleOpenDetail();
  }
  // 展开玩家信息
  handleOpenDetail = () => {
    if (this.state.selectedOne !== undefined) {
      this.setState({ promoterDetail: true });
    }
  };
  // handleOpenSetCoin = () => {
  //   this.setState({ setCoinDialog: true });
  // }


  handleHover = (row) => {
  }
  // 搜索按钮查询推广员
  queryPromoter = (reloadData = false) => {

    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
      if (id !== QUERY_PROMOTER_S2C) {
        return;
      }

      if (message.code === LOGIC_SUCCESS) {
        var result = [];
        result = message.pi;
        self.handleUpdataAllData(result);
        self.handleUpdata(self.state.currentPage);
      }
      self.setState({ count: message.count, totalPage: Util.page.getTotalPage(message.count, this.state.rowsPerPage), sum: message.sum });
    }

    var serchInput = document.getElementById("serch_text_field");
    var account = serchInput.value;
    if (reloadData) {
      // this.state.data = [];
      // this.state.allData = [];
      this.setState({ currentPage: 1, totalPage: 1, data: [], allData: [] });
    }
    if (account === "") {
      account = "$all";
    }
    var obj = {
      "account": account,
      data_length: this.state.allData.length,
      filters: JSON.stringify(this.state.filters),
      sort: JSON.stringify(this.state.sort)

      // filters:JSON.stringify(this.state.filters),
      // sort: JSON.stringify(this.state.sort)
    }
    MsgEmitter.emit(QUERY_PROMOTER_C2S, obj, cb, [this]);

  }



  handleAddPromoter = () => {
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
      return;
    }
    var obj = {
      account: account.value,
      password: password.value,
      language: 1
    }

    var cb = (id = 0, message = null, args) => {
      if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
      if (id !== REGIST_PROMOTER_S2C) {
        return;
      }
      var self = args;
      if (message.code === LOGIC_SUCCESS) {
        this.state.addPromoterDialog = false;
        var result = message.pl;
        self.handleUpdata(1);
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      self.queryPromoter(true);
      // self.handleCloseDetail();
      // self.handleUpdata(data);
    }
    MsgEmitter.emit(REGIST_PROMOTER_C2S, obj, cb, this);
  }

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
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        self.state.singlePlayerInfo.status = arg[1];
      }
    }
    var frozen, status;
    if (this.state.singlePlayerInfo.status === 0) {
      frozen = true;
      status = 1;
    } else if (this.state.singlePlayerInfo.status === 1) {
      frozen = false;
      status = 0;
    }
    var obj = {
      "target_account": this.state.singlePlayerInfo.account,
      "type": 2,
      "be_frozen": frozen
    }
    MsgEmitter.emit(FROZEN_ACCOUNT_C2S, obj, cb, [this, status]);
  }



  handleCloseDetail = () => {
    this.setState({ promoterDetail: false });
    this.setState({ addPromoterDialog: false });

  };

  // 新增推广员操作
  AddDialog = () => {
    return (<Dialog
      title={Lang[window.Lang].Promoter.AccountPage.new_account}
      actions={[<FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={this.handleAddPromoter}
      />]}
      modal={false}
      open={this.state.addPromoterDialog}
      onRequestClose={this.handleCloseDetail}
      autoScrollBodyContent={true}
    >
      <TextField
        id="add_account_text_field"
        disabled={false}
        multiLine={false}
        // type="password"
        hintText={Lang[window.Lang].Promoter.AccountPage.promoter_account}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="add_password_text_field"
        type="password"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Promoter.AccountPage.promoter_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="add_again_text_field"
        type="password"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Promoter.AccountPage.again_password}
        defaultValue=""
        fullWidth={true}
        onChange={() => {
          document.getElementById('add_again_text_field').onkeydown = (e) => {
            var ev = e || window.event;
            if (ev.keyCode === 13) {
              this.handleAddPromoter();
            }
          }
        }}
      />
      <br />
    </Dialog>)
  }

  insertMenuItem = () => {
    var table = Lang[window.Lang].Promoter.AccountPage.Table;
    var list = [];
    for (var key in table) {
      list.push(<MenuItem value={key} key={key} primaryText={table[key]} />)
    }
    return list;
  }


  insertDetail = () => {
    var table = Lang[window.Lang].Promoter.AccountPage.Table;
    var list = [];
    for (var key in table) {
      list.push(
        <ul key={key}>
          <li>
            {table[key]}: {this.state.singlePlayerInfo === {} ? "" :
              key === "time" ? Util.time.getTimeString(this.state.singleLogInfo.time) :
                key === "status" ? (this.state.singlePlayerInfo.status === 0 ? "正常" : "禁用") :
                  key === "language" ? (Lang[window.Lang].Lang[this.state.singlePlayerInfo.language]) : this.state.singleLogInfo[key]}
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
        <TextField
          id="serch_text_field"
          disabled={false}
          multiLine={false}
          hintText={Lang[window.Lang].Master.search_by_promoter}
          defaultValue=""
          style={{ float: 'left', marginRight: 10, marginTop: 5 }}
          middleWidth={true}
          onChange={() => {
            document.getElementById('serch_text_field').onkeydown = (e) => {
              var ev = e || window.event;
              if (ev.keyCode === 13) {
                this.queryPromoter(true);
              }
            }
          }}
        />
        {/*搜索以及新增推广员按钮*/}
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.raiseButton} onTouchTap={() => {
          this.queryPromoter(true)
        }} />
        <RaisedButton label={Lang[window.Lang].Promoter.AccountPage.add_button} primary={true} style={Styles.raiseButton} onTouchTap={this.addNewPromoter} />


        <div>
          <CommonTable
            table={Lang[window.Lang].Promoter.AccountPage.Table}
            data={this.state.data}
            handleGridSort={(sortColumn, sortDirection) => {
              this.state.sort = {}
              if (sortDirection === 'ASC') {
                this.state.sort[sortColumn] = 1
              } else {
                this.state.sort[sortColumn] = -1
              }
              this.queryPromoter(true);
            }}
            rowGetter={(i) => {
              if (i === -1) { return {} }
              return {
                id: this.state.data[i].id,
                account: this.state.data[i].account,
                leader: this.state.data[i].leader,
                status: [Lang[window.Lang].Administrator.AccountPage.normal, Lang[window.Lang].Administrator.AccountPage.forbidden][this.state.data[i].status],
                language: Lang[window.Lang].Lang[1],
                game_coin: this.state.data[i].game_coin,
                time: Util.time.getTimeString(this.state.data[i].time),
                isSelected: this.state.selectedOne === i,
                bang: this.state.data[i].bang === 0 ? '无上限' : this.state.data[i].bang
              }
            }}
            maxHeight={270}
            onRowClick={(rowIdx, row) => {
              this.handleSelection(rowIdx);
            }}
          />
          <div style={Styles.totalApproveAndRefuse}>
            <h5 style={Styles.fontLeftFloat}>推广员总数:{this.state.sum}</h5>
            <h5 style={Styles.fontLeftFloat}>搜索推广员总数:{this.state.count}</h5>
          </div>
          <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
          {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
          <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
          <br />
          {this.state.singlePlayerInfo.account !== undefined ?
            <Paper>
              <Tabs>
                <Tab label={Lang[window.Lang].Promoter.promoter_set}
                  onActive={() => {
                    this.setState({
                      showSelect: 'promoterSet',
                      textValue: ''
                    })
                  }}
                >
                  <div>
                    <FlatButton
                      label={Lang[window.Lang].Promoter.AccountPage.set_coin_button}
                      primary={true}
                      disabled={this.state.textValue === 'setCoin'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'setCoin'
                        })
                      }}
                    />
                    <FlatButton
                      label={Lang[window.Lang].Promoter.AccountPage.reset_pw_button}
                      primary={true}
                      disabled={this.state.textValue === 'resetPassword'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'resetPassword'
                        })
                      }}
                    />
                    {/*<FlatButton
                      label={Lang[window.Lang].Promoter.AccountPage.setBang}
                      primary={true}
                      disabled={this.state.textValue === 'resetBang'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'resetBang'
                        })
                      }}
                    />*/}
                    <FlatButton
                      label={this.state.singlePlayerInfo.status === 0 ?
                        Lang[window.Lang].Promoter.AccountPage.frozen_button :
                        Lang[window.Lang].Promoter.AccountPage.thaw_button}
                      primary={true}
                      onTouchTap={this.frozenAccount}
                    />
                    <FlatButton
                      label={Lang[window.Lang].Promoter.AccountPage.delete_button}
                      primary={true}
                      disabled={this.state.textValue === 'deletePromoter'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'deletePromoter'
                        })
                      }}
                    />
                  </div>
                </Tab>
                <Tab label={Lang[window.Lang].User.charge_history}
                  onActive={() => [
                    this.setState({
                      showSelect: 'promoterCharge',
                      textValue: 'promoterCharge'
                    })
                  ]}
                >
                  <div>
                    <FlatButton
                      label={Lang[window.Lang].User.charge_history}
                      primary={true}
                      disabled={this.state.textValue === 'promoterCharge'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterCharge'
                        })
                      }}
                    />
                    <FlatButton
                      label={Lang[window.Lang].User.exchange_history}
                      primary={true}
                      disabled={this.state.textValue === 'promoterExchange'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterExchange'
                        })
                      }}
                    />
                  </div>
                </Tab>
                <Tab label={Lang[window.Lang].User.given_history}
                  onActive={() => [
                    this.setState({
                      showSelect: 'promoterGiven',
                      textValue: 'promoterGiven'
                    })
                  ]}
                >
                  <div>
                    <FlatButton
                      label={Lang[window.Lang].User.given_history}
                      primary={true}
                      disabled={this.state.textValue === 'promoterGiven'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterGiven'
                        })
                      }}
                    />
                    <FlatButton
                      label={Lang[window.Lang].User.confiscated_history}
                      primary={true}
                      disabled={this.state.textValue === 'promoterConfiscated'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterConfiscated'
                        })
                      }}
                    />
                  </div>
                </Tab>
                <Tab label={Lang[window.Lang].Promoter.profit}
                  onActive={() => {
                    this.setState({
                      showSelect: 'promoterProfit',
                      textValue: 'promoterProfit'
                    })
                  }}
                >
                  {/*<div>
                    <FlatButton
                      label={Lang[window.Lang].Promoter.profit}
                      primary={true}
                      disabled={this.state.textValue === 'promoterProfit'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterProfit'
                        })
                      }}
                    />
                  </div>*/}
                </Tab>
                <Tab label={Lang[window.Lang].Promoter.log}
                  onActive={() => {
                    this.setState({
                      showSelect: 'promoterLog',
                      textValue: 'promoterLog'
                    })
                  }}
                >
                  {/*<div>
                    <FlatButton
                      label={Lang[window.Lang].Promoter.log}
                      primary={true}
                      disabled={this.state.textValue === 'promoterLog'}
                      onTouchTap={() => {
                        this.setState({
                          textValue: 'promoterLog'
                        })
                      }}
                    />
                  </div>*/}
                </Tab>
              </Tabs>
              <div>




              </div>

            </Paper> : ""}
          {this.AddDialog()}
          {/*{this.PromoterDialog()}
          {this.ResetDialog()}
          {this.DeleteDialog()}
          {this.SetCoinDialog()}*/}
        </div>
        {this.display()}
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

const PromoterAccount = () => (
  <div>
    <Title render={(previousTitle) => `${Lang[window.Lang].Promoter.account} - ${previousTitle}`} />
    <PageComplex />
  </div>
);

export default PromoterAccount;
export { PageComplex as accountInfo };
