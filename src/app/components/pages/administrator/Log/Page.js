import { QUERY_ADMIN_LOG_C2S, QUERY_ADMIN_LOG_S2C, SET_HALL_NOTICE_C2S } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS } from "../../../../ecode_enum";
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
import FlatButton from 'material-ui/FlatButton';
import ReactDataGrid from 'angon_react_data_grid';

import { Row } from 'angon_react_data_grid';
import Paper from 'material-ui/Paper';

import Util from '../../../../util';
import OperateCodeUtil from '../../../../OperateCodeUtil';

import MsgEmitter from '../../../../MsgEmitter';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';
import Protos from '../../../../proto_map.json';

import protobuf from 'protobufjs';
import areIntlLocalesSupported from 'intl-locales-supported';
import { accountInfo } from '../Account/Page';

const ProtosActions = {
  "config": {
    desk: "桌子配置",
    game: "游戏配置",
    hall: "大厅配置",
  },
  "user": {
    login: "登录操作",
    query: "查询操作",
    register: "增加操作",
    remove: "删除操作",
    modify: "修改操作",
  },
  "trade": {
    player_recharge: "玩家充值",
    player_exchange: "玩家兑换",
    promoter_recharge: "推广员充值",
    promoter_exchange: "推广员兑换"
  },
  mosaic: {

  }

}




class TableExampleComplex extends Component {
  static PropTypes = {
    admin: PropTypes.object
  }
  static defaultProps = {
    admin: {}
  }

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
      preScanRows: false,
      height: '510px',
      allData: [],
      data: [],
      selectType: "all",
      selectProto: "all",
      protoItems: [],
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      logDetail: false,
      selectedOne: undefined,
      singleLogInfo: {},
      selectedMenu: "flag",
      serchInput: '',
      onloading: false,
      count: 0
    };
  }
  // 点击上一页以及下一页的更新操作
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
      this.getPageData(this.state.currentPage);
    } else {
      this.state.onloading = false;
      var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
      this.setState({ data: data });
    }
  }
  // 点击上一页的触发操作
  showPre = () => {
    this.handleUpdata(this.state.currentPage - 1);
    // this.getPageData(this.state.currentPage);
  }

  showNext = () => {
    if (this.state.onloading === true) {
      return
    } else {
      this.handleUpdata(this.state.currentPage + 1);
    }
  }
  // 管理员日志搜索按钮
  getPageData = (page, notice = false) => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.state.onloading = false;
      return;
    }
    var account = this.props.admin.account || this.state.serchInput;
    if (account === "") {
      account = "$all"
      //   this.state.onloading = false;
      //   this.popUpNotice("notice", 99007, Lang[window.Lang].ErrorCode[99007]);
      //   return;
    }

    var minDate = this.state.minDate.getTime() / 1000;
    var maxDate = this.state.maxDate.getTime() / 1000;
    if (minDate > maxDate) {
      this.state.onloading = false;
      this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
      return;
    }



    var SearchObj = {
      time: {
        "$gte": minDate, "$lte": maxDate
      }
    }
    switch (this.state.selectProto) {
      case "all":
        var minProto = 0;
        var maxProto = 10000;
        switch (this.state.selectType) {
          case "user":
            minProto = 9900;
            break;
          case "config":
            minProto = 9800;
            maxProto = 9900;
            break;
          case "trade":
            minProto = 9700;
            maxProto = 9800;
            break;
          case "mosaic":
            minProto = 9400;
            maxProto = 9500;
            break;
          default:
            minProto = 0;
            maxProto = 10000;
        }
        Object.assign(SearchObj, {
          proto_id: {
            "$gte": minProto, "$lte": maxProto
          }
        })
        break;
      case "login":
        SearchObj.proto_id = [9953, 9957, 9977, 9978, 9985];
        break;
      case "query":
        SearchObj.proto_id = [9901, 9925, 9927, 9931, 9933, 9955, 9959, 9961, 9961, 9973, 9994];
        break;
      case "register":
        SearchObj.proto_id = [9951, 9963];
        break;
      case "remove":
        SearchObj.proto_id = [9929, 9939, 9965, 9967];
        break;
      case "modify":
        SearchObj.proto_id = [9921, 9923, 9935, 9937, 9941, 9969, 9971];
        break;
      case "hall":
        SearchObj.proto_id = [9801, 9803, 9805, 9807, 9809, 9811, 9813, 9815, 9825, 9827,
          9845, 9847, 9849, 9863, 9865, 9866]
        break;
      case "game":
        SearchObj.proto_id = [9829, 9831, 9833, 9835, 9859, 9861]
        break;
      case "desk":
        SearchObj.proto_id = [9817, 9819, 9820, 9821, 9823, 9839, 9840, 9843, 9851, 9853, 9855, 9857, 9894, 9896]
        break;
      case "player_recharge":
        SearchObj.proto_id = [9705, 9709, 9713, 9717, 9721, 9729, 9731]
        break;
      case "player_exchange":
        SearchObj.proto_id = [9707, 9711, 9715, 9719, 9723, 9730, 9733]
        break;
      case "promoter_recharge":
        SearchObj.proto_id = [9743, 9747, 9777, 9781, 9785, 9789]
        break;
      case "promoter_exchange":
        SearchObj.proto_id = [9745, 9749, 9779, 9783, 9787, 9791]
        break;
      default:

    }


    var obj = {
      account: account,
      search: JSON.stringify(SearchObj),
      data_length: this.state.allData.length
    }

    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_ADMIN_LOG_S2C) {
        return;
      }
      console.log(message);
      var result = [];
      self.state.count = message.count;
      if (message.code === LOGIC_SUCCESS) {
        result = message.wl;
        self.state.totalPage = Util.page.getTotalPage(message.count);
        self.handleUpdataAllData(result);
        self.handleUpdata(self.state.currentPage);
        self.setState({ totalPage: Util.page.getTotalPage(message.count) });
      }
      if (result.length > 0 && args[1] === true) {
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      } else if (result.length === 0) {
        self.popUpNotice("notice", message.code, "该管理员还没有日志");
      }
    }
    MsgEmitter.emit(QUERY_ADMIN_LOG_C2S, obj, cb, [this, notice]);
  }


  handleChangeData = () => {

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

  // 通告提示
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
  // 选择的那一行的信息
  handleSelection = (selectedRow) => {
    if (selectedRow !== -1) {
      this.state.selectedOne = selectedRow;
      this.state.singleLogInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleLogInfo === undefined) {
        this.state.singleLogInfo = {};
      }

    }
    this.handleOpenDetail()
  }
  //展开选择的日志信息
  handleOpenDetail = () => {
    if (this.state.selectedOne !== undefined) {
      this.setState({ logDetail: true });
    }
  };

  handleCloseDetail = () => {
    this.setState({ logDetail: false });
  };


  handleChange = (event, index, value) => this.setState({ showCol: value, selectedMenu: value });

  handleChangeSearchWay = (event, index, value) => {
    this.setState({ selectType: value, selectProto: "all" });
    this.loadProto(value);
  };

  handleChangeSearchProto = (event, index, value) => this.setState({ selectProto: value });

  LogDialog = () => {
    return (
      <Paper style={{ marginTop: 30, paddingTop: 10, paddingBottom: 10 }}>
        {/*{this.insertDetail().map((key) => (key))}*/}
      </Paper>)
  }

  insertMenuItem = () => {
    var table = Lang[window.Lang].Administrator.LogPage.Table;
    var list = [];
    for (var key in table) {
      list.push(<MenuItem value={key} key={key} primaryText={table[key]} />)
    }
    return list;
  }

  /*insertDetail = () => {
    var table = Lang[window.Lang].Administrator.LogPage.Table;
    var list = [];
    for (var key in table) {
      list.push(
        <ul key={key}>
          <li>
            {table[key]}: {this.state.singleLogInfo === {} ? "" :
              key === "proto_name" ? this.state.singleLogInfo.proto_id === 9407 ? this.makeMosaicLog(this.state.singleLogInfo.proto_args) : this.makeLog(this.state.singleLogInfo) :
                key === "flag" ? (this.state.singleLogInfo.flag === 0 ? Lang[window.Lang].Master.action_success : Lang[window.Lang].ErrorCode[this.state.singleLogInfo.flag]) :
                  key === "time" ? Util.time.getTimeString(this.state.singleLogInfo.time) : this.state.singleLogInfo[key]}
            <br />
          </li>
        </ul>
      )
      if (this.state.singleLogInfo.proto_id === 9820 && key === "proto_name") {
        var changeList = this.getDeskChange(this.state.singleLogInfo.proto_args);
        if (changeList.length === 0) {
          continue;
        } else {
          list.push(
            <ul key={"changes"}>
              <li>
                {"修改内容"}:
                <ul>
                  {changeList.map((key) => (key))}
                </ul>
                <br />
              </li>
            </ul>
          )
        }
      }
      if (this.state.singleLogInfo.proto_id === 9803 && key === "proto_name") {
        var changeList = this.getHallChange(this.state.singleLogInfo.proto_args);
        if (changeList.length === 0) {
          continue;
        } else {
          list.push(
            <ul key={"changes"}>
              <li>
                {"修改内容"}:
                <ul>
                  {changeList.map((key) => (key))}
                </ul>
                <br />
              </li>
            </ul>
          )
        }
      }
      if ((this.state.singleLogInfo.proto_id === 9811 || this.state.singleLogInfo.proto_id === 9813 || this.state.singleLogInfo.proto_id === 9815) && key === "proto_name") {
        var changeList = this.getServerArgChange(this.state.singleLogInfo.proto_args);
        if (changeList.length === 0) {
          continue;
        } else {
          list.push(
            <ul key={"changes"}>
              <li>
                {"修改内容"}:
                <ul>
                  {changeList.map((key) => (key))}
                </ul>
                <br />
              </li>
            </ul>
          )
        }
      }
    }
    return list;
  }*/

  /*getHallChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var list = [];
    var hallConfig = Lang[window.Lang].Setting.HallPage.HallConfig;
    for (var key in hallConfig) {
      if (changesObj[key][0] !== changesObj[key][1]) {
        var oldValue = Util.text.unicode_to_string(changesObj[key][0]);
        var newValue = Util.text.unicode_to_string(changesObj[key][1]);
        list.push(
          <li key={key}>
            {hallConfig[key]}: {oldValue} 改为 {newValue}
          </li>
        )
      }
    }
    return list;
  }*/

  /*getServerArgChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var new_key = Util.text.unicode_to_string(changesObj.key);
    var target_key = Util.text.unicode_to_string(changesObj.target_key);
    var new_value = Util.text.unicode_to_string(changesObj.value);
    return (
      [<li key={"args"}>
        {target_key + "改为:" + "{" + new_key + ":" + new_value + "}"}
      </li>]);
  }*/

  /*getDeskChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var list = [];
    var deskConfig = Lang[window.Lang].Setting.GamePage[changesObj["game"]].DeskConfig;
    for (var key in deskConfig) {
      if (key === "consume") {
        if (changesObj[key][0][0] !== changesObj[key][1][0]) {
          list.push(
            <li key={"consume_min"}>
              {deskConfig[key]["consume_min"]}: {changesObj[key][0][0]} 改为 {changesObj[key][1][0]}
            </li>
          )
        }
        if (changesObj[key][0][1] !== changesObj[key][1][1]) {
          list.push(
            <li key={"consume_max"}>
              {deskConfig[key]["consume_max"]}: {changesObj[key][0][1]} 改为 {changesObj[key][1][1]}
            </li>
          )
        }
      } else if (key === "name") {
        if (changesObj[key][0] !== changesObj[key][1]) {
          var oldName = Util.text.unicode_to_string(changesObj[key][0]);
          var newName = Util.text.unicode_to_string(changesObj[key][1]);
          list.push(
            <li key={key}>
              {deskConfig[key]}: {oldName} 改为 {newName}
            </li>
          )
        }
      } else {
        if (changesObj[key][0] !== changesObj[key][1]) {
          list.push(
            <li key={key}>
              {deskConfig[key]}: {changesObj[key][0]} 改为 {changesObj[key][1]}
            </li>
          )
        }
      }
    }
    return list;
  }*/
  getHallChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    var hallConfig = Lang[window.Lang].Setting.HallPage.HallConfig;
    for (var key in hallConfig) {
      if (changesObj[key][0] !== changesObj[key][1]) {
        var oldValue = Util.text.unicode_to_string(changesObj[key][0]);
        var newValue = Util.text.unicode_to_string(changesObj[key][1]);
        content += hallConfig[key] + ":" + oldValue + "改为" + newValue + ';'
      }
    }
    return content;
  }
  getServerArgChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var new_key = Util.text.unicode_to_string(changesObj.key);
    var target_key = Util.text.unicode_to_string(changesObj.target_key);
    var new_value = Util.text.unicode_to_string(changesObj.value);
    return (
      target_key + "改为:" + "{" + new_key + ":" + new_value + "}"
    );
  }
  getLionDeskChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    var deskConfig = Lang[window.Lang].Setting.GamePage[changesObj["game"]].DeskConfig;
    for (var key in deskConfig) {
      if (key === "animal_rate_type" || key === "animal_rate_table_type" || key === "hall_type" || key === "zhx_game_df" || key === "game_df") {
        if (changesObj[key] === undefined || changesObj[key].length !== 2) {

        } else if (changesObj[key][0] !== changesObj[key][1]) {
          content += deskConfig[key] + ":" + Lang[window.Lang].Setting.GamePage[14][key][changesObj[key][0]] + "改为" + Lang[window.Lang].Setting.GamePage[14][key][changesObj[key][1]] + ';'
        }
      } else if (key === "name") {
        if (changesObj[key].length === 2) {
          var oldName = Util.text.unicode_to_string(changesObj[key][0]);
          var newName = Util.text.unicode_to_string(changesObj[key][1]);
          if (oldName !== newName) {
            content += deskConfig[key] + ":" + oldName + "改为" + newName + ';'
          }
        }

      } else if (key === 'zhx_min_max_stake') {
        if (changesObj[key][0][1][2] !== changesObj[key][1][1][2]) {
          content += deskConfig[key]['min'] + ":" + changesObj[key][0][1][2] + "改为" + changesObj[key][1][1][2] + ";"
        } if (changesObj[key][0][1][3] !== changesObj[key][1][1][3]) {
          content += deskConfig[key]['max']['bank_play'] + ":" + changesObj[key][0][1][3] + "改为" + changesObj[key][1][1][3] + ";"
        } if (changesObj[key][0][2][3] !== changesObj[key][1][2][3]) {
          content += deskConfig[key]['max']['tie'] + ':' + changesObj[key][0][2][3] + "改为" + changesObj[key][1][2][3] + ";"
        }
      } else {
        if (changesObj[key][0] !== changesObj[key][1]) {
          content += deskConfig[key] + ":" + changesObj[key][0] + "改为" + changesObj[key][1] + ';'
        }
      }
    }
    return content;
  }
  getPlayInfoChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var userInfo = Lang[window.Lang].User.Info;
    var content = '';
    for (var key in userInfo) {
      if (key === 'name' || key === 'recommend' || key === 'mobile_phone') {
        if (changesObj[key].length === 2) {
          var oldName = Util.text.unicode_to_string(changesObj[key][0]);
          var newName = Util.text.unicode_to_string(changesObj[key][1]);
          if (oldName !== newName) {
            content += userInfo[key] + ":" + oldName + "改为" + newName + ';'
          }
        }
      } else if (key === 'sex') {
        if (changesObj[key][0] !== changesObj[key][1]) {
          content += "性别:" + userInfo[key][changesObj[key][0]] + "改为" + userInfo[key][changesObj[key][1]] + ';'
        }
      } else {
        if (changesObj[key][0] !== changesObj[key][1]) {
          content += userInfo[key] + ":" + changesObj[key][0] + "改为" + changesObj[key][1] + ';'
        }
      }
    }
    return content;
  }

  getDeskChange = (changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    var deskConfig = Lang[window.Lang].Setting.GamePage[changesObj["game"]].DeskConfig;
    for (var key in deskConfig) {
      if (key === "consume") {
        if (changesObj[key][0][0] !== changesObj[key][1][0]) {
          content += deskConfig[key]["consume_min"] + ':' + changesObj[key][0][0] + '改为' + changesObj[key][1][0] + ';'
        }
        if (changesObj[key][0][1] !== changesObj[key][1][1]) {
          content += deskConfig[key]["consume_max"] + ":" + changesObj[key][0][1] + "改为" + changesObj[key][1][1] + ';'
        }
      } else if (key === "name") {
        if (changesObj[key].length === 2) {
          var oldName = Util.text.unicode_to_string(changesObj[key][0]);
          var newName = Util.text.unicode_to_string(changesObj[key][1]);
          if (oldName !== newName) {
            content += deskConfig[key] + ":" + oldName + "改为" + newName + ';'
          }
        }
        // if (changesObj[key][0].length === changesObj[key][1].length) {
        //   for (var j = 0; j < changesObj[key][0].length; j++) {
        //     if (changesObj[key][0][j] !== changesObj[key][1][j]) {
        //       var oldName = Util.text.unicode_to_string(changesObj[key][0]);
        //       var newName = Util.text.unicode_to_string(changesObj[key][1]);
        //       content += deskConfig[key] + ":" + oldName + "改为" + newName + ';'
        //     }
        //   }
        // } else {
        //   var oldName = Util.text.unicode_to_string(changesObj[key][0]);
        //   var newName = Util.text.unicode_to_string(changesObj[key][1]);
        //   content += deskConfig[key] + ":" + oldName + "改为" + newName + ';'
        // }
      } else {
        if (changesObj[key][0] !== changesObj[key][1]) {
          content += deskConfig[key] + ":" + changesObj[key][0] + "改为" + changesObj[key][1] + ';'
        }
      }
    }
    return content;
  }

  getLoginIp = (changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    if (changesObj['ip']) {
      content = '登录Ip:' + changesObj.ip;
    }
    return content;
  }

  deleteAndAddServerChannel = (proto_id, changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    var addKey = '';
    var addValue = '';
    for (var key in changesObj) {
      if (key === 'key') {
        addKey = Util.text.unicode_to_string(changesObj[key]);
      }
      if (key === 'value') {
        addValue = Util.text.unicode_to_string(changesObj[key]);
      }
      if (addKey !== '' && addValue !== '') {
        content += ((proto_id === 9835 ? '删除参数:' : '增加参数:') + addKey + ':' + addValue);
      }
    }
    return content;
  }

  changeServerChannel = (changes) => {
    var changesObj = JSON.parse(changes);
    var content = '';
    if (changesObj['key'] !== undefined && changesObj['target_key'] !== undefined && changesObj['key'].length > 0 && changesObj['target_key'].length > 0) {
      var key = Util.text.unicode_to_string(changesObj['key']);
      var target_key = Util.text.unicode_to_string(changesObj['target_key']);
      if (changesObj['value'] !== undefined && changesObj['value'].length > 1) {
        var oldValue = Util.text.unicode_to_string(changesObj['value'][0]);
        var newValue = Util.text.unicode_to_string(changesObj['value'][1]);
      }
      content += ('修改参数:' + target_key + '=' + oldValue + '改为' + key + '=' + newValue);
    }
    return content;
  }
  makeMosaicLog = (args) => {
    var item = JSON.parse(args);
    var result = OperateCodeUtil.operateDetail(item);
    return result;
  }
  makeMosaicFlag = (args) => {
    var item = JSON.parse(args);
    return OperateCodeUtil.operateResult(item);
  }

  insertCellFloating = (row) => {
    var title = '';
    if (row.proto_id === 9821) {
      title = this.getDeskChange(row.proto_args);
    }
    if (row.proto_id === 9840) {
      title = this.getLionDeskChange(row.proto_args);
    }
    if (row.proto_id === 9921) {
      title = this.getPlayInfoChange(row.proto_args);
    }
    if (row.proto_id === 9803) {
      title = this.getHallChange(row.proto_args);
    }
    if ((row.proto_id === 9811 || row.proto_id === 9813 || row.proto_id === 9815)) {
      title = this.getServerArgChange(row.proto_args);
    }
    if (row.proto_id === 9957) {
      title = this.getLoginIp(row.proto_args);
    }
    if (row.proto_id === 9833) {
      title = this.deleteAndAddServerChannel(row.proto_id, row.proto_args);
    }
    if (row.proto_id === 9835) {
      title = this.deleteAndAddServerChannel(row.proto_id, row.proto_args);
    }
    if (row.proto_id === 9831) {
      title = this.changeServerChannel(row.proto_args);
    }
    return title;
  }
  makeLog = (row) => {
    if (row.proto_args === undefined && row.proto_name === undefined) {
      return;
    }
    var logString;
    var logArray = [];
    var differentTip;
    var proto_args;
    if (row.proto_args !== "") {
      proto_args = JSON.parse(row.proto_args);
      if (proto_args !== undefined && proto_args.tip !== undefined) {
        differentTip = proto_args.tip;
      }
    }
    if (logString = Lang[window.Lang].LogMap[Protos[Protos.head[Math.floor(row.proto_id / 100)]][row.proto_id]]) {
      if (differentTip === undefined) {
        if (typeof logString === "string") {
          logString = Lang[window.Lang].LogMap[Protos[Protos.head[Math.floor(row.proto_id / 100)]][row.proto_id]];
        } else {
          Lang[window.Lang].LogMap[Protos[Protos.head[Math.floor(row.proto_id / 100)]][row.proto_id]][1];
        }
      } else {
        logString = Lang[window.Lang].LogMap[Protos[Protos.head[Math.floor(row.proto_id / 100)]][row.proto_id]][differentTip];
      }
      if (proto_args !== undefined) {
        for (var key in proto_args) {
          if (key === "game" || key === "type" || key === "state") {
            logString = logString.replace("$" + key, Lang[window.Lang].LogMap["$" + key][proto_args[key]]);
          } else if (key === "action") {
            if (proto_args[key] === true) {
              logString = logString.replace("$" + key, Lang[window.Lang].LogMap["$" + key]["frozen"]);
            } else {
              logString = logString.replace("$" + key, Lang[window.Lang].LogMap["$" + key]["flow"]);
            }
          } else if (key !== "tip") {
            if (row.proto_id === SET_HALL_NOTICE_C2S) {
              logString = logString.replace("$" + key, Util.text.unicode_to_string(proto_args[key]));
            } else {
              logString = logString.replace("$" + key, proto_args[key]);
            }
          }
        }
      }
    } else {
      logString = row.proto_id + Lang[window.Lang].LogMap.undefined_proto
    }

    logArray.push(logString.replace("$admin", "管理员所属"));
    var insertCellFloating = this.insertCellFloating(row);
    if (insertCellFloating !== '') {
      logArray.push(insertCellFloating);
    }
    return logArray;
  }


  loadProto(index) {
    this.state.protoItems = [];
    for (let i in ProtosActions[index]) {
      this.state.protoItems.push(<MenuItem value={i} key={i} primaryText={ProtosActions[index][i]} />);
    }
  };

  render() {
    var {
      admin
    } = this.props;
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

        {admin.account === undefined ?
          <TextField
            middleWidth={true}

            id="serch_text_field"
            disabled={false}
            multiLine={false}
            hintText={Lang[window.Lang].Master.search_by_account}
            defaultValue=""
            style={Styles.selecteField}
            onChange={(event, value) => {
              this.setState({
                serchInput: value,
                logDetail: false
              })
              document.getElementById('serch_text_field').onkeydown = (e) => {
                var ev = e || window.event;
                if (ev.keyCode === 13) {
                  this.state.data = [];
                  this.state.allData = [];
                  this.setState({ currentPage: 1, totalPage: 1 });
                  this.getPageData(1, true);
                }
              }
            }}
          /> : ''
        }
        <SelectField
          value={this.state.selectType}
          onChange={this.handleChangeSearchWay}
          style={Styles.selecteField}
          middleWidth={true}
        >
          <MenuItem value={"all"} key={"all"}
            primaryText={Lang[window.Lang].User.LogPage.search_all_log} />
          <MenuItem value={"user"} key={"user"}
            primaryText={Lang[window.Lang].User.LogPage.search_user_log} />
          <MenuItem value={"config"} key={"config"}
            primaryText={Lang[window.Lang].User.LogPage.search_config_log} />
          <MenuItem value={"trade"} key={"trade"}
            primaryText={Lang[window.Lang].User.LogPage.search_trade_log} />
          <MenuItem value={"mosaic"} key={"mosaic"}
            primaryText={Lang[window.Lang].User.LogPage.search_mosaic_log} />
        </SelectField>
        <SelectField
          value={this.state.selectProto}
          onChange={this.handleChangeSearchProto}
          style={Styles.selecteField}
          middleWidth={true}
        >
          <MenuItem value={"all"} key={"all"}
            primaryText={Lang[window.Lang].User.LogPage.search_all_log} />
          {
            this.state.protoItems
          }
        </SelectField>
        <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={Styles.coinSearch} onTouchTap={
          () => {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1 });
            this.getPageData(1, true);
          }
        } />


        <ReactDataGrid
          rowKey="id"
          columns={[
            {
              key: 'account',
              name: Lang[window.Lang].Administrator.LogPage.Table.account,
              resizable: true
            },
            {
              key: 'proto_name',
              name: Lang[window.Lang].Administrator.LogPage.Table.proto_name,
              resizable: true
            },
            {
              key: 'flag',
              name: Lang[window.Lang].Administrator.LogPage.Table.flag,
              resizable: false,
              width: 240
            },
            {
              key: 'time',
              name: Lang[window.Lang].Administrator.LogPage.Table.time,
              resizable: true
            }

          ]}
          rowGetter={(i) => {
            if (i === -1) { return {} }
            return {
              account: this.state.data[i].account,
              proto_name: this.state.data[i].proto_id === 9407 ? this.makeMosaicLog(this.state.data[i].proto_args) : this.makeLog(this.state.data[i]),
              flag: this.state.data[i].proto_id === 9407 ? this.makeMosaicFlag(this.state.data[i].proto_args) : this.state.data[i].flag === 0 ? Lang[window.Lang].Master.action_success : Lang[window.Lang].ErrorCode[this.state.data[i].flag],
              time: Util.time.getTimeString(this.state.data[i].time)

            }
          }}
          rowHeight={30}
          rowsCount={this.state.data.length}
          minHeight={330}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
          onRowClick={(rowIdx, row) => {
            this.handleSelection(rowIdx);
          }}
          onGridKeyDown={(e) => {
            if (e.ctrlKey && e.keyCode === 65) {
              e.preventDefault();

              let rows = [];
              this.state.data.forEach((r) => {
                rows.push(Object.assign({}, r, { isSelected: true }));
              });

              this.setState({ rows });
            }
          }}
        />
        <div style={Styles.fontLeftFloat}>
          <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showPre} />
          {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
          < FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton} onMouseUp={this.showNext} />
        </div>

        <br />
        {/*{(this.state.logDetail && admin.account === undefined) ?
          this.LogDialog() : ""
        }*/}
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

class AdminLog extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {sessionStorage.accountType === '0' ?
          <Title render={(previousTitle) => `${Lang[window.Lang].Administrator.log} - ${previousTitle}`} /> :
          <Title render={(previousTitle) => `${Lang[window.Lang].Administrator.log} - 超级管理员后台`} />
        }
        <TableExampleComplex admin={this.props.admin} />
      </div>
    )
  }
}
export default AdminLog;