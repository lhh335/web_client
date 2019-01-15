import { GET_DESK_DF_C2S, SET_DESK_DF_C2S, GET_DESK_DF_S2C, SET_DESK_DF_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Title from 'react-title-component';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
    from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';


const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class SettingDf extends Component {
    state = {
        gameID: 11,
        data: [],
        roomsItem: [],
        room: 1,
        detailOpen: false,
        alertOpen: false,
        selectedOne: undefined,
        singleDeskInfo: {},
        fixValue: 1,
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    handleChangeRoom = (event, index, value) => {
        this.setState({ room: value })
    }


    handleChange = (event, index, value) => {
        this.setState({
            gameID: value
        })
    }

    handleOpenDetail() {
        this.setState({ detailOpen: true });
    }

    handleCloseDetail() {
        this.setState({ detailOpen: false });
    }

    get_dfs = () => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        var cb = function (id, message, arg) {
            if (id !== GET_DESK_DF_S2C) {
                return;
            }
            var self = arg;

            if (message.code === LOGIC_SUCCESS) {
                self.setState({ data: message.dfi });
            }
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        }

        var obj = {
            game: parseInt(this.state.gameID),
            room: this.state.room
            // "language": language
        };

        MsgEmitter.emit(GET_DESK_DF_C2S, obj, cb, this);
    }

    set_dfs = (data) => {
        if (window.socket === undefined || window.socket.readyState !== 1) {
            this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
            return;
        }

        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].id === data.id) {
                this.state.data[i].value = data.value;
                break;
            }
        }
        var cb = function (id, message, arg) {
            if (id !== SET_DESK_DF_S2C) {
                return;
            }
            var self = arg;
            self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
            if (message.code === LOGIC_SUCCESS) {
            }
        }

        var obj = {
            game: parseInt(this.state.gameID),
            room: this.state.room,
            dfi: this.state.data
            // "language": language
        };
        MsgEmitter.emit(SET_DESK_DF_C2S, obj, cb, this);
    }

    handleSelection = (selectedRow) => {
        if (selectedRow !== undefined && selectedRow.length === 1) {

            this.state.selectedOne = selectedRow[0];
            this.setState({ singleDeskInfo: this.state.data[this.state.selectedOne] })
            if (this.state.singleDeskInfo === undefined) {
                this.state.selectedOne === undefined;
                this.state.singleDeskInfo = {};
            }
            this.handleOpenDetail();
        }

    }

    DetailDialog = () => {

        return (<Dialog
            title={Lang[window.Lang].Setting.ServerPage.change_dialog_tilte}
            actions={[

                <FlatButton
                    label={Lang[window.Lang].Master.certain_button}
                    primary={true}
                    onTouchTap={() => {
                        this.setState({
                            detailOpen: false
                        })
                        var Message = {
                            id: this.state.singleDeskInfo.id,
                            value: parseFloat(document.getElementById("df" + this.state.singleDeskInfo.id).value)
                        };
                        this.set_dfs(Message)
                    }}
                />,
                <FlatButton
                    label={Lang[window.Lang].Master.cancel_button}
                    primary={true}
                    onTouchTap={() => { this.handleCloseDetail() }}
                />
            ]}
            modal={false}
            open={this.state.detailOpen}
            onRequestClose={() => { this.handleCloseDetail() }}
            autoScrollBodyContent={true}
        >
            <TextField
                id={"df" + this.state.singleDeskInfo.id}
                disabled={false}
                underlineShow={false}
                fullWidth={true}
                multiLine={false}
                hintText={Lang[window.Lang].Setting.GamePage["11"].game_df[this.state.singleDeskInfo.id]}
                // onFocus={this.hanldeFocus}
                // onBlur={(event) => { this.changDialogOpen() } }
                defaultValue={this.state.singleDeskInfo.value}
            />

        </Dialog>)
    }

    render() {
        return (
            <div>
                <Title render={() => `${Lang[window.Lang].Setting.game} - 超级管理员后台`} />
                <p style={{ float: 'left', marginRight: 10, fontSize: 16, marginTop: 15 }}> 选择游戏:</p>
                <SelectField
                    value={this.state.gameID}

                    // floatingLabelText={Lang[window.Lang].User.ExchangePage.sort_ways}
                    // value={this.state.sortWay}
                    onChange={this.handleChange}
                >
                    <MenuItem value={11} primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} />
                    <MenuItem value={12} primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} />
                    <MenuItem value={14} primaryText={Lang[window.Lang].Setting.GamePage["14"].game_name} />
                    <MenuItem value={15} primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} />
                </SelectField>
                <br />
                <p style={{ float: 'left', marginRight: 10, fontSize: 16, marginTop: 15 }}>选择房间:</p>
                <SelectField
                    value={this.state.room}

                    // floatingLabelText={Lang[windo    .Lang].User.ExchangePage.sort_ways}
                    // value={this.state.sortWay}
                    onChange={this.handleChangeRoom}
                >
                    <MenuItem value={1} primaryText={Lang[window.Lang].Setting.GamePage["11"].room["1"]} />
                    <MenuItem value={2} primaryText={Lang[window.Lang].Setting.GamePage["12"].room["2"]} />
                </SelectField>
                <br />
                <RaisedButton label={Lang[window.Lang].Master.search_button} primary={true} style={styles.simple} onTouchTap={this.get_dfs} />
                {/*<RaisedButton label={Lang[window.Lang].Master.modify_button} primary={true} style={styles.simple} onTouchTap={() => { this.handleOpenDetail() }} />*/}
                <Table
                    height={'260px'}
                    fixedHeader={true}
                    fixedFooter={true}
                    selectable={true}
                    onRowSelection={this.handleSelection}
                    multiSelectable={false}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn colSpan="5" tooltip={Lang[window.Lang].Setting.DfPage.game_df}>{Lang[window.Lang].Setting.DfPage.game_df}</TableHeaderColumn>
                            <TableHeaderColumn colSpan="5" tooltip={Lang[window.Lang].Setting.DfPage.df_coefficient}>{Lang[window.Lang].Setting.DfPage.df_coefficient}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        deselectOnClickaway={true}
                        preScanRows={true}
                        showRowHover={false}
                        stripedRows={true}
                    >
                        {this.state.data.map((row, index) => (
                            <TableRow key={index} selectable={true}>
                                <TableRowColumn colSpan="5">
                                    {Lang[window.Lang].Setting.GamePage["11"].game_df[row.id]}
                                </TableRowColumn>
                                <TableRowColumn colSpan="5">
                                    {row.value}
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {this.DetailDialog()}
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
            </div>
        );
    }

}



export default SettingDf;
