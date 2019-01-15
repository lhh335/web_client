import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'angonsoft_textfield';
import HighSearchItem from './HighSearchItem';
import CommonAlert from '../Alert/CommonAlert';

class HighSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highSearchOpen: false,
            filters: {},
            items: {},
            selectedRows: [],
            itemNums: 0,
            alertOpen: false,
            code: 0,
            content: ''
        }
    }

    popUpNotice = (type, code, content) => {
        this.setState({ type: type, code: code, content: content, alertOpen: true });
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

    static PropTypes = {
        callbackFilterChange: PropTypes.func.isRequired,
        callbackExecuteSearch: PropTypes.func.isRequired,
        callbackCloseDialog: PropTypes.func.isRequired
    }

    static defaultProps = {
        callbackFilterChange: (filters) => {

        },
        callbackExecuteSearch: () => {

        },
        callbackCloseDialog: () => {

        }
    }

    componentDidMount() {

    }

    callbackItemChange = (key, type, value, itemId) => {
        var arrayItems = Object.keys(this.state.items);
        if (arrayItems.length > 1) {
            if (key === 'id' || key === 'level' || key === 'game_coin') {
                for (var itemKey in this.state.items) {
                    if (itemId !== itemKey) {
                        for (var objectKey in this.state.items[itemKey]) {
                            for (var valueKey in this.state.items[itemKey][objectKey]) {
                                if (valueKey === ('$' + type) && key === objectKey) {
                                    this.popUpNotice('notice', 0, '已选择相同的搜索条件');
                                    return;
                                }
                            }
                        }
                    }
                }
            } else if (key === 'account' || key === 'name' || key === 'recommend' || key === 'mobile_phone' || key === 'vertify_game_coin' || key === 'vertify_game_score' || key === 'status' || key === 'login_time') {
                for (var itemKey in this.state.items) {
                    if (itemId !== itemKey) {
                        for (var objectKey in this.state.items[itemKey]) {
                            if (objectKey === key) {
                                this.popUpNotice('notice', 0, '已选择相同的搜索条件');
                                return;
                            }
                        }
                    }
                }
            }
        }


        var searchObj = new Object();

        switch (key) {
            case 'id': case 'level': case 'game_coin':
                switch (type) {
                    case 'equal':
                        searchObj[key] = parseInt(value);
                        break;
                    case 'lt':
                        searchObj[key] = { "$lt": parseInt(value) };
                        break;
                    case 'lte':
                        searchObj[key] = { "$lte": parseInt(value) };
                        break;
                    case 'gt':
                        searchObj[key] = { '$gt': parseInt(value) };
                        break;
                    case 'gte':
                        searchObj[key] = { '$gte': parseInt(value) };
                        break;
                    default:
                        break;
                }
            case 'login_time':
                if (value instanceof Object) {
                    var minDate = new Date(value.minDate).getTime() / 1000;
                    var maxDate = new Date(value.maxDate).getTime() / 1000;
                    searchObj[key] = { "$gte": minDate, "$lte": maxDate };
                }
                break;
            case 'account': case 'name': case 'recommend': case 'mobile_phone':
                switch (type) {
                    case 'equal':
                        searchObj[key] = value;
                        break;
                    case 'exists':
                        searchObj[key] = { $regex: value, $options: '$i' }
                        break;
                }
            case 'vertify_game_coin':
                switch (type) {
                    case '0':
                        searchObj['vertify'] = { $gte: 0, $lt: 8 }
                        break;
                    case '1':
                        searchObj['vertify'] = { $gte: 8, $lte: 15 }
                        break;
                }
            case 'vertify_game_score':
                switch (type) {
                    case '0':
                        searchObj['vertify'] = { $in: [0, 1, 2, 3, 8, 9, 10, 11] }
                        break;
                    case '1':
                        searchObj['vertify'] = { $in: [4, 5, 6, 7, 12, 13, 14, 15] }
                        break;
                }
            case 'status':
                switch (type) {
                    case '0':
                        searchObj[key] = 0;
                        break;
                    case '1':
                        searchObj[key] = 1;
                        break;
                }
        }

        this.state.items[itemId] = searchObj;
        // Object.assign(this.state.filters, searchObj);
        // this.props.callbackFilterChange(this.state.filters);
    }
    callbackItemDelete = (key, itemId) => {
        var deletes = document.getElementsByClassName('delete');
        var node = document.getElementById(itemId);
        node.parentNode.parentNode.removeChild(node.parentNode);
        delete this.state.items[itemId];

        // for (var filtersKey in this.state.filters) {
        //     if (filtersKey === key) {
        //         delete this.state.filters[key];
        //     }
        // }
        // this.setState({
        //     filters: this.state.filters
        // })
        // this.props.callbackFilterChange(this.state.filters);

    }
    render() {
        const {
            callbackFilterChange,
            callbackExecuteSearch,
            callbackCloseDialog
        } = this.props;
        return (<Dialog
            title="高级查询搜索"
            style={{ textAlign: 'center' }}
            actions={[
                <RaisedButton
                    label="查询"
                    primary={true}
                    onTouchTap={() => {
                        for (var key in this.state.items) {
                            // this.state.items[i];
                            for (var filtersKey in this.state.items[key]) {

                                var dbKey = "";
                                if (filtersKey === 'vertify_game_coin' || filtersKey === 'vertify_game_score') {
                                    dbKey = "vertify";
                                } else {
                                    dbKey = filtersKey;      
                                }
                                if (this.state.filters[dbKey] !== undefined) {
                                    this.state.filters[dbKey] = Object.assign(this.state.filters[dbKey], this.state.items[key][dbKey]);
                                } else {
                                    this.state.filters[dbKey] = this.state.items[key][dbKey];
                                }
                            }
                            // this.props.callbackFilterChange(this.state.filters);
                        }
                        this.props.callbackFilterChange(this.state.filters);
                        callbackExecuteSearch(this.state.filters)
                    }}
                />,
                <RaisedButton
                    label="取消"
                    primary={true}
                    style={{ marginLeft: 15 }}
                    onTouchTap={() => {
                        callbackCloseDialog();
                    }}
                />,
            ]}
            modal={false}
            open={true}
            onRequestClose={() => {

            }}
        >
            <div style={{ width: "100%", textAlign: 'center', fontSize: 14, color: '#ccc', boxShadow: '0px 0px 4px #bbb', marginBottom: 10 }}>
                说明："ID，等级，金币"字段可选择多次，但每个搜索字段的搜索条件只可选择一次；其余搜索字段仅可出现一次
            </div>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <ul style={{ display: 'flex', flexDirection: "column" }}>
                    {this.state.selectedRows.map((v, i) => {
                        return <div key={i}>
                            {v.item}
                        </div>;
                    }
                    )}
                </ul>
                <RaisedButton
                    label={"添加条件"}
                    primary={true}
                    onTouchTap={() => {
                        if (this.state.itemNums > this.highSearchTable().length - 1) {
                            return;
                        }
                        var insertRow = <HighSearchItem itemId={"item" + this.state.itemNums} callbackItemChange={this.callbackItemChange} callbackItemDelete={this.callbackItemDelete} />
                        this.state.selectedRows.push({ item: insertRow, index: this.state.itemNums });
                        this.state.itemNums++;
                        this.setState({
                            selectedRows: this.state.selectedRows
                        })
                    }}
                />
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
                    this.setState({ alertOpen: false })
                }}>
            </CommonAlert>
        </Dialog>)
    }

}

export default HighSearch;