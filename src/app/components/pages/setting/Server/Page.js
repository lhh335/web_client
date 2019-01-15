import { QUERY_SERVER_ARGS_CONFIG_C2S, CHANGE_SERVER_ARGS_CONFIG_C2S, ADD_SERVER_ARGS_CONFIG_C2S, DELETE_SERVER_ARGS_CONFIG_C2S, QUERY_SERVER_ARGS_CONFIG_S2C, CHANGE_SERVER_ARGS_CONFIG_S2C, ADD_SERVER_ARGS_CONFIG_S2C, DELETE_SERVER_ARGS_CONFIG_S2C, } from "../../../../proto_enum";
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
import Util from '../../../../util';
import QRCode from 'qrcode-generator';

const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    },
    tooltip: {
        boxSizing: 'border-box',
        marginTop: 5,
    },
};

class ServerPage extends Component {

    state = {
        data: [],
        detailOpen: false,
        showCol: "all",
        selectedOne: undefined,
        singleConfigInfo: {},
        alertOpen: false,
        changeOpen: false,
        addOpen: false,
        deleteOpen: false,

        selectedKey: "",
        changeType: "key",
        new_key: "",
        new_value: "",
        old_key: "",
        old_value: "",
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    hanldeFocus = (event, value) => {
        var selectedId = event.target.id;
        let list = selectedId.split(":");
        this.state.selectedKey = list[0];
        this.state.old_key = document.getElementById(this.state.selectedKey + ":key").value;
        this.state.old_value = document.getElementById(this.state.selectedKey + ":value").value;
        this.state.new_key = document.getElementById(this.state.selectedKey + ":key").value;
        this.state.new_value = document.getElementById(this.state.selectedKey + ":value").value;
        this.state.changeType = list[1];
    }

    changeKey = (event, newKey) => {
        this.state.new_key = newKey;
    }

    changeValue = (event, newValue) => {
        this.state.new_value = newValue;
    }

    handleChangeValue = () => {
    }

    handleQueryConfig = (reloadData) => {
        var cb = (id = 0, message = null, args) => {
            if (id !== QUERY_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                var result = [];
                result = message.sai;

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

        MsgEmitter.emit(QUERY_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    changeSetting = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== CHANGE_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
            self.handleQueryConfig(true);
            // var self = args[0];
            // if (message.code === LOGIC_SUCCESS) {
            //     var result = [];
            //     result = message.sai;
            //     self.setState({ data: message.sai });
            //     // self.handleUpdataAllData(result);
            //     // self.handleUpdata(self.state.currentPage);
            //     // self.setState({ totalPage: message.count });
            //     // self.handleUpdata(1);
            // }
        }

        var obj = {
            target_key: this.state.selectedKey,
            new_key: this.state.new_key,
            new_value: this.state.new_value
        }
        this.handleCloseDialog();
        MsgEmitter.emit(CHANGE_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    addSetting = (reloadData) => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== ADD_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                self.handleQueryConfig(true);
                // self.handleUpdataAllData(result);
                // self.handleUpdata(self.state.currentPage);
                // self.setState({ totalPage: message.count });
                // self.handleUpdata(1);
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = {
            new_key: document.getElementById("add_key_text_field").value,
            new_value: document.getElementById("add_value_text_field").value,
            new_type: document.getElementById("add_type_text_field").value

            // page: this.state.currentPage
        }

        MsgEmitter.emit(ADD_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    deleteSetting = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) { this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]); return; }
        var cb = (id = 0, message = null, args) => {
            if (id !== DELETE_SERVER_ARGS_CONFIG_S2C) {
                return;
            }
            var self = args[0];
            if (message.code === LOGIC_SUCCESS) {
                self.handleQueryConfig(true);
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = {
            target_key: this.state.selectedKey,
            // page: this.state.currentPage
        }
        this.handleCloseDialog();
        MsgEmitter.emit(DELETE_SERVER_ARGS_CONFIG_C2S, obj, cb, [this]);
    }

    componentDidMount() {
        window.currentPage = this;
        this.handleQueryConfig(false);
    }

    refresh() {
        this.handleQueryConfig(false);
    }
    // handleChange = (event, index, value) => this.setState({ : value });

    handleSelection = (selectedRow) => {
        if (selectedRow !== undefined && selectedRow.length === 1) {
            this.state.selectedOne = selectedRow[0];
            this.state.singleConfigInfo = JSON.parse(this.state.data[this.state.selectedOne]);

            this.state.selectedKey = Util.text.unicode_to_string(this.state.singleConfigInfo["key"]);
            this.state.old_key = Util.text.unicode_to_string(this.state.singleConfigInfo["key"]);
            this.state.old_value = Util.text.unicode_to_string(this.state.singleConfigInfo["value"]);
            this.state.new_key = Util.text.unicode_to_string(this.state.singleConfigInfo["key"]);
            this.state.new_value = Util.text.unicode_to_string(this.state.singleConfigInfo["value"]);
            if (this.state.singleConfigInfo === undefined) {
                this.state.singleConfigInfo = {};
            }
            this.handleOpenDetail();
        }
    }

    resetChange() {
        // document.getElementById(this.state.selectedKey + ":key").value = this.state.old_key;
        // document.getElementById(this.state.selectedKey + ":value").value = this.state.old_value;
        this.state.old_key = this.state.old_value = this.state.new_key = this.state.new_value = "";
    }

    handleOpenDetail() {
        this.setState({ detailOpen: true });
    }

    handleCloseDialog = () => {
        this.setState({ detailOpen: false, changeOpen: false, addOpen: false, deleteOpen: false });
    }

    changDialogOpen() {
        if (this.state.old_key === this.state.new_key && this.state.old_value === this.state.new_value) {
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

    insertDetail = () => {
        var table = Lang[window.Lang].Setting.HallPage.Table;
        var list = [];
        for (var key in table) {
            list.push(
                <ul key={key}>
                    <li>
                        {table[key]}:
                        <TextField
                            id={key}
                            disabled={false}
                            multiLine={false}
                            // hintText={this.state.singleConfigInfo === {} ? "" :
                            //   this.state.singleConfigInfo[key]}
                            defaultValue={this.state.singleConfigInfo === {} ? "" :
                                this.state.singleConfigInfo[key]}
                            fullWidth={true}
                        />
                        <br />
                    </li>
                </ul>
            )
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
                <FlatButton
                    label={Lang[window.Lang].Master.cancel_button}
                    primary={true}
                    onTouchTap={
                        () => {
                            this.resetChange()
                            this.handleCloseDialog()
                        }}
                />
            ]}
            modal={false}
            open={this.state.changeOpen}
            // onRequestClose={this.handleCloseDialog}
            autoScrollBodyContent={true}
        >
            {Lang[window.Lang].Setting.ServerPage.change_warning
                + "\r\n" + (this.state.changeType === "key" ?
                    "将" + this.state.old_key + "改为" + this.state.new_key :
                    "将" + this.state.old_value + "改为" + this.state.new_value)}
        </Dialog>)
    }

    AddDialog = () => {
        return (<Dialog
            title={Lang[window.Lang].Setting.ServerPage.add_dialog_tilte}
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
            {Lang[window.Lang].Setting.ServerPage.add_warning}
            <br />
            <TextField
                id="add_key_text_field"
                disabled={false}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.ServerPage.add_new_key}
                defaultValue=""
                fullWidth={true}
            >
            </TextField>
            <br />
            <TextField
                id="add_value_text_field"
                disabled={false}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.ServerPage.add_new_value}
                defaultValue=""
                fullWidth={true}
            >
            </TextField>
            <br />
            <TextField
                id="add_type_text_field"
                disabled={false}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.ServerPage.add_new_type}
                defaultValue=""
                fullWidth={true}
            >
            </TextField>
        </Dialog>)
    }

    DetailDialog = () => {

        return (<Dialog
            title={Lang[window.Lang].Setting.ServerPage.change_dialog_tilte}
            actions={[

                <FlatButton
                    label={Lang[window.Lang].Master.certain_button}
                    primary={true}
                    onTouchTap={() => { this.changDialogOpen() }}
                />,
                <FlatButton
                    label={Lang[window.Lang].Master.cancel_button}
                    primary={true}
                    onTouchTap={this.handleCloseDialog}
                />
            ]}
            modal={false}
            open={this.state.detailOpen}
            onRequestClose={this.handleCloseDialog}
            autoScrollBodyContent={true}
        >
            {Lang[window.Lang].Setting.ServerPage.change_warning}
            <br />
            <TextField
                id={Util.text.unicode_to_string(this.state.singleConfigInfo.key) + ":key"}
                disabled={false}
                underlineShow={false}
                fullWidth={true}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.ServerPage.Table.k}
                // onFocus={this.hanldeFocus}
                onChange={this.changeKey}
                // onBlur={(event) => { this.changDialogOpen() } }
                defaultValue={Util.text.unicode_to_string(this.state.singleConfigInfo.key)}
            />
            <br />
            <TextField
                id={Util.text.unicode_to_string(this.state.singleConfigInfo.key) + ":value"}
                disabled={false}
                underlineShow={false}
                fullWidth={true}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.ServerPage.Table.v}
                // onFocus={this.hanldeFocus}
                onChange={this.changeValue}
                // onBlur={(event) => { this.changDialogOpen() } }
                defaultValue={Util.text.unicode_to_string(this.state.singleConfigInfo.value)}
            />

        </Dialog>)
    }

    DeleteDialog = () => {
        return (<Dialog
            title={Lang[window.Lang].Setting.ServerPage.delete_dialog_tilte}
            actions={[
                <FlatButton
                    label={Lang[window.Lang].Master.certain_button}
                    primary={true}
                    onTouchTap={this.deleteSetting}
                />,
                <FlatButton
                    label={Lang[window.Lang].Master.cancel_button}
                    primary={true}
                    onTouchTap={this.handleCloseDialog}
                />
            ]}
            modal={false}
            open={this.state.deleteOpen}
            // onRequestClose={this.handleCloseDialog}
            autoScrollBodyContent={true}
        >
            {Lang[window.Lang].Setting.ServerPage.delete_warning}
        </Dialog>)
    }

    render() {
        return (
            <div>
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
                        <TableRow>
                            <TableHeaderColumn colSpan="11" tooltip={Lang[window.Lang].Setting.ServerPage.table_title} style={{ textAlign: 'center' }}>
                                {Lang[window.Lang].User.AccountPage.table_title}
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn colSpan="3" tooltip={Lang[window.Lang].Setting.ServerPage.Table.k}>{Lang[window.Lang].Setting.ServerPage.Table.k}</TableHeaderColumn>
                            <TableHeaderColumn colSpan="5" tooltip={Lang[window.Lang].Setting.ServerPage.Table.v}>{Lang[window.Lang].Setting.ServerPage.Table.v}</TableHeaderColumn>
                            <TableHeaderColumn colSpan="3" tooltip={Lang[window.Lang].Master.actions}>{Lang[window.Lang].Master.actions}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={this.state.deselectOnClickaway}
                        preScanRows={this.state.preScanRows}
                        showRowHover={this.state.showRowHover}
                        stripedRows={this.state.stripedRows}
                    >
                        {this.state.data.map((jsonRow, index) => {
                            var row = JSON.parse(jsonRow);
                            return (
                                <TableRow key={index} selected={row.selected}>
                                    <TableRowColumn colSpan="3" >
                                        {Util.text.unicode_to_string(row.key)}
                                        {
                                            // <TextField
                                            //     id={Util.text.unicode_to_string(row.key) + ":key"}
                                            //     disabled={false}
                                            //     underlineShow={false}
                                            //     fullWidth={true}
                                            //     multiLine={false}
                                            //     hintText={Lang[window.Lang].Setting.ServerPage.Table.k}
                                            //     onFocus={this.hanldeFocus}
                                            //     onChange={this.changeKey}
                                            //     onBlur={(event) => { this.changDialogOpen() } }
                                            //     defaultValue={Util.text.unicode_to_string(row.key)}
                                            //     />
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn colSpan="5" >
                                        {
                                            Util.text.unicode_to_string(row.value)
                                            // <TextField
                                            //     id={Util.text.unicode_to_string(row.key) + ":value"}
                                            //     disabled={false}
                                            //     underlineShow={false}
                                            //     fullWidth={true}
                                            //     multiLine={false}
                                            //     hintText={Lang[window.Lang].Setting.ServerPage.Table.v}
                                            //     onFocus={this.hanldeFocus}
                                            //     onChange={this.changeValue}
                                            //     onBlur={(event) => { this.changDialogOpen() } }
                                            //     defaultValue={Util.text.unicode_to_string(row.value)}
                                            //     />
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn colSpan="3" >
                                        <FlatButton label={Lang[window.Lang].Master.delete_button} primary={true} style={styles.simple} onMouseUp={() => {
                                            this.state.selectedKey = Util.text.unicode_to_string(row.key);
                                            this.deleteDialogOpen()
                                        }} />
                                    </TableRowColumn>
                                </TableRow>)
                        })}
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
                <CommonAlert
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

const SettingServer = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Setting.server} - 超级管理员后台`} />
        <ServerPage />

    </div>
);

export default SettingServer;