import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'angonsoft_textfield';
import SelectField from 'angon_selectedfield';
import Styles from '../../../Styles';
import Lang from '../../../Language';
import MenuItem from 'material-ui/MenuItem';
import TimeSelector from '../TimeSelector/TimeSelector';

class HighSearchItem extends Component {
    constructor(props) {
        super(props);
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(1);

        maxDate.setHours(23, 59, 59, 0);

        this.state = {
            key: '',
            type: '',
            value: '',
            minDate: minDate,
            maxDate: maxDate,
        }
    }



    static PropTypes = {
        itemId: PropTypes.string.isRequired,
        callbackItemChange: PropTypes.func.isRequired,
        callbackItemDelete: PropTypes.func.isRequired
    }

    static defaultProps = {
        callbackItemChange: (key, type, value) => {

        },
        callbackItemDelete: (key) => {

        },
    }

    handleChangeMinDate = (event, date) => {
        date.setHours(this.state.minDate.getHours(), this.state.minDate.getMinutes(), this.state.minDate.getSeconds());
        this.state.minDate = date;
        this.props.callbackItemChange(this.state.key, this.state.type, { minDate: this.state.minDate, maxDate: this.state.maxDate }, itemId);

    };

    handleChangeMinTime = (event, date) => {
        this.state.minDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
        this.props.callbackItemChange(this.state.key, this.state.type, { minDate: this.state.minDate, maxDate: this.state.maxDate }, itemId);
    }

    handleChangeMaxDate = (event, date) => {
        date.setHours(this.state.maxDate.getHours(), this.state.maxDate.getMinutes(), this.state.maxDate.getSeconds());
        this.state.maxDate = date;
        this.props.callbackItemChange(this.state.key, this.state.type, { minDate: this.state.minDate, maxDate: this.state.maxDate }, itemId);
    };

    handleChangeMaxTime = (event, date) => {
        this.state.maxDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
        this.props.callbackItemChange(this.state.key, this.state.type, { minDate: this.state.minDate, maxDate: this.state.maxDate }, itemId);
    }

    highSearchTable = () => {
        return [
            { key: "id", type: "number" },
            { key: "account", type: "string" },
            { key: "name", type: "string" },
            { key: "level", type: "number" },
            { key: "status", type: "status" },
            { key: "recommend", type: "string" },
            { key: "mobile_phone", type: "string" },
            { key: "game_coin", type: "number" },
            { key: "vertify_game_coin", type: "vertify_game_coin" },
            { key: "vertify_game_score", type: "vertify_game_score" },
            { key: "login_time", type: "number" }
        ]
    }

    highSearchTypeTable = (key) => {
        switch (key) {
            case 'id': case 'level': case 'game_coin': case 'login_time':
                return [{ key: 'equal' }, { key: 'lt' }, { key: "lte" }, { key: 'gt' }, { key: 'gte' }]
            case 'account': case 'name': case 'recommend': case 'mobile_phone':
                return [{ key: 'equal' }, { key: 'exists' }]
            case 'status': case 'vertify_game_coin': case 'vertify_game_score':
                return [{ key: '0' }, { key: '1' }]
            default:
                return []
        }
    }


    render() {
        const {
            itemId,
            callbackItemChange,
            callbackItemDelete
        } = this.props;
        return (
            <div id={itemId}>
                <SelectField
                    value={this.state.key}
                    onChange={(event, index, value) => {
                        this.setState({
                            key: value
                        })
                        if (value === 'login_time') {
                            callbackItemChange(value, this.state.type, { minDate: this.state.minDate, maxDate: this.state.maxDate }, itemId);
                        } else {
                            callbackItemChange(value, this.state.type, this.state.value, itemId);
                        }
                    }}
                    style={this.state.key === 'login_time' ? Styles.selecteField3 : Styles.selecteField4}
                    middleWidth={true}
                >
                    {this.highSearchTable().map((item, i) => <MenuItem
                        key={i}
                        value={item.key}
                        primaryText={Lang[window.Lang].User.AccountPage.highSearchTable[item.key]}
                    />)}
                </SelectField>
                {this.state.key === 'login_time' ?
                    <div style={Styles.normalFloat}>
                        <TimeSelector
                            callbackMinDateFuction={this.handleChangeMinDate}
                            callbackMinTimeFuction={this.handleChangeMinTime}
                            callbackMaxDateFuction={this.handleChangeMaxDate}
                            callbackMaxTimeFuction={this.handleChangeMaxTime}
                            quickSearch={false}
                        />
                    </div> : <SelectField
                        value={this.state.type}
                        onChange={(event, index, value) => {
                            this.setState({
                                type: value
                            })
                            callbackItemChange(this.state.key, value, this.state.value, itemId);
                        }}
                        style={Styles.selecteField2}
                        middleWidth={true}
                    >
                        {this.highSearchTypeTable(this.state.key).map((v, i) => {
                            switch (this.state.key) {
                                case 'account': case 'name': case 'recommend': case 'mobile_phone':
                                    return (
                                        <MenuItem
                                            key={i}
                                            value={v.key}
                                            primaryText={Lang[window.Lang].User.AccountPage.highSearchStringType[v.key]}
                                        />
                                    )
                                case 'id': case 'level': case 'game_coin': case 'login_time':
                                    return (
                                        <MenuItem
                                            key={i}
                                            value={v.key}
                                            primaryText={Lang[window.Lang].User.AccountPage.highSearchNumType[v.key]}
                                        />
                                    )
                                case 'vertify_game_coin': case 'vertify_game_score':
                                    return (
                                        <MenuItem
                                            key={i}
                                            value={v.key}
                                            primaryText={Lang[window.Lang].User.AccountPage.highSearchVerifyType[v.key]}
                                        />
                                    )
                                case 'status':
                                    return (
                                        <MenuItem
                                            key={i}
                                            value={v.key}
                                            primaryText={Lang[window.Lang].User.AccountPage.highSearchStatusType[v.key]}
                                        />
                                    )

                            }

                        })}

                    </SelectField>
                }

                {this.state.key !== 'login_time' ?
                    <TextField
                        middleWidth={true}
                        style={Styles.selecteField2}
                        disabled={(this.state.key === 'status' || this.state.key === 'vertify_game_coin' || this.state.key === 'vertify_game_score') ? true : false}
                        multiLine={false}
                        hintText={'请输入相应的搜索值'}
                        defaultValue=""
                        onChange={(event, value) => {
                            this.setState({
                                value: value
                            })
                            callbackItemChange(this.state.key, this.state.type, value, itemId);
                        }}
                    /> : ''
                }


                <RaisedButton
                    id={this.state.key}
                    className={'delete'}
                    label="删除"
                    secondary={true}
                    style={this.state.key === 'login_time' ? Styles.highSearchDelete2 : Styles.highSearchDelete1}
                    onClick={(e, i) => {
                        callbackItemDelete(this.state.key, itemId);
                    }}
                />
            </div>

        )
    }
}

export default HighSearchItem;