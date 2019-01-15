import { QUERY_PROMOTER_C2S, PROMOTER_TO_RECHARGE_C2S, PROMOTER_TO_EXCHANGE_C2S, PROMOTER_TO_RECHARGE_S2C, PROMOTER_TO_EXCHANGE_S2C, QUERY_PROMOTER_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
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
import Paper from 'material-ui/Paper';

const styles = {
    simple: {
        margin: 'auto 20px auto 10px'
    }
};

class PageComplex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            promoterData: {},
            operateWay: 1,
            alertOpen: false,
            alertType: "notice",
            alertCode: 0,
            alertContent: "",
            passwordDialog: false,
            selectPromoter: sessionStorage.accountType === "1" ? sessionStorage.account : "$all",
            selectedOne: undefined,
            selectedMenu: "operation"
        };
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    handleChange = (event, index, value) => {
        this.setState({ operateWay: value });
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
        this.refresh();
    }

    refresh() {
        var data = [];
        var cb = (id = 0, message = null) => {
            if (id !== QUERY_PROMOTER_S2C) {
                return;
            }
            if (message.code === LOGIC_SUCCESS) {
                data = message.pi;

                this.setState({ promoterData: data[0] });

            }

        }

        var account = sessionStorage.account;

        var obj = {
            "account": account,
            data_length: 0
        }
        MsgEmitter.emit(QUERY_PROMOTER_C2S, obj, cb, []);
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
                onTouchTap={this.submit}
            />]}
            modal={false}
            open={this.state.passwordDialog}
            onRequestClose={this.handleClosePasswordDialog}
            autoScrollBodyContent={true}
        >

        </Dialog>)
    }

    render() {
        return (
            <div>
                <ul>
                    <li>
                        您的账号: {sessionStorage.account}
                        <br />
                    </li>
                </ul>
                <ul>
                    <li>
                        您当前游戏币: {this.state.promoterData.game_coin}
                        <br />
                    </li>
                </ul>
                <ul>
                    <li>
                        您的上级: {this.state.promoterData.leader}
                        <br />
                    </li>
                </ul>
                <SelectField
                    value={this.state.operateWay}
                    onChange={this.handleChange}
                    style={styles.simple}
                >
                    <MenuItem value={1} primaryText="充值" />
                    <MenuItem value={2} primaryText="兑换" />
                </SelectField>
                <br />
                <TextField
                    id="game_coin_text_field"
                    disabled={false}
                    multiLine={false}
                    hintText={"金额"}
                    defaultValue=""
                    style={styles.simple}
                    onChange={
                        (event) => {
                            if (this.state.operateWay === 2 && Number(event.target.value) > this.state.promoterData.game_coin) {
                                event.target.value = this.state.promoterData.game_coin;
                            }
                        }
                    }
                    fullWidth={true}
                />
                <br />
                <TextField
                    id="promoter_password_text_field"
                    disabled={false}
                    multiLine={false}
                    type="password"
                    hintText={Lang[window.Lang].Master.you + Lang[window.Lang].User.ChargePage.promoter_pw_back}
                    defaultValue=''
                    style={styles.simple}
                    fullWidth={true}
                />
                <br />
                <RaisedButton label={"提交"} primary={true} style={styles.simple} onMouseUp={() => {
                    if (window.socket === undefined || window.socket.readyState !== 1) {
                        this.popUpNotice("notice", 99008, Lang[window.Lang].ErrorCode[99008]);
                        return;
                    }

                    var data = [];
                    var cb = (id = 0, message = null, arg) => {

                        var self = arg[0];
                        if (message.code === LOGIC_SUCCESS) {
                            if (id === PROMOTER_TO_RECHARGE_S2C) {

                            }
                            if (id === PROMOTER_TO_EXCHANGE_S2C) {
                                self.state.game_coin - arg[1];
                            }
                        }
                        self.popUpNotice("notice", message.code, "您的申請已提交，请您耐心等待。");

                    }

                    var account = sessionStorage.account;

                    var password = document.getElementById("promoter_password_text_field").value;
                    var valueInput = document.getElementById("game_coin_text_field").value;
                    var value = Number.parseInt(valueInput);
                    if (!Number.isSafeInteger(value)) {
                        return;
                    }

                    switch (this.state.operateWay) {
                        case 1:
                            var obj = {
                                "account": account,
                                "password": password,
                                "rmb": Number(value)
                            }
                            MsgEmitter.emit(PROMOTER_TO_RECHARGE_C2S, obj, cb, [this, value]);
                            break;
                        case 2:
                            if (this.state.game_coin - value < 0) {
                                this.popUpNotice("notice", 0, "您的金币不足");
                            }
                            var obj = {
                                "account": account,
                                "password": password,
                                "game_coin": Number(value)
                            }
                            MsgEmitter.emit(PROMOTER_TO_EXCHANGE_C2S, obj, cb, [this, value]);
                            break;
                    }
                }} />

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

const Operation = () => (
    <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Coin.operation} - ${previousTitle}`} />
        <PageComplex />
    </div>
);

export default Operation;

