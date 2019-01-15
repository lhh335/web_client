import { QUERY_HALL_C2S, CHANGE_HALL_CONFIG_C2S, ADD_HALL_CONFIG_C2S, DELETE_HALL_CONFIG_C2S, QUERY_HALL_S2C, CHANGE_HALL_CONFIG_S2C, ADD_HALL_CONFIG_S2C, DELETE_HALL_CONFIG_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Tooltip from 'material-ui/internal/Tooltip'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import HandleOpen from './HandleOpen';

const styles = {
  simple: {
    margin: 'auto 20px auto 10px'
  },
  tooltip: {
    boxSizing: 'border-box',
    marginTop: 5,
  },
};

class HallPage extends Component {

  errorMessages = {
    numericError: Lang[window.Lang].Setting.GamePage.numericError
  };


  popUpNotice = (type, code, content) => {
    this.setState({ type: type, code: code, content: content, alertOpen: true });
  }


  state = {
    data: [],
    detailOpen: false,
    showCol: "all",
    selectedOne: undefined,
    singleConfigInfo: {},
    alertOpen: false,
    changeKey: "activity_name",
    changeOpen: false,
    addOpen: false,
    deleteOpen: false,
  }

  handleQueryConfig = (reloadData) => {

    var cb = (id = 0, message = null, args) => {
      if (id !== QUERY_HALL_S2C) {
        return;
      }
      var self = args[0];
      if (message.code === LOGIC_SUCCESS) {
        var result = [];
        result = message.hi;
        if (result.length > 0) {
          result.sort(function (a, b) {
            return a.terminal * 100 + a.id > b.terminal * 100 + b.id
          })
        }
        self.setState({ data: result });
        // self.handleUpdataAllData(result);
        // self.handleUpdata(self.state.currentPage);
        // self.setState({ totalPage: message.count });
        // self.handleUpdata(1);
      }
    }
    if (reloadData) {
      this.state.data = [];
      this.state.allData = [];
      this.setState({ currentPage: 1, totalPage: 1 });
    }
    var obj = {
      // page: this.state.currentPage
    }

    MsgEmitter.emit(QUERY_HALL_C2S, obj, cb, [this]);
  }

  changeSetting = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }


    var cb = (id = 0, message = null, args) => {
      if (id !== CHANGE_HALL_CONFIG_S2C) {
        return;
      }
      var self = args;
      if (message.code === LOGIC_SUCCESS) {
        self.handleQueryConfig(true);
        self.handleCloseDialog();
        // self.handleUpdataAllData(result);
        // self.handleUpdata(self.state.currentPage);
        // self.setState({ totalPage: message.count });
        // self.handleUpdata(1);
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
    }

    var obj = {
      activity_name: document.getElementById("change_activity_name_text_field").value,
      app_protoid: document.getElementById("change_app_protoid_text_field").value,
      app_version: document.getElementById("change_app_version_text_field").value,
      download: document.getElementById("change_download_text_field").value,
      id: Number(document.getElementById("change_id_text_field").value),
      package_name: document.getElementById("change_package_name_text_field").value,
      terminal: Number(document.getElementById("change_terminal_text_field").value),
      hotupdate_url: document.getElementById("change_hotupdate_url_text_field").value,
      sort_id: document.getElementById("change_sort_id_text_field").value
      // page: this.state.currentPage
    }

    MsgEmitter.emit(CHANGE_HALL_CONFIG_C2S, obj, cb, this);
  }

  addSetting = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }

    var cb = (id = 0, message = null, args) => {
      if (id !== ADD_HALL_CONFIG_S2C) {
        return;
      }
      var self = args[0];
      if (message.code === LOGIC_SUCCESS) {
        self.handleQueryConfig(true);
        self.handleCloseDialog();
        // self.handleUpdataAllData(result);
        // self.handleUpdata(self.state.currentPage);
        // self.setState({ totalPage: message.count });
        // self.handleUpdata(1);
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);

    }
    var inputId = Number(document.getElementById("add_id_text_field").value);
    var inputTerminal = Number(document.getElementById("add_terminal_text_field").value);

    if (isNaN(inputId) || isNaN(inputTerminal)) {
      this.popUpNotice("notice", 0, Lang[window.Lang].ErrorCode[99014]);
      return;
    }
    var obj = {
      activity_name: document.getElementById("add_activity_name_text_field").value,
      app_protoid: document.getElementById("add_app_protoid_text_field").value,
      app_version: document.getElementById("add_app_version_text_field").value,
      download: document.getElementById("add_download_text_field").value,
      id: Number(document.getElementById("add_id_text_field").value),
      package_name: document.getElementById("add_package_name_text_field").value,
      terminal: Number(document.getElementById("add_terminal_text_field").value),
      hotupdate_url: document.getElementById("add_hotupdate_url_text_field").value,
      sort_id: document.getElementById("add_sort_id_text_field").value
      // page: this.state.currentPage
    }

    MsgEmitter.emit(ADD_HALL_CONFIG_C2S, obj, cb, [this]);
  }

  deleteSetting = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
    var cb = (id = 0, message = null, args) => {
      if (id !== DELETE_HALL_CONFIG_S2C) {
        return;
      }
      var self = args[0];
      if (message.code === LOGIC_SUCCESS) {
        self.handleQueryConfig(true);
        self.handleCloseDialog();
        // self.handleUpdataAllData(result);
        // self.handleUpdata(self.state.currentPage);
        // self.setState({ totalPage: message.count });
        // self.handleUpdata(1);
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
    }
    var obj = {
      id: Number(document.getElementById("change_id_text_field").value),
      terminal: Number(document.getElementById("change_terminal_text_field").value),
      // page: this.state.currentPage
    }

    MsgEmitter.emit(DELETE_HALL_CONFIG_C2S, obj, cb, [this]);
  }

  componentDidMount() {
    window.currentPage = this;
    this.handleQueryConfig(false);
  }

  refresh() {
    this.handleQueryConfig(false);
  }

  handleChange = (event, index, value) => this.setState({ changeKey: value });

  handleSelection = (selectedRow) => {
    if (selectedRow !== undefined && selectedRow.length === 1) {

      this.state.selectedOne = selectedRow[0];
      this.state.singleConfigInfo = this.state.data[this.state.selectedOne];
      if (this.state.singleConfigInfo === undefined) {
        this.state.singleConfigInfo = {};
      }
      this.handleOpenDetail();
    }
  }

  handleOpenDetail() {
    this.setState({ detailOpen: true });
  }

  handleCloseDialog = () => {
    this.setState({ detailOpen: false, changeOpen: false, addOpen: false, deleteOpen: false });
  }

  changDialogOpen() {
    var inputId = Number(document.getElementById("change_id_text_field").value);
    var inputTerminal = Number(document.getElementById("change_terminal_text_field").value);

    if (isNaN(inputId) || isNaN(inputTerminal)) {
      this.popUpNotice("notice", 0, Lang[window.Lang].ErrorCode[99014]);
      return;
    }
    this.setState({ changeOpen: true });
  }

  addDialogOpen() {
    this.setState({ addOpen: true });
  }

  deleteDialogOpen() {
    this.setState({ deleteOpen: true });
  }

  insertMenuItem = () => {
    var table = Lang[window.Lang].Setting.HallPage.Table;
    var list = [];
    for (var key in table) {
      list.push(<MenuItem value={key} key={key} primaryText={table[key]} />)
    }
    return list;
  }

  ChangeDialog = () => {
    return (<Dialog
      title={Lang[window.Lang].Setting.ServerPage.certain_setting}
      actions={[
        <FlatButton
          label={Lang[window.Lang].Master.certain_button}
          primary={true}
          onTouchTap={this.changeSetting}
        />,
      ]}
      modal={false}
      open={this.state.changeOpen}
      onRequestClose={this.handleCloseDialog}
      autoScrollBodyContent={true}
    >
      {Lang[window.Lang].Setting.HallPage.change_warning}
    </Dialog>)
  }

  AddDialog = () => {
    return (

      <Dialog
        title={Lang[window.Lang].Setting.HallPage.add_dialog_tilte}
        actions={[
          <FlatButton
            label={Lang[window.Lang].Master.add_button}
            primary={true}
            onTouchTap={this.addSetting}
          />,
          <FlatButton
            label={Lang[window.Lang].Master.cancel_button}
            primary={true}
            onTouchTap={this.handleCloseDialog}
          />
        ]}
        modal={false}
        open={this.state.addOpen}
        onRequestClose={this.handleCloseDialog}
        autoScrollBodyContent={true}
      >
        <TextField
          id={"add_terminal_text_field"}
          name={"terminal"}
          hintText={"请输入" + "terminal"}
          floatingLabelText={"terminal"}
        // defaultValue={""}
        />
        <br />
        <TextField
          id={"add_id_text_field"}
          name={"id"}
          hintText={"请输入" + "id"}
          floatingLabelText={"id"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_activity_name_text_field"}
          name={"activity_name"}
          required
          hintText={"请输入" + "activity_name"}
          floatingLabelText={"activity_name"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_app_protoid_text_field"}
          name={"app_protoid"}
          required
          hintText={"请输入" + "app_protoid"}
          floatingLabelText={"app_protoid"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_app_version_text_field"}
          name={"app_version"}
          required
          hintText={"请输入" + "app_version"}
          floatingLabelText={"app_version"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_download_text_field"}
          name={"download"}
          required
          hintText={"请输入" + "download"}
          floatingLabelText={"download"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_package_name_text_field"}
          name={"package_name"}
          required
          hintText={"请输入" + "package_name"}
          floatingLabelText={"package_name"}
        // defaultValue={"1"}
        />
        <br />
        <TextField
          id={"add_hotupdate_url_text_field"}
          name={"hotupdate_url"}
          required
          hintText={"请输入" + "hotupdate_url"}
          floatingLabelText={"hotupdate_url"}
        // defaultValue={"1"}
        />
        <TextField
          id={"add_sort_id_text_field"}
          name={"sort_id"}
          required
          hintText={"请输入" + "sort_id"}
          floatingLabelText={"sort_id"}
        // defaultValue={"1"}
        />
        <br />
      </Dialog>
    )
  }

  DeleteDialog = () => {
    return (<Dialog
      title={Lang[window.Lang].Setting.HallPage.delete_dialog_tilte}
      actions={[
        <FlatButton
          label={Lang[window.Lang].Master.certain_button}
          primary={true}
          onTouchTap={this.deleteSetting}
        />
      ]}
      modal={false}
      open={this.state.deleteOpen}
      onRequestClose={this.handleCloseDialog}
      autoScrollBodyContent={true}
    >
      {Lang[window.Lang].Setting.HallPage.delete_warning}
    </Dialog>)
  }

  DetailDialog = () => {
    return (
      <Dialog
        title={Lang[window.Lang].Setting.HallPage.change_dialog_tilte}
        actions={[
          <FlatButton
            label={Lang[window.Lang].Master.certain_button}
            primary={true}
            onTouchTap={() => { this.changDialogOpen() }}
          />,
          <FlatButton
            label={Lang[window.Lang].Master.delete_button}
            primary={true}
            onTouchTap={() => { this.deleteDialogOpen() }}
          />
        ]}
        modal={false}
        open={this.state.detailOpen}
        onRequestClose={this.handleCloseDialog}
        autoScrollBodyContent={true}
      >
        <TextField
          id={"change_terminal_text_field"}
          name={"terminal"}
          hintText={"请输入" + "terminal"}
          floatingLabelText={"terminal"}
          defaultValue={this.state.singleConfigInfo.terminal}
        />
        <br />
        <TextField
          id={"change_id_text_field"}
          name={"id"}
          hintText={"请输入" + "id"}
          floatingLabelText={"id"}
          defaultValue={this.state.singleConfigInfo.id}
        />
        <br />
        <TextField
          id={"change_activity_name_text_field"}
          name={"activity_name"}
          required
          hintText={"请输入" + "activity_name"}
          floatingLabelText={"activity_name"}
          defaultValue={this.state.singleConfigInfo.activity_name}
        />
        <br />
        <TextField
          id={"change_app_protoid_text_field"}
          name={"app_protoid"}
          required
          hintText={"请输入" + "app_protoid"}
          floatingLabelText={"app_protoid"}
          defaultValue={this.state.singleConfigInfo.app_protoid}
        />
        <br />
        <TextField
          id={"change_app_version_text_field"}
          name={"app_version"}
          required
          hintText={"请输入" + "app_version"}
          floatingLabelText={"app_version"}
          defaultValue={this.state.singleConfigInfo.app_version}
        />
        <br />
        <TextField
          id={"change_download_text_field"}
          name={"download"}
          required
          hintText={"请输入" + "download"}
          floatingLabelText={"download"}
          defaultValue={this.state.singleConfigInfo.download}
        />
        <br />
        <TextField
          id={"change_package_name_text_field"}
          name={"package_name"}
          required
          hintText={"请输入" + "package_name"}
          floatingLabelText={"package_name"}
          defaultValue={this.state.singleConfigInfo.package_name}
        />
        <br />
        <TextField
          id={"change_hotupdate_url_text_field"}
          name={"hotupdate_url"}
          required
          hintText={"请输入" + "hotupdate_url"}
          floatingLabelText={"hotupdate_url"}
          defaultValue={this.state.singleConfigInfo.hotupdate_url}
        />
        <br />
        <TextField
          id={"change_sort_id_text_field"}
          name={"sort_id"}
          required
          hintText={"请输入" + "sort_id"}
          floatingLabelText={"sort_id"}
          defaultValue={this.state.singleConfigInfo.sort_id}
        />
        <br />
      </Dialog>
    )
  }

  render() {
    return (
      <div>
        {/**
        <HandleOpen />
        
        <SelectField
          value={this.state.changeKey}

          // floatingLabelText={Lang[window.Lang].User.ExchangePage.sort_ways}
          // value={this.state.sortWay}
          onChange={this.handleChange}
          >
          {this.insertMenuItem()}
        </SelectField>
        <TextField
          id="change_text_field"
          disabled={false}
          multiLine={false}
          hintText={Lang[window.Lang].User.AccountPage.search_by_account}
          defaultValue=""

          />
        */}
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={true}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.handleSelection}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            {
              this.state.showCol === "all" ?
                <TableRow>
                  <TableHeaderColumn colSpan="16" tooltip={Lang[window.Lang].User.AccountPage.table_title} style={{ textAlign: 'center' }}>
                    {Lang[window.Lang].User.AccountPage.table_title}
                  </TableHeaderColumn>
                </TableRow> :
                ""
            }
            {
              this.state.showCol === "all" ?
                <TableRow>
                  <TableHeaderColumn colSpan="1" tooltip={Lang[window.Lang].Setting.HallPage.Table.terminal}>{Lang[window.Lang].Setting.HallPage.Table.terminal}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="1" tooltip={Lang[window.Lang].Setting.HallPage.Table.id}>{Lang[window.Lang].Setting.HallPage.Table.id}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="3" tooltip={Lang[window.Lang].Setting.HallPage.Table.activity_name}>{Lang[window.Lang].Setting.HallPage.Table.activity_name}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="1" tooltip={Lang[window.Lang].Setting.HallPage.Table.app_protoid}>{Lang[window.Lang].Setting.HallPage.Table.app_protoid}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="1" tooltip={Lang[window.Lang].Setting.HallPage.Table.app_version}>{Lang[window.Lang].Setting.HallPage.Table.app_version}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="3" tooltip={Lang[window.Lang].Setting.HallPage.Table.download}>{Lang[window.Lang].Setting.HallPage.Table.download}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="2" tooltip={Lang[window.Lang].Setting.HallPage.Table.package_name}>{Lang[window.Lang].Setting.HallPage.Table.package_name}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="3" tooltip={Lang[window.Lang].Setting.HallPage.Table.hotupdate_url}>{Lang[window.Lang].Setting.HallPage.Table.hotupdate_url}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="1" tooltip={Lang[window.Lang].Setting.HallPage.Table.sort_id}>{Lang[window.Lang].Setting.HallPage.Table.sort_id}</TableHeaderColumn>
                </TableRow>
                : <TableRow>
                  <TableHeaderColumn colSpan="7" tooltip={Lang[window.Lang].Setting.HallPage.Table.activity_name}>{Lang[window.Lang].Setting.HallPage.Table.activity_name}</TableHeaderColumn>
                  <TableHeaderColumn colSpan="5" tooltip={Lang[window.Lang].Setting.HallPage.Table[this.state.showCol]}>{Lang[window.Lang].Setting.HallPage.Table[this.state.showCol]}</TableHeaderColumn>
                </TableRow>
            }
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway={this.state.deselectOnClickaway}
            preScanRows={this.state.preScanRows}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.data.map((row, index) => (
              this.state.showCol === "all" ?
                <TableRow key={index} selected={row.selected}>
                  <TableRowColumn colSpan="1" >{row.terminal}</TableRowColumn>
                  <TableRowColumn colSpan="1" >
                    {row.id}
                  </TableRowColumn>
                  <TableRowColumn colSpan="3" >
                    {row.activity_name}
                  </TableRowColumn>
                  <TableRowColumn colSpan="1" >
                    {row.app_protoid}
                  </TableRowColumn>
                  <TableRowColumn colSpan="1" >{row.app_version}</TableRowColumn>
                  <TableRowColumn colSpan="3" >
                    {row.download}
                  </TableRowColumn>
                  <TableRowColumn colSpan="2" >{row.package_name}</TableRowColumn>
                  <TableRowColumn colSpan="3" >{row.hotupdate_url}</TableRowColumn>
                  <TableRowColumn colSpan="1" >{row.sort_id}</TableRowColumn>
                </TableRow>
                :
                <TableRow key={index} selected={row.selected} onRowClick={this.handleRowClick}>
                  <TableRowColumn colSpan="7">{row.activity_name}</TableRowColumn>
                  <TableRowColumn colSpan="5">{row[this.state.showCol]}</TableRowColumn>
                </TableRow>
            ))}
          </TableBody>

        </Table>
        <RaisedButton label={Lang[window.Lang].Master.add_button} primary={true} style={styles.simple} onMouseUp={() => { this.addDialogOpen() }} />
        {
          // <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={styles.simple} onMouseUp={this.showPre} />
          // {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
          // <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={styles.simple} onMouseUp={this.showNext} />
          // <br />
        }
        {this.DetailDialog()}
        {this.ChangeDialog()}
        {this.AddDialog()}
        {this.DeleteDialog()}
        < CommonAlert
          show={this.state.alertOpen}
          type="notice"
          code={this.state.code}
          content={this.state.content}
          handleCertainClose={() => {
            this.setState({ alertOpen: false });
          }}
          handleCancelClose={() => {
            this.setState({ alertOpen: false })
          }}>
        </CommonAlert>
      </div >
    )
  }

}

const SettingHall = () => (
  <div>
    <Title render={(previousTitle) => `${Lang[window.Lang].Setting.hall} - 超级管理员后台`} />
    <HallPage />

  </div>
);

export default SettingHall;