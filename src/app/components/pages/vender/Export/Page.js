import { EXPORT_PLAYERS_C2S, EXPORT_PLAYERS_S2C } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";

import React, { Component } from 'react';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'angonsoft_textfield';
import Divider from 'material-ui/Divider';
import Util from '../../../../util';
import Title from 'react-title-component';


class VenderExport extends Component {
    state = {
        filename: "",
        players_num: 0,
        download_data: [],
        alertOpen: false,
        code: 0,
        content: "",
    }

    componentWillMount() {
        window.currentPage = this;
    }

    refresh() {
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

    popUpNotice = (type, code, content) => {
        this.setState({ code: code, content: content, alertOpen: true });
    }

    replaceAll = (str) => {
        str = String(str);
        while (str.indexOf('\"') !== -1) {
            str = str.replace('\"', '\'');
        }
        return str;
    }

    render() {
        return <div>
            <Title render={(previousTitle) => `导出数据 - 工厂后台`} />
            <FlatButton
                label={"导出玩家数据"}
                style={{ marginTop: 20, border: '0px 0px 5px #ddd', marginBottom: 10 }}
                onTouchTap={(event) => {
                    var cb = (id, message, arg) => {
                        if (id != EXPORT_PLAYERS_S2C) {
                            return;
                        }
                        console.log(message);
                        var self = arg[0];
                        // var default_file_name = arg[1];
                        var result = [];
                        if (message.code === LOGIC_SUCCESS) {
                            var downloadData = [new Uint8Array([0xEF, 0xBB, 0xBF])];
                            result = message.rows;
                            var tableKey = ['account', 'id', 'taste_coin', 'game_coin', 'name', 'head_portrait', 'sex', 'level',
                                'status', 'password', 'recommend', 'language', 'kind', 'vendoridentfier', 'system_version', 'device_model',
                                'device_name', 'device_uniqueidentifier', 'operating_system', 'login_time', 'session', 'refresh_token', 'log_game_coin', 'log_taste_coin',
                                "vertify", "mobile_phone", "close"];
                            var tableHeadTitle = ['账号', 'id', '体验币', '金币', '昵称', '头像', '性别', '等级',
                                '状态', '密码', '推广员', '语言', '类型', '出厂表示', '系统版本', '设备模型',
                                '设备名', '设备唯一标识', '操作系统', '登录时间', '回话', '刷新标识', '统计金币', '统计体验币',
                                "用户验证", "电话", "关闭功能"];
                            var tableContent = [];
                            var item = [];
                            tableContent.push(tableHeadTitle.join(','));
                            tableContent.push(tableKey.join(','));
                            for (var j = 0; j < result.length; j++) {
                                item = [];

                                for (var i = 0; i < tableKey.length; i++) {
                                    item.push("\"" + this.replaceAll(result[j][tableKey[i]]) + "\"");
                                }
                                tableContent.push(item.join(','));
                            }

                            downloadData.push(tableContent.join('\n'));
                            self.state.filename = Util.time.downloadTimeString(Util.time.getTimeStamp()) + "_" + message.rows.length;

                            self.state.players_num = message.rows.length;
                            self.state.download_data = downloadData;
                            self.handleDownloadFile();

                        }
                        // 
                        self.popUpNotice('notice', message.code, Lang[window.Lang].ErrorCode[message.code]);
                    }
                    MsgEmitter.emit(EXPORT_PLAYERS_C2S, {}, cb, [this]);
                }}
            />
            <div style={{ boxShadow: '0px 0px 7px #ccc', width: '100%', height: 'auto', padding: 20, fontSize: 16, marginBottom: 10 }}>
                <Divider />
                <div style={{ display: 'inline', marginRight: 25 }}>
                    {"导出" + this.state.players_num + '位玩家数据'}
                </div>
                <div style={{ display: 'inline' }}>
                    导出文件名:
                <TextField
                        longWidth={true}
                        id='recharge_code_filename'
                        hintText={'请填写导出文件名'}
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
                    id='downloadData'
                    label={'确认导出'}
                    style={{ float: 'right', marginLeft: 20, marginTop: 10 }}

                    disabled={this.state.players_num <= 0}
                    href="#"
                    download
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
        </div>
    }
}

export default VenderExport;