import { QUERY_RETURN_STREAM_C2S, QUERY_RETURN_STREAM_S2C, } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import SelectField from 'angon_selectedfield';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import Util from '../../../../util';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import protobuf from 'protobufjs';

import ReactDataGrid from 'angon_react_data_grid';
import { accountInfo } from '../Account/Page';



class TableExampleComplex extends Component {
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
      currentPage: 1,
      rowsPerPage: 4,
      totalPage: 1,
      minDate: minDate,
      maxDate: maxDate,
      allData: [],
      data: [],
      alertOpen: false,
      alertType: "notice",
      alertCode: 0,
      alertContent: "",
      scoreDetail: false,
      selectedOne: undefined,
      singleLogInfo: {},
      selectedCoin: 2,
      selectedError: true,
      sort: { _id: -1 },
      onloading: false,
      count: 0
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
    if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
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

    var account = this.props.player;
    if (account === "") {
      this.state.onloading = false;
      this.popUpNotice("notice", 99007, Lang[window.Lang].ErrorCode[99007]);
      return;
    }

    var minDate = this.state.minDate.getTime();
    var maxDate = this.state.maxDate.getTime();
    if (minDate > maxDate) {
      this.state.onloading = false;
      this.popUpNotice("notice", ERROR_SELECTED_TIME, Lang[window.Lang].ErrorCode[ERROR_SELECTED_TIME]);
      return;
    }

    if (maxDate > Util.time.getTimeStamp()) {
      maxDate = Util.time.getTimeStamp()
    }
    var SearchObj = {
    }

    var obj = {
      account: account,
      search: JSON.stringify(SearchObj),
      sort: JSON.stringify(this.state.sort),
      data_length: this.state.allData.length,
      from: minDate,
      to: maxDate,
    }
    var cb = (id = 0, message = null, args) => {
      var self = args[0];
      self.state.onloading = false;
      if (id !== QUERY_RETURN_STREAM_S2C) {
        return;
      }
      
      self.state.count = message.count;
      var result = message.rsi;
      if (message.code === LOGIC_SUCCESS) {
        self.state.totalPage = Util.page.getTotalPage(message.count, this.state.rowsPerPage);
        self.handleUpdataAllData(result);
        self.handleUpdata(self.state.currentPage);
      }
      self.setState({ totalPage: Util.page.getTotalPage(message.count, this.state.rowsPerPage) });
      if (result.length > 0 && args[1] === true) {
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      } else if (result.length === 0) {
        self.popUpNotice("notice", 99009, Lang[window.Lang].ErrorCode[99009]);
      }
    }
    MsgEmitter.emit(QUERY_RETURN_STREAM_C2S, obj, cb, [this, notice]);

  }

  componentDidUpdate() {

  }

  componentDidMount() {
    // window.currentPage = this;
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
      return parseInt(b.time) - parseInt(a.time);
    });
    this.state.allData = this.state.allData.concat(newData);
  }

  handleSelection = (selectedRow) => {
    if (selectedRow !== undefined && selectedRow.length === 1) {

      this.state.selectedOne = selectedRow[0];
      this.state.singleLogInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleLogInfo === undefined) {
        this.state.singleLogInfo = {};
      }
      this.handleOpenDetail()
    }
  }

  handleOpenDetail = () => {
    this.setState({ scoreDetail: true });
  };

  handleCloseDetail = () => {
    this.setState({ scoreDetail: false });
  };

  handleChange = (event, index, value) => this.setState({ showCol: value, selectedMenu: value });
  handleChangeCoin = (event, index, value) => this.setState({ selectedCoin: value });
  handleSearch = (event, index, value) => this.setState({ selectedError: value });

  /*LogDialog = () => {
    return (<Dialog
      modal={false}
      open={this.state.scoreDetail}

      onRequestClose={this.handleCloseDetail}
      autoScrollBodyContent={true}
    >
      {this.insertDetail().map((key) => (key))}

    </Dialog>)
  }*/

  insertMenuItem = () => {
    var table = Lang[window.Lang].User.ScorePage.Table;
    var list = [];
    for (var key in table) {
      list.push(<MenuItem value={key} key={key} primaryText={table[key]} />)
    }
    return list;
  }

  /*insertDetail = () => {
    var table = Lang[window.Lang].User.ScorePage.Table;
    let row = this.state.singleLogInfo;
    var list = [];
    for (var key in table) {
      list.push(
        <ul key={key}>
          <li>
            {table[key]}: {this.state.singleLogInfo === {} ? "" :
              key === "flag" ? (row.flag === 1 ? (Lang[window.Lang].User.ScorePage.add + row.change_score) : (Lang[window.Lang].User.ScorePage.reduce + row.change_score)) :
                key === "operation" ? Lang[window.Lang].User.ScorePage.action[row.operation] :
                  key === "game_name" ? Lang[window.Lang].Setting.GamePage[row.game].game_name :
                    key === "room" && Lang[window.Lang].Setting.GamePage[this.state.singleLogInfo.game] !== undefined ? Lang[window.Lang].Setting.GamePage[this.state.singleLogInfo.game].room[row.room] :
                      key === "time" ? Util.time.getTimeString(parseInt(this.state.singleLogInfo.time) / 1000) : this.state.singleLogInfo[key]}
            <br />
          </li>
        </ul>
      )
    }
    return list;
  }*/

  render() {
    return (
      <div>
        <Divider />
        <div style={Styles.normalFloat}>
          <TimeSelector
            callbackMinDateFuction={this.handleChangeMinDate}
            callbackMinTimeFuction={this.handleChangeMinTime}
            callbackMaxDateFuction={this.handleChangeMaxDate}
            callbackMaxTimeFuction={this.handleChangeMaxTime}
          />
        </div>
        {/* 
        <SelectField
          // floatingLabelText={Lang[window.Lang].User.AccountPage.sort_ways}
          value={this.state.selectedCoin}
          onChange={this.handleChangeCoin}
          style={Styles.selecteField}
          shortWidth={true}

        >
          <MenuItem value={1} key={"taste_coin"} primaryText={Lang[window.Lang].User.ScorePage.taste_coin} />
          <MenuItem value={2} key={"game_coin"} primaryText={Lang[window.Lang].User.ScorePage.game_coin} />
        </SelectField>
        <SelectField
          shortWidth={true}
          value={this.state.selectedError}
          onChange={this.handleSearch}
          style={Styles.selecteField}

        >
          <MenuItem value={true} key={"error_stream"} primaryText={Lang[window.Lang].User.CoinPage.error_stream} />
          <MenuItem value={false} key={"all_stream"} primaryText={Lang[window.Lang].User.CoinPage.all_stream} />
        </SelectField> */}
        <RaisedButton
          label={Lang[window.Lang].Master.search_button}
          primary={true} style={Styles.coinSearch}
          onTouchTap={
            () => {
              this.state.data = [];
              this.state.allData = [];
              this.setState({ currentPage: 1, totalPage: 1 });
              this.getPageData(1, true)
            }
          } />

        <ReactDataGrid
          rowKey="id"
          columns={[
            {
              key: 'total_return_coin',
              name: Lang[window.Lang].User.ReturnPage.Table.total_return_coin.name,
              resizable: true
            },
            {
              key: 'add_return_coin',
              name: Lang[window.Lang].User.ReturnPage.Table.add_return_coin.name,
              resizable: true
            },
            {
              key: 'subordinate_id',
              name: Lang[window.Lang].User.ReturnPage.Table.subordinate_id.name,
              resizable: true
            },
            {
              key: 'subordinate',
              name: Lang[window.Lang].User.ReturnPage.Table.subordinate.name,
              resizable: true
            },
            {
              key: 'source',
              name: Lang[window.Lang].User.ReturnPage.Table.source.name,
              resizable: true
            },

            {
              key: 'game',
              name: Lang[window.Lang].User.ReturnPage.Table.game.name,
              resizable: true
            },
            {
              key: 'room',
              name: Lang[window.Lang].User.ReturnPage.Table.room.name,
              resizable: true
            },
            {
              key: 'desk',
              name: Lang[window.Lang].User.ReturnPage.Table.desk.name,
              resizable: true
            },
            {
              key: 'time',
              name: Lang[window.Lang].User.ReturnPage.Table.time.name,
              resizable: true
            }
          ]}
          rowGetter={(i) => {
            if (i === -1) { return {} }
            return {
              total_return_coin: Number(this.state.data[i].total_return_coin).toFixed(2),
              add_return_coin: this.state.data[i].add_return_coin,
              subordinate_id: this.state.data[i].subordinate_id,
              subordinate: this.state.data[i].subordinate,
              source: Lang[window.Lang].User.ScorePage.action[this.state.data[i].source],
              game: Lang[window.Lang].Setting.GamePage[this.state.data[i].game] === undefined ? "未知游戏" : Lang[window.Lang].Setting.GamePage[this.state.data[i].game].game_name,
              room: Lang[window.Lang].Setting.GamePage[this.state.data[i].game] === undefined ? "未知游戏" : Lang[window.Lang].Setting.GamePage[this.state.data[i].game].room[this.state.data[i].room],
              desk: this.state.data[i].desk,
              time: Util.time.getTimeString(this.state.data[i].time)
              // vertify: this.state.data[i].vertify === 0 ? "正确" : "有误"
            }
          }}
          rowsCount={this.state.data.length}
          minHeight={170}
          rowHeight={30}
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
class ReturnLog extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].User.score} - ${previousTitle}`} />
        <TableExampleComplex player={this.props.player} />
      </div>
    )
  }
}
export default ReturnLog;