import { QUERY_RELATION_C2S, QUERY_RELATION_S2C } from "../../../../proto_enum";
import { ERROR_SELECTED_TIME, LOGIC_SUCCESS, ERROR_ACCOUNT_NOT_EXIST, ERROR_HAVE_NO_MORE_PAGES } from "../../../../ecode_enum";
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

class PageComplex extends Component {
    static PropTypes = {
        player: PropTypes.object
    }

    static defaultProps = {
        player: {}
    }

    constructor(props) {
        super(props);

        this.state = {
            player: {},
            higherups: 1,
            subordinate: [],
            return_coin: 0
        };
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
    }

    componentDidMount() {
        this.getPlayerRelation(this.state.player.id, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.player.id !== prevProps.player.id) {
            this.getPlayerRelation(this.state.player.id, false);
        }
        // this.getPlayerRelation(this.state.player.id, false);
    }

    getPlayerRelation = (accountID, notice = false) => {
        var cb = (id, message, arg) => {
            if (id != QUERY_RELATION_S2C) {
                return;
            }
            var self = arg[0];
            if (message.code === LOGIC_SUCCESS) {
                self.setState({
                    higherups: message.ri.higherups,
                    subordinate: message.ri.subordinate,
                    return_coin: message.ri.return_coin
                })
            } else if (message.code === ERROR_ACCOUNT_NOT_EXIST) {
                self.setState({
                    higherups: -1,
                    subordinate: [],
                    return_coin: 0
                })
            }
            if (arg[1] === true) {
                self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
            }
        }
        var obj = {
            id: accountID
        }
        MsgEmitter.emit(QUERY_RELATION_C2S, obj, cb, [this, notice]);
    }

    render() {
        var {
          player
        } = this.props;
        if (this.state.player.id != player.id) {
            this.state.player = player;
        }
        return (
            <div>
                <Paper style={{ padding: 20 }}>
                    <h5 style={{ display: 'inline', marginRight: 30 }}>当前玩家ID:{this.state.player.id}</h5>
                    <h5 style={{ display: 'inline' }}>当前玩家账号:{this.state.player.account}</h5>
                    <h5>玩家上级:{this.state.higherups < 0 ? '无上级' : <FlatButton label={this.state.higherups} onTouchTap={() => {
                        window.currentPage.state.search_way = "id"
                        document.getElementById("serch_text_field").value = this.state.higherups
                        window.currentPage.queryInputPlayer(true);
                    }} />}</h5>
                    <h5>玩家下级:
                    {this.state.subordinate.length === 0 ? '无下级' : this.state.subordinate.map((playerID, i) => {
                            return (
                                <FlatButton key={i} label={playerID} onTouchTap={() => {
                                    window.currentPage.state.search_way = "id"
                                    document.getElementById("serch_text_field").value = playerID
                                    window.currentPage.queryInputPlayer(true);
                                }} />
                            )
                        })}</h5>
                    <h5>未提取返利:  {(this.state.return_coin).toFixed(2)}</h5>
                </Paper>
            </div>
        );
    }
}

class PlayerRelation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Title render={(previousTitle) => `${Lang[window.Lang].User.player_given_history} - ${previousTitle}`} />
                <PageComplex player={this.props.player} />
            </div>
        )
    }
}

export default PlayerRelation;