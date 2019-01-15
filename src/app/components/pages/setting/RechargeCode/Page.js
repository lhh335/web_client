import { GENERATE_RECHARGE_CODE_C2S, GENERATE_RECHARGE_CODE_S2C, QUERY_RECHARGE_CODE_C2S, QUERY_RECHARGE_CODE_S2C, DOWNLOAD_RECHARGE_CODE_C2S, DOWNLOAD_RECHARGE_CODE_S2C, INVALID_RECHARGE_CODE_C2S, INVALID_RECHARGE_CODE_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'angonsoft_textfield';
import FlatButton from 'material-ui/FlatButton';
import TimeSelector from '../../../myComponents/TimeSelector/TimeSelector';
import SelectField from 'angon_selectedfield';
import MenuItem from 'material-ui/MenuItem';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import Util from '../../../../util';
import Divider from 'material-ui/Divider';

import ReactDataGrid from 'angon_react_data_grid';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';


class RechargeCode extends Component {
    constructor(props) {
        super(props);
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(1);

        maxDate.setHours(23, 59, 59, 0);
        this.state = {
            minDate: minDate,
            maxDate: maxDate,
            showRechargeInfo: "",
            generateRechargeInfo: false,
            queryRechargeInfo: false,
            data: [],
            allData: [],
            sort: { id: -1 },
            currentPage: 1,
            totalPage: 1,
            onloading: false,
            rowsPerPage: 10,
            count: 0,
            download_flag: false,
            search_way: 0,
            search_type: 0,
            selectedRowID: [],
            alertType: "notice",
            alertOpen: false,
            code: 0,
            content: '',
            handleCertainClose: this.handleCertainClose,
            selectedIndexes: [],
            download_url: "#",
            download_num: "",
            filename: "",
            searchInput: "",
            download_data: []
        }
    }

    popUpNotice = (type, code, content, handleCertainClose = this.handleCertainClose) => {
        this.setState({ alertType: type, code: code, content: content, alertOpen: true, handleCertainClose: handleCertainClose });
    }

    handleCertainClose = () => {
        this.setState({ alertOpen: false });
    }

    handleChangeMinDate = (event, date) => {
        if (date.getTime() < this.state.maxDate.getTime()) {
            date.setHours(this.state.minDate.getHours(), this.state.minDate.getMinutes(), this.state.minDate.getSeconds());
            this.state.minDate = date;
        }
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

    handleGenRechargeCode = () => {

        var game_coin = document.getElementById('recharge_code_coin').value;
        var num = document.getElementById('recharge_code_num').value;
        if (game_coin === '' || num === '') {
            this.popUpNotice("notice", 0, '输入不能为空');
            return;
        }
        if (isNaN(game_coin) || isNaN(num)) {
            this.popUpNotice("notice", 99021, Lang[window.Lang].ErrorCode[99021]);
            return;
        } else {
            if (Number(game_coin) % 1 != 0 || Number(num) % 1 != 0) {
                this.popUpNotice("notice", 99023, Lang[window.Lang].ErrorCode[99023]);
                return;
            }
            if (Number(game_coin) < 0 || Number(num) < 0) {
                this.popUpNotice("notice", 0, '填写的数据不能小于0');
                return;
            } if (Number(game_coin) > 10000) {
                this.popUpNotice("notice", 0, '充值码单笔金额不得超过10000');
                return;
            } if (Number(num) > 100) {
                this.popUpNotice('notice', 0, '充值码数量不得超过100');
                return;
            }
        }
        var cb = (id, message, arg) => {
            if (id != GENERATE_RECHARGE_CODE_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                document.getElementById('recharge_code_num').value = '';
                document.getElementById('recharge_code_coin').value = '';
                self.setState({
                    generateRechargeInfo: false,
                    selectedRowID: []
                })
                self.handleQueryRechargeCode(true, false);
            }
            self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
        }
        var obj = {
            game_coin: Number(game_coin),
            num: Number(num)
        }
        MsgEmitter.emit(GENERATE_RECHARGE_CODE_C2S, obj, cb, this);
    }

    handleUptateAllData = (newData) => {
        this.state.allData = this.state.allData.concat(newData);
    }

    handleUpdateData = (page) => {
        this.state.onloading = true;
        if (page <= 0) {
            page = 1;
        }
        if (page > this.state.totalPage) {
            page = this.state.totalPage;
        }
        this.state.currentPage = page;
        if (this.state.allData.length <= this.state.rowsPerPage * (page - 1) && this.state.allData.length < this.state.count) {
            this.handleQueryRechargeCode(false, false);
        } else {
            var data = this.state.allData.slice(this.state.rowsPerPage * (page - 1), this.state.rowsPerPage * page);
            this.state.onloading = false;
            this.setState({ data: data });
            this.state.data = data;
            if (data.length > 0) {
                var allCheckBox = true;
                for (var i = 0; i < data.length; i++) {
                    if (this.state.selectedRowID.indexOf(data[i].id) === -1) {
                        allCheckBox = false;
                    }
                }

                if (allCheckBox === true) {
                    document.getElementById('select-all-checkbox').checked = true;
                } else {
                    document.getElementById('select-all-checkbox').checked = false;
                }
            }
        }
    }

    showPre = () => {
        this.handleUpdateData(this.state.currentPage - 1);
    }

    showNext = () => {
        if (this.state.onloading === true) {
            return;
        } else {
            this.handleUpdateData(this.state.currentPage + 1);
        }
    }

    handleQuerySearchWay = (event, index, value) => {
        this.setState({ search_way: value })
        this.state.search_way = value;
    }

    handleQuerySearchType = (event, index, value) => {
        this.setState({ search_type: value })
        this.state.search_type = value;
    }

    makeSearchObj = () => {
        var minDate = this.state.minDate.getTime() / 1000;
        var maxDate = this.state.maxDate.getTime() / 1000;

        var searchobj;
        if (this.state.search_type === 1) {
            var list;
            if (this.state.searchInput.indexOf("\n") !== -1) {
                list = this.state.searchInput.split("\n");
                // } else if (this.state.searchInput.indexOf(" ") !== -1) {
                // list = this.state.searchInput.split(" ");
            } else {
                list = this.state.searchInput.split(" ");
            }

            if (list[0].charAt(0) === "*" && list[0].charAt(list[0].length - 1) === "*") {
                searchobj = {
                    recharge_code: list
                }
            } else if (!isNaN(list[0])) {
                var idList = list.map((number) => {
                    return Number(number)
                })
                searchobj = {
                    id: idList
                }
            } else {
                searchobj = {
                    gen_time: { "$gte": minDate, "$lte": maxDate },
                    status: this.state.search_way === 0 ? [1, 2, 3] : this.state.search_way
                }
            }

        } else if (this.state.search_type === 0) {
            searchobj = {
                gen_time: { "$gte": minDate, "$lte": maxDate },
                status: this.state.search_way === 0 ? [1, 2, 3] : this.state.search_way
            }
        } else {
            searchobj = {}
        }
        return JSON.stringify(searchobj)
    }

    handleQueryRechargeCode = (reload = false, notice = false) => {
        if (reload === true) {
            this.state.data = [];
            this.state.allData = [];
            this.setState({ currentPage: 1, totalPage: 1 });
        }
        var cb = (id, message, arg) => {
            if (id != QUERY_RECHARGE_CODE_S2C) {
                return;
            }
            var self = arg[0];
            var result = [];
            if (message.code === LOGIC_SUCCESS) {
                result = message.rci;
                self.handleUptateAllData(result);
                self.handleUpdateData(self.state.currentPage);
                self.setState({
                    totalPage: Util.page.getTotalPage(message.count, self.state.rowsPerPage),
                    count: message.count
                })
                self.state.count = message.count;
            }
            if (arg[1] === true) {
                self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
            }
        }
        var obj = {
            search: this.makeSearchObj(),
            data_length: this.state.allData.length,
            sort: JSON.stringify(this.state.sort)
        };
        MsgEmitter.emit(QUERY_RECHARGE_CODE_C2S, obj, cb, [this, notice]);
    }

    refresh() {
        this.handleQueryRechargeCode(true, false);
    }

    handleDownloadFile = () => {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var that = this;
        window.webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024, function (grantedBytes) {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
                fs.root.getFile(that.state.filename + '.csv', { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            if (fileWriter.length === 0) {
                                var bolb = new Blob(that.state.download_data, { type: "text/plain;charset=utf-8" });
                                fileWriter.write(bolb);
                            } else {
                                if (that.state.download_flag === false) {
                                }
                            }
                        };
                        fileWriter.onerror = function (e) {
                            //文件创建失败  
                        };
                        /**************************************************************/

                        var url = fileEntry.toURL();
                        document.getElementById("downloadData").href = url;
                        document.getElementById("downloadData").download = that.state.filename + ".csv"
                        that.state.download_flag = true;
                        fileWriter.truncate(0);

                    }, function () { });

                }, function () { });
            });
        }, function (e) {
        });
    }
    arrayTranformTable = (result) => {
        var downloadData = [new Uint8Array([0xEF, 0xBB, 0xBF])];

        // var tableHeadEn = ['id', 'recharge_code', 'admin', 'game_coin', 'status', 'player', 'gen_time', 'use_time'];
        var tableContent = [];
        var item = [];
        var title = []
        for (let key in result[0]) {
            switch (key) {
                case 'id':
                    item.push(String(parseInt(result[0][key])));
                    title.push("充值码id")
                    break;
                case 'game_coin':
                    item.push(String(result[0][key]));
                    title.push("充值金额");
                    break;
                case 'gen_time':
                    item.push(Util.time.getTimeString(result[0][key]));
                    title.push("生成时间");
                    break;
                case 'use_time':
                    item.push(result[0][key] === 0 ? '--' : Util.time.getTimeString(result[0][key]));
                    title.push("使用时间");
                    break;
                case 'status':
                    // item.push(result[0][key]);
                    item.push(Lang[window.Lang].Setting.rechargeCodeStatus[result[0][key]]);
                    title.push("状态");
                    break;
                case 'admin':
                    item.push(result[0][key]);
                    title.push("管理员");
                    break;
                case 'player':
                    item.push(result[0][key] == 0 ? "--" : result[0][key]);
                    title.push("使用玩家");
                    break;
                case 'recharge_code':
                    item.push(result[0][key]);
                    title.push("充值码");
                    break;
                default:
                    break;
            }
        }
        tableContent.push(title.join(','));
        tableContent.push(item.join(','));
        for (var j = 1; j < result.length; j++) {
            item = [];

            for (let key in result[j]) {
                switch (key) {
                    case 'id':
                        item.push(String(parseInt(result[j][key])));
                        break;
                    case 'game_coin':
                        item.push(String(result[j][key]));
                        break;
                    case 'gen_time':
                        item.push(Util.time.getTimeString(result[j][key]));
                        break;
                    case 'use_time':
                        item.push(result[j][key] === 0 ? '--' : Util.time.getTimeString(result[j][key]));
                        break;
                    case 'status':
                        // item.push(result[j][key]);
                        item.push(Lang[window.Lang].Setting.rechargeCodeStatus[result[j][key]]);
                        break;
                    case 'admin':
                        item.push(result[j][key]);
                        break;
                    case 'player':
                        item.push(result[j][key] == 0 ? "--" : result[j][key]);
                        break;
                    case 'recharge_code':
                        item.push(result[j][key]);
                        break;
                    default:
                        break;
                }
            }
            tableContent.push(item.join(','));
        }

        downloadData.push(tableContent.join('\n'));
        return downloadData;
    }
    handleDownloadSelectRechargeCode = () => {
        var result = [];
        for (var i = 0; i < this.state.selectedRowID.length; i++) {
            for (var j = 0; j < this.state.allData.length; j++) {
                if (this.state.allData[j].id === this.state.selectedRowID[i]) {
                    result.push(this.state.allData[j]);
                }
            }
        }
        var downloadData = this.arrayTranformTable(result);
        this.setState({
            download_num: result.length,
            filename: Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + result.length,
            showRechargeInfo: "download"
        })
        this.state.filename = Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + result.length;
        this.state.download_data = downloadData;
        this.handleDownloadFile();
    }
    handleDownloadRechargeCode = (search_selected = true) => {
        var cb = (id, message, arg) => {
            if (id != DOWNLOAD_RECHARGE_CODE_S2C) {
                return;
            }
            var self = arg[0];
            // var default_file_name = arg[1];
            var result = [];
            if (message.code === LOGIC_SUCCESS) {
                result = message.rci;
                var downloadData = self.arrayTranformTable(result);
                self.setState({
                    download_num: message.count,
                    filename: Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + message.count,
                    showRechargeInfo: "download"
                })
                self.state.filename = Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + message.count;
                self.state.download_data = downloadData;
                self.handleDownloadFile();
            } else {
                self.popUpNotice('notice', 0, "没有满足搜索条件的充值码");
            }
            // 
        }
        var obj = {
            search: this.makeSearchObj(),
            sort: JSON.stringify(this.state.sort)
        }
        MsgEmitter.emit(DOWNLOAD_RECHARGE_CODE_C2S, obj, cb, [this]);
    }

    invalidRechargeCode = (obj) => {
        var cb = (id, message, arg) => {
            if (id != INVALID_RECHARGE_CODE_S2C) {
                return;
            }
            var self = arg;
            if (message.code === LOGIC_SUCCESS) {
                self.handleQueryRechargeCode(true, false);
            }
        }
        MsgEmitter.emit(INVALID_RECHARGE_CODE_C2S, obj, cb, this);
    }

    handleInvalidSearchInput = () => {
        var obj = {
            search: this.makeSearchObj()
        }
        this.invalidRechargeCode(obj);
        this.setState({ alertOpen: false })
    }

    handleInvalidRechargeCode = () => {
        if (this.state.selectedRowID.length === 0) {
            this.popUpNotice('notice', 0, '请先选择数据');
            return;
        }
        var searchobj = {
            id: this.state.selectedRowID
        };
        var obj = {
            search: JSON.stringify(searchobj)
        }
        this.invalidRechargeCode(obj);
    }

    componentDidMount() {
        window.currentPage = this;
        // this.handleQueryRechargeCode(true, false);
    }

    onRowsDeselected = (rowArray) => {

        var tranform = new Set(this.state.selectedRowID);
        this.state.selectedRowID = [...tranform];
        if (rowArray.length > 1) {
            for (var j = 0; j < this.state.data.length; j++) {
                if (this.state.selectedRowID.indexOf(this.state.data[j].id) === -1) {

                } else {

                    this.state.selectedRowID.splice(this.state.selectedRowID.indexOf(this.state.data[j].id), 1);
                }
            }
        } else {
            var index = this.state.selectedRowID.indexOf(rowArray[0].row.id);
            this.state.selectedRowID.splice(index, 1);
        }
        this.setState({
            selectedRowID: this.state.selectedRowID
        })
        this.state.selectedRowID = this.state.selectedRowID;
    }
    onRowsSelected = (rowArray) => {
        if (rowArray.length > 1) {
            for (var i = 0; i < this.state.data.length; i++) {
                this.state.selectedRowID.push(this.state.data[i].id);
            }
        } else {
            this.state.selectedRowID.push(rowArray[0].row.id);
        }
        this.setState({
            selectedRowID: this.state.selectedRowID
        })
        console.log(this.state.selectedRowID);
    }

    showInfo = () => {
        if (this.state.showRechargeInfo === "generate") {
            return (<div style={{ boxShadow: '0px 0px 7px #ccc', width: '100%', height: 'auto', padding: 20, fontSize: 16, marginBottom: 10, overflow: 'hidden' }}>
                <i
                    style={{ color: '#0066ff', marginLeft: 10, cursor: 'pointer' }}
                    onClick={() => {
                        this.setState({
                            showRechargeInfo: "",
                        })
                    }}>
                    收起
                </i>
                <Divider />
                <p style={{ float: 'left', marginTop: 13 }}>充值码数量:</p>
                <TextField
                    middleWidth={true}
                    id='recharge_code_num'
                    hintText={'请填写充值码个数'}
                    style={{ marginLeft: 10, float: 'left', marginRight: 10 }}
                    onChange={() => {

                    }}
                />
                <p style={{ float: 'left', marginTop: 13 }}>充值码单位金额:</p>
                <TextField
                    middleWidth={true}
                    id='recharge_code_coin'
                    hintText={'充值码单位金额'}
                    style={{ marginLeft: 10, float: 'left' }}
                    onChange={() => {

                    }}
                />
                <RaisedButton
                    label={'确定'}
                    style={{ float: 'right', marginTop: 10 }}
                    primary={true}
                    onClick={() => {
                        this.handleGenRechargeCode();
                    }}
                />
            </div>)
        } else if (this.state.showRechargeInfo === "download") {
            return (<div style={{ boxShadow: '0px 0px 7px #ccc', width: '100%', height: 'auto', padding: 20, fontSize: 16, marginBottom: 10 }}>
                <i
                    style={{ color: '#0066ff', marginLeft: 10, cursor: 'pointer' }}
                    onClick={() => {
                        this.setState({
                            showRechargeInfo: "",
                        })
                    }}>
                    收起
                </i>
                <Divider />
                <div style={{ display: 'inline', marginRight: 25 }}>
                    {"下载条数:" + this.state.download_num + '条'}
                </div>
                <div style={{ display: 'inline' }}>
                    下载文件名:
                    <TextField
                        longWidth={true}
                        id='recharge_code_filename'
                        hintText={'请填写下载文件名'}
                        value={this.state.filename}
                        style={{ marginLeft: 10 }}
                        onChange={(event, value) => {
                            this.state.filename = value
                            this.setState(
                                { filename: value }
                            )
                            this.handleDownloadFile();
                        }}
                    />
                </div>

                <RaisedButton
                    primary={true}
                    label={'刷新'}
                    style={{ float: 'right', marginLeft: 20, marginTop: 10 }}
                    onClick={() => {
                        this.handleDownloadRechargeCode()
                    }}
                />
                <RaisedButton
                    primary={true}
                    id='downloadData'
                    label={'确认下载'}
                    style={{ float: 'right', marginLeft: 20, marginTop: 10 }}
                    href="#"
                    disabled={this.state.download_num <= 0}
                    download
                />
            </div>)
        } else {
            return <div></div>
        }
    }

    render() {
        return (
            <div>
                <Paper style={{ marginTop: 60, marginRight: 20, padding: 10, paddingLeft: 0 }}>
                    <SelectField
                        value={this.state.search_type}
                        onChange={this.handleQuerySearchType}
                        style={{ marginLeft: 10 }}
                        middleWidth={true}
                    >
                        <MenuItem value={0} key={'all'} primaryText={'按条件搜索'} />
                        <MenuItem value={1} key={'noUse'} primaryText={'按充值码搜索'} />
                    </SelectField>
                    {this.state.search_type === 0 ?
                        <div style={{ overflow: 'hidden' }}>
                            <div style={Styles.normalFloat}>
                                <TimeSelector
                                    callbackMinDateFuction={this.handleChangeMinDate}
                                    callbackMinTimeFuction={this.handleChangeMinTime}
                                    callbackMaxDateFuction={this.handleChangeMaxDate}
                                    callbackMaxTimeFuction={this.handleChangeMaxTime}
                                    minDate={this.state.minDate.getTime()}
                                />
                            </div>
                            <SelectField
                                value={this.state.search_way}
                                onChange={this.handleQuerySearchWay}
                                style={Styles.selecteField}
                                middleWidth={true}
                            >
                                <MenuItem value={0} key={'all'} primaryText={'全部充值码'} />
                                <MenuItem value={1} key={'noUse'} primaryText={'未使用充值码'} />
                                <MenuItem value={2} key={'invalid'} primaryText={'无效充值码'} />
                                <MenuItem value={3} key={'use'} primaryText={'已使用充值码'} />
                            </SelectField>

                        </div> :
                        <div>
                            <TextField
                                superLongWidth={true}
                                style={{
                                    marginLeft: 10,
                                    border: '1px dashed #ccc'
                                }}

                                hintText={'在此可复制充值码精确查询'}
                                hintStyle={{ paddingLeft: 10 }}
                                id="search_text_field"
                                disabled={false}
                                multiLine={true}
                                rows={2}
                                rowsMax={2}
                                defaultValue=""
                                onChange={(event, value) => {
                                    this.state.searchInput = value
                                }}
                            />
                        </div>
                    }

                    <div style={{ marginLeft: 10 }}>
                        <RaisedButton
                            label="查询" primary={true} style={Styles.selecteField} onMouseUp={() => {
                                this.setState({
                                    showRechargeInfo: ""
                                })
                                this.handleQueryRechargeCode(true, true);
                            }}
                        />
                        <RaisedButton
                            label="下载" primary={true} style={Styles.selecteField} onClick={() => {
                                this.handleDownloadRechargeCode(false);
                            }}
                        />
                        <RaisedButton
                            label="无效" primary={true} style={Styles.selecteField} onClick={() => {
                                this.setState({
                                    showRechargeInfo: ""
                                })
                                if (this.state.search_type === 1 && this.state.searchInput === "") {
                                    this.popUpNotice("alert", 0, "您没有输入搜索条件!", this.handleCertainClose);
                                } else {
                                    this.popUpNotice("alert", 0, "您确定无效该搜索条件的充值码么？", this.handleInvalidSearchInput)
                                }
                            }}
                        />
                    </div>

                    <ReactDataGrid
                        rowKey="id"
                        columns={[
                            {
                                key: "id",
                                name: "id",
                                width: 80,
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "recharge_code",
                                name: "充值码",
                                width: 350,
                                sortable: false,
                                resizable: true
                            },
                            {
                                key: "admin",
                                name: "所属管理员",
                                width: 120,
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "game_coin",
                                name: "金额",
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "status",
                                name: "状态",
                                width: 80,
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "player",
                                name: "使用玩家",
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "gen_time",
                                name: "生成时间",
                                sortable: true,
                                resizable: true
                            },
                            {
                                key: "use_time",
                                name: "使用时间",
                                sortable: true,
                                resizable: true
                            }

                        ]}
                        rowGetter={(i) => {
                            if (i === -1) {
                                return {}
                            }
                            return {
                                id: parseInt(this.state.data[i].id),
                                recharge_code: this.state.data[i].recharge_code,
                                admin: this.state.data[i].admin,
                                game_coin: this.state.data[i].game_coin,
                                status: Lang[window.Lang].Setting.rechargeCodeStatus[this.state.data[i].status],
                                player: this.state.data[i].player,
                                gen_time: Util.time.getTimeString(this.state.data[i].gen_time),
                                use_time: this.state.data[i].status != 3 ? '--' : Util.time.getTimeString(this.state.data[i].use_time),
                            }
                        }}
                        onGridSort={(sortColumn, sortDirection) => {
                            this.state.sort = {}
                            if (sortDirection === 'ASC') {
                                this.state.sort[sortColumn] = 1
                            } else {
                                this.state.sort[sortColumn] = -1
                            }
                            this.handleQueryRechargeCode(true, false);
                        }}
                        enableRowSelect={true}
                        rowsCount={this.state.data.length}
                        minHeight={440}
                        rowHeight={40}
                        rowSelection={{
                            showCheckbox: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                                keys: {
                                    rowKey: 'id',
                                    values: this.state.selectedRowID
                                }
                            }
                        }}
                        onGridKeyDown={(e) => {

                        }}
                    />
                    <FlatButton label={Lang[window.Lang].Master.pre_page} primary={true} style={Styles.raiseButton}
                        onMouseUp={this.showPre} />
                    {this.state.currentPage}{Lang[window.Lang].Master.page}/{this.state.totalPage}{Lang[window.Lang].Master.page}
                    <FlatButton label={Lang[window.Lang].Master.next_page} primary={true} style={Styles.raiseButton}
                        onMouseUp={this.showNext} />
                    <div style={{ float: 'right', marginRight: 10, paddingTop: 10 }}>
                        <RaisedButton
                            label="下载选中项目" style={{ float: 'right', marginLeft: 20 }} onClick={() => {
                                if (this.state.selectedRowID.length === 0) {
                                    this.setState({
                                        showRechargeInfo: ""
                                    })
                                    this.popUpNotice('notice', 0, '请先选择需要下载的数据');
                                    return;
                                }
                                this.handleDownloadSelectRechargeCode();
                            }}
                        />

                        <RaisedButton
                            label={'无效选中项'}
                            style={{ float: 'right', marginLeft: 20 }}
                            onClick={() => {
                                this.handleInvalidRechargeCode();
                            }}
                        />

                        <RaisedButton
                            label="生成充值码"
                            style={{ float: 'right' }}
                            onClick={() => {
                                this.setState({
                                    showRechargeInfo: "generate"
                                })
                            }}
                        />
                    </div>

                    <div style={{ overflow: 'hidden', padding: 10, paddingBottom: 5, marginTop: 10 }}>
                        {this.showInfo()}

                    </div>

                </Paper>
                <CommonAlert
                    show={this.state.alertOpen}
                    type={this.state.alertType}
                    code={this.state.code}
                    content={this.state.content}
                    handleCertainClose={this.state.handleCertainClose}
                    handleCancelClose={() => {
                        this.setState({ alertOpen: false })
                    }}>
                </CommonAlert>
            </div>
        )
    }
}

export default RechargeCode;
