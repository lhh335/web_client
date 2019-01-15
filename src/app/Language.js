const Language = {
    Chin: {
        locale: "zh-Hans-CN",
        Lang: {
            1: "中文简体",
            2: "英文",
        },
        Master: {
            reconnect: "尝试重连，请耐心等待",
            admin_title: "管理员后台",
            promoter_title: "推广员后台",
            superAdmin_title: "超级管理员",
            vender_title: "厂家后台",
            login: "登  录",
            first_page: "首页",
            pre_page: "上一页",
            next_page: "下一页",
            last_page: "最后一页",
            goto_page: "前往某页",
            search_by_account: "通过账号查找",
            search_by_id: "通过id号查找",
            search_by_name: "通过昵称查找",
            search_by_promoter: "通过推广员查找",
            add_button: "新增",
            certain_button: "确定",
            modify_button: "修改",
            actions: "操作",
            delete_button: "刪除",
            cancel_button: "取消",
            start_date: "起始日期",
            start_time: "起始时间",
            end_date: "终止日期",
            end_time: "终止时间",
            action_success: "操作成功",
            action_fail: "操作失败",
            action_error: "操作有误",
            search_success: "查找成功",
            no_data: "没有相关数据",
            search_button: "搜索",
            reset_account: "重置您的密码",
            your_password: "您现在的密码",
            new_password: "您的新密码",
            again_password: "在此输入新密码",
            login_success: "登陆成功",
            login_other_place: "您的账号在其他位置登录",
            password_change_success: "密码修改成功，请重新登录",
            refresh: "刷新",
            change_theme: "更改主题",
            bright: "明亮",
            dark: "黑暗",
            personal: "个人信息",
            login_session: "登录信息",
            reset_password: "修改密码",
            log_out: "登出",
            input_your_auth: "输入谷歌验证码",
            auth: "谷歌验证码",
            logType: {
                0: "管理员登录",
                1: "推广员登录",
            },
            you: "您",
            page: "页",
            input_your_account: "输入您的账号",
            input_your_password: "输入您的密码",
            account: "账号",
            password: "密码",
            log_in: "登陆",
            admin: "管理员",
            server_ip: "服务器地址",
            connect: "连接",
            promoter: "推广员",
            user_table: {
                account: "账号",
                leader: "上级",
                type: "类型",
                game_coin: "金币",
                language: "语言",
                time: "注册时间"
            },
            approve_status: {
                1: "待审批",
                2: "通过",
                3: "拒绝",
                4: "无效",
                11: "玩家未审批",
                12: "玩家通过",
                13: "玩家拒绝",
                15: "推广员取消",
                22: "管理员通过"
            },
            recharge_approve_type: {
                0: "玩家申请",
                1: "推广员充值",
                2: "管理员赠送"
            },
            exchange_approve_type: {
                0: "玩家申请",
                1: "推广员兑换",
                2: "管理员收回"
            }
        },

        User: {
            title: "玩家数据",
            account: "玩家状态",
            info: "玩家信息",
            charge_page: "玩家充值",
            pay_order: "在线充值订单",
            player_wxcharge_page: "玩家微信充值",
            player_charge_history: "玩家充值历史",
            player_exchange_history: "玩家兑换历史",
            player_return_history: "玩家返利历史",
            player_given_history: "玩家赠送历史",
            player_confiscated_history: "玩家扣除历史",
            wxcharge_page: "微信充值历史",
            exchange_page: "玩家兑换",
            // exchange_page: "玩家兑换",
            charge_history: "充值历史",
            exchange_history: "兑换历史",
            return_history: "返利历史",
            confiscated_history: "扣除历史",
            given_history: "赠送历史",
            player: "玩家管理",
            log: "玩家登陆日志",
            score: "玩家分数流水",
            coin: "玩家金币流水",
            all_data_button: "显示全部",
            not_approved_data_button: "显示未通过",
            approved_data_button: "显示已通过",
            to_approve_button: "审批",
            approve_button: "通过",
            refuse_button: "拒绝",
            invalid_button: "显示已过期",
            refused_data_button: "显示已拒绝",
            recharge: "充值",
            exchange: "兑换",
            AccountPage: {
                game_coin_detail: "游戏币分析",
                taste_coin_detail: "体验币分析",
                setting_user: "玩家设置",
                sort_ways: "排序方法",
                sort_by_id: "按id",
                playerRelation: "上下层级",
                sort_by_level: "按等级",
                sort_by_time: "按时间",
                sort_by_gcoin: "游戏币",
                sort_by_tcoin: "体验币",
                table_title: "玩家列表",
                all: "全部列表",
                time: "注册时间",
                detail_button: "详情",
                search_button: "查询",
                high_search: "高级查询",
                detail: "玩家详情",
                delete_account: "刪除玩家",
                deleta_recommend: "删除推广员",
                resetPlayerInfo: '修改玩家信息',
                coin_button: "调整金币",
                player_relation: "玩家关系",
                recharge_history: "充值历史",
                exCharge_history: "兑换历史",
                return_history: "返利历史",
                given_history: "赠送历史",
                confiscated_history: "扣除历史",
                coin_stream: "金币流水",
                coinBlock_stream: "分段金币流水",
                score_stream: "分数流水",
                return_stream: "返利流水",
                recordCurrentCoin: "记录当前金币",
                recharge_exchange_button: "充值兑换",
                reset_pw_button: "重置密码",
                delete_player_button: "删除玩家",
                search_by_account: "通过账号查找",
                search_by_name: "通过昵称查找",
                search_by_recommend: "通过推广员查找",
                search_by_id: "通过id查找",
                search_by_kind: "按类型过滤",
                pleaseAccount: "请输入账号",
                pleaseName: "请输入昵称",
                pleaseRecommend: "请输入推广员账号",
                pleaseId: "请输入ID",
                pleaseKind: "请输入类型",
                your_password: "您的密码：",
                player_account: "您要调整金币的玩家账号",
                new_password: "新的密码",
                again_password: "再次输入密码",
                frozen_button: "禁用",
                thaw_button: "启用",
                correct: "正确性",
                score: "游戏内分数",
                game_info: "状态信息",
                vertify: "流水验证",
                playerInfo: "玩家信息",
                login_time: "最近登录",
                Table: {
                    account: "账号",
                    id: "ID",
                    name: "昵称",
                    level: "等级",
                    status: "状态",
                    recommend: "所属推广员",
                    sex: "性别",
                    head_protrait: "头像",
                    taste_coin: "体验币",
                    taste_coin_detail: "体验币概况",
                    game_coin: "游戏币",
                    game_coin_detail: "游戏币概况",
                    login_time: "最近登录"
                },
                TasteDetail: {
                    total_stake: "总玩",
                    total_win: "总得",
                    total_asked: "体验币总申请"
                },
                highSearchTable: {
                    id: "ID",
                    account: "账号",
                    name: "昵称",
                    level: "等级",
                    status: "状态",
                    recommend: "所属推广员",
                    mobile_phone: "手机号",
                    game_coin: "游戏币",
                    vertify_game_coin: "币流水验证",
                    vertify_game_score: "分流水验证",
                    login_time: "最近登录"
                },
                highSearchNumType: {
                    equal: "等于",
                    lte: "小于或等于",
                    gte: "大于或等于",
                    lt: "小于",
                    gt: "大于"
                },
                highSearchStringType: {
                    equal: "等于字符",
                    exists: "包含字符",
                    noExists: "不包含字符"
                },
                highSearchVerifyType: {
                    "0": "正常",
                    "1": "异常"
                },
                highSearchStatusType: {
                    "0": "正常",
                    "1": "冻结"
                },
                CoinDetail: {
                    total_stake: "总玩",
                    total_win: "总得",
                    total_recharge: "总充值",
                    total_exchange: "总兑换",
                    total_given: "总获得",
                    total_confiscated: "总收回"
                },
                Correct: {
                    1: "正常",
                    2: "游戏中",
                    3: "游戏币异常",
                    4: "体验币异常"
                }
            },
            Info: {
                name: "昵称",
                head_portrait: "头像",
                sex: {
                    "0": "女",
                    "1": "男"
                },
                level: "等级",
                recommend: "推广员",
                mobile_phone: "手机号"
            },
            ChargePage: {
                table_title: "充值列表",
                history_title: "充值历史列表",
                promoter_pw_front: "请输入",
                promoter_pw_back: "的密码",
                approved_order: "通过的订单",
                refused_order: "拒绝的订单",
                Table: {
                    order_id: {
                        name: "订单ID",
                        width: 4,
                    },
                    account: {
                        name: "玩家账号",
                        width: 4,
                    },
                    id: {
                        name: "玩家ID",
                        width: 3,
                    },
                    rmb: {
                        name: "充值金额",
                        width: 4,
                    },
                    recommend: {
                        name: "推广员",
                        width: 4,
                    },
                    approve: {
                        name: "状态",
                        width: 3,
                        resizable: false
                    },
                    remarks: {
                        name: "备注",
                        width: 3,
                    },
                    time: {
                        name: "申请时间",
                        width: 8,
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 8,
                    },
                    end_time: {
                        name: "结束时间",
                        width: 8,
                    },
                }
            },
            ChargeHistoryPage: {
                table_title: "充值列表",
                history_title: "充值历史列表",
                promoter_pw_front: "请输入",
                promoter_pw_back: "的密码",
                approved_order: "通过的订单",
                refused_order: "拒绝的订单",
                Table: {
                    order_id: {
                        name: "订单ID",
                        width: 3
                    },
                    account: {
                        name: "玩家账号",
                        width: 4
                    },
                    id: {
                        name: "玩家ID",
                        width: 3
                    },
                    rmb: {
                        name: "充值金额",
                        width: 4
                    },
                    recommend: {
                        name: "推广员",
                        width: 4
                    },
                    approve: {
                        name: "状态",
                        width: 3
                    },
                    type: {
                        name: "类型",
                        width: 4
                    },
                    remarks: {
                        name: "备注",
                        width: 3
                    },
                    time: {
                        name: "申请时间",
                        width: 7
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 7
                    },
                    end_time: {
                        name: "结束时间",
                        width: 7
                    }
                }
            },
            ReturnHistoryPage: {
                table_title: "充值列表",
                history_title: "充值历史列表",
                promoter_pw_front: "请输入",
                promoter_pw_back: "的密码",
                own: "总返利",
                get_out: "已提取返利",
                get_in: "未提取返利",
                Table: {
                    account: {
                        name: "玩家账号",
                        width: 16
                    },
                    id: {
                        name: "玩家ID",
                        width: 6
                    },
                    get_out: {
                        name: "已提取返利金额",
                        width: 10
                    },
                    time: {
                        name: "提取时间",
                        width: 16
                    }
                }
            },
            PayOrderPage: {
                table_title: "支付订单列表",
                Table: {
                    order_id: {
                        name: "订单号",
                        width: 4
                    },
                    account: {
                        name: "玩家账号",
                        width: 8
                    },
                    id: {
                        name: '玩家ID',
                        width: 4
                    },
                    number: {
                        name: "订单金额",
                        width: 4
                    },
                    actual_number: {
                        name: "实际支付金额",
                        width: 4
                    },
                    status: {
                        name: "状态",
                        width: 4
                    },
                    promoter: {
                        name: "所属推广员",
                        width: 6
                    },
                    pay_platform: {
                        name: "支付平台",
                        width: 4
                    },
                    platform_order_id: {
                        name: "平台订单id",
                        width: 4
                    },
                    time: {
                        name: "支付时间",
                        width: 8
                    },
                    complete_time: {
                        name: "完成时间",
                        width: 8
                    },


                },
                Status: {
                    1: "未完成",
                    2: "已完成",
                },
                Platform: {
                    0: "未选择支付平台",
                    1: "微信",
                    2: "支付宝"
                }
            },
            WXChargePage: {
                table_title: "微信充值列表",
                Table: {
                    out_trade_no:
                    {
                        name: "订单",
                        width: 10
                    },
                    account:
                    {
                        name: "玩家账号",
                        width: 8
                    },
                    id: {
                        name: "玩家ID",
                        width: 4
                    },
                    total_fee:
                    {
                        name: "充值金额(元)",
                        width: 8
                    },
                    status:
                    {
                        name: "状态",
                        width: 4
                    },
                    time:
                    {
                        name: "时间",
                        width: 8
                    },
                    code:
                    {
                        name: "code",
                        width: 4
                    }
                },
                Status: {
                    0: "订单初始化",
                    1: "订单请求成功",
                    2: "统一下单成功",
                    3: "return_code返回失败",
                    4: "result_code返回失败",
                    5: "签名失败",
                    6: "支付成功",
                    7: "支付失败"
                }
            },
            ExchangePage: {
                table_title: "兑换列表",
                history_title: "兑换历史列表",
                promoter_pw_front: "请输入",
                promoter_pw_back: "的密码",
                approved_order: "通过的订单",
                refused_order: "拒绝的订单",
                Table: {
                    exchange_id: {
                        name: "订单ID",
                        width: 4,
                    },
                    account: {
                        name: "玩家账号",
                        width: 4,
                    },
                    id: {
                        name: "玩家ID",
                        width: 3,
                    },
                    coin: {
                        name: "兑换金币",
                        width: 4,
                    },
                    recommend: {
                        name: "推广员",
                        width: 4,
                    },
                    approve: {
                        name: "状态",
                        width: 3,
                        resizable: false
                    },
                    remarks: {
                        name: "备注",
                        width: 3,
                    },
                    time: {
                        name: "申请时间",
                        width: 8,
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 8,
                    },
                    end_time: {
                        name: "结束时间",
                        width: 8,
                    },
                }
            },
            ExchangeHistoryPage: {
                table_title: "兑换列表",
                history_title: "兑换历史列表",
                promoter_pw_front: "请输入",
                promoter_pw_back: "的密码",
                approved_order: "通过的订单",
                refused_order: "拒绝的订单",
                Table: {
                    exchange_id: {
                        name: "订单ID",
                        width: 3,
                    },
                    account: {
                        name: "玩家账号",
                        width: 4,
                    },
                    id: {
                        name: "玩家ID",
                        width: 3,
                    },
                    coin: {
                        name: "兑换金币",
                        width: 4,
                    },
                    recommend: {
                        name: "推广员",
                        width: 4,
                    },
                    approve: {
                        name: "状态",
                        width: 3,
                        resizable: false
                    },
                    type: {
                        name: "类型",
                        width: 4
                    },
                    remarks: {
                        name: "备注",
                        width: 3,
                    },
                    time: {
                        name: "申请时间",
                        width: 7,
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 7,
                    },
                    end_time: {
                        name: "结束时间",
                        width: 7,
                    },
                }
            },
            GivenPage: {
                Table: {
                    order_id: {
                        name: "订单ID",
                        width: 8
                    },
                    account: {
                        name: "玩家账号",
                        width: 8
                    },
                    id: {
                        name: "玩家ID",
                        width: 4
                    },
                    rmb: {
                        name: "赠送金额",
                        width: 8
                    },
                    recommend: {
                        name: "推广员",
                        width: 8
                    },
                    time: {
                        name: "时间",
                        width: 12
                    }
                }
            },
            ConfiscatedPage: {
                Table: {
                    exchange_id: {
                        name: "订单ID",
                        width: 8
                    },
                    account: {
                        name: "玩家账号",
                        width: 8
                    },
                    id: {
                        name: "玩家ID",
                        width: 4
                    },
                    coin: {
                        name: "扣除金额",
                        width: 8
                    },
                    recommend: {
                        name: "推广员",
                        width: 8
                    },
                    time: {
                        name: "时间",
                        width: 12
                    },
                }
            },
            LogPage: {
                search_button: "查询",
                table_title: "玩家登陆日志",
                search_user_log: "用户操作",
                search_config_log: "配置操作",
                search_trade_log: "交易操作",
                search_mosaic_log: "打码操作",
                search_all_log: "全部操作",
                Table: {
                    account: {
                        name: "玩家账号",
                        width: 4
                    },
                    vendoridentfier: {
                        name: "运营商",
                        width: 6
                    },
                    system_version: {
                        name: "系统版本",
                        width: 4
                    },
                    device_model: {
                        name: "设备模型",
                        width: 4
                    },
                    device_name: {
                        name: "设备名",
                        width: 4
                    },
                    device_type: {
                        name: "设备类型",
                        width: 4
                    },
                    device_uniqueidentifier: {
                        name: "设备标识",
                        width: 6
                    },
                    operating_system: {
                        name: "操作系统",
                        width: 4
                    },
                    ip: {
                        name: "登陆IP",
                        width: 6
                    },
                    login_time: {
                        name: "登录时间",
                        width: 6
                    },
                },
            },
            CoinPage: {
                search_button: "查询",
                table_title: "金币流水",
                Table: {
                    coin: {
                        name: "币数",
                        width: 10
                    },
                    flag: {
                        name: "变化量",
                        width: 8
                    },
                    // change_score: "变化量",
                    operation: {
                        name: "玩家操作",
                        width: 4
                    },
                    game: {
                        name: "游戏",
                        width: 4
                    },
                    room: {
                        name: "房间",
                        width: 4
                    },
                    desk: {
                        name: "桌号",
                        width: 4
                    },
                    time: {
                        name: "时间",
                        width: 10
                    },
                    vertify: {
                        name: "正确性",
                        width: 4
                    },
                },
                TableBlock: {
                    beginCoin: {
                        name: "起始币数",
                        width: 6
                    },
                    flag: {
                        name: "变化量",
                        width: 4
                    },
                    endCoin: {
                        name: "结束币数",
                        width: 6
                    },
                    timePeriod: {
                        name: "起止时间",
                        width: 10
                    },
                    score_exchange_coin: {
                        name: "分数折合",
                        width: 4
                    },
                    record_recharge: {
                        name: "充值",
                        width: 4
                    },
                    record_exchange: {
                        name: "兑换",
                        width: 4
                    },
                    record_given: {
                        name: "赠予",
                        width: 4
                    },
                    record_confiscated: {
                        name: "收回",
                        width: 4
                    },
                    record_asked: {
                        name: "申请",
                        width: 4
                    },
                    record_stake: {
                        name: "总玩",
                        width: 4
                    },
                    record_win: {
                        name: "总得",
                        width: 4
                    },
                    record_return: {
                        name: "总返利",
                        width: 4
                    },
                    verify: {
                        name: "正确性",
                        width: 3
                    },
                    statisticsBeginAllCoin: {
                        name: "统计币数",
                        width: 4
                    },
                },
                game_coin: "游戏币",
                taste_coin: "体验币",
                error_stream: "错误流水",
                all_stream: "全部流水",
                add: "+",
                reduce: "-",
                action: {
                    "1000": "开炮",
                    "1001": "捕鱼加分",
                    "1002": "取分",
                    "1003": "兑换",
                    "1004": "存分",
                    "1005": "桌子异常，踢回房间",
                    "1006": "退出游戏",
                    "1007": "不足10000申请",
                    "1008": "充值审批通过",
                    "1009": "拒绝兑换",
                    "1010": "player进程终止",
                    "1011": "断开",
                    "1012": "游戏中长时间未操作",
                    "1013": "兑换超时返还",
                    "1014": "未爆炸炮弹返还",
                    "1015": "管理员发放",
                    "1016": "管理员回收",
                    "1017": "推广员主动充值",
                    "1018": "推广员主动兑换",
                    "1019": "微信支付",
                    "1020": "玩家退出",
                    "1021": "加入游戏超时",
                    "1022": "服务器重启返还",
                    "1023": "庄押注",
                    "1024": "和押注",
                    "1025": "闲押注",
                    "1026": "六狮赢分",
                    "1027": "动物押注",
                    "1028": "续押",
                    "1029": "六狮取消押注",
                    "1030": "押注返还",
                    "1031": "红包掉落",
                    "1032": "关闭桌子返还",
                    "1033": "超出爆机值退出",
                    "1034": "提取返利",
                    "1035": "充值码充值",
                    "1036": "在线充值",
                    "1037": "庄和闲押注"
                }
            },

            ScorePage: {
                search_button: "查询",
                table_title: "分数流水",
                Table: {
                    score: {
                        name: "分数",
                        width: 10
                    },
                    flag: {
                        name: "变化量",
                        width: 8
                    },
                    // change_score: "变化量",
                    operation: {
                        name: "玩家操作",
                        width: 4
                    },
                    game: {
                        name: "游戏",
                        width: 4
                    },
                    room: {
                        name: "房间",
                        width: 4
                    },
                    desk: {
                        name: "桌号",
                        width: 4
                    },
                    time: {
                        name: "时间",
                        width: 10
                    },
                    vertify: {
                        name: "正确性",
                        width: 4
                    },
                },
                game_coin: "游戏币",
                taste_coin: "体验币",
                add: "+",
                reduce: "-",
                action: {
                    "1000": "开炮",
                    "1001": "捕鱼加分",
                    "1002": "取分",
                    "1003": "兑换",
                    "1004": "存分",
                    "1005": "桌子异常，踢回房间",
                    "1006": "退出游戏",
                    "1007": "不足10000申请",
                    "1008": "充值审批通过",
                    "1009": "拒绝兑换",
                    "1010": "player进程终止",
                    "1011": "断开",
                    "1012": "游戏中长时间未操作",
                    "1013": "兑换超时返还",
                    "1014": "未爆炸炮弹返还",
                    "1015": "管理员发放",
                    "1016": "管理员回收",
                    "1017": "推广员主动充值",
                    "1018": "推广员主动兑换",
                    "1019": "微信支付",
                    "1020": "玩家退出",
                    "1021": "加入游戏超时",
                    "1022": "服务器重启返还",
                    "1023": "庄押注",
                    "1024": "和押注",
                    "1025": "闲押注",
                    "1026": "六狮赢分",
                    "1027": "动物押注",
                    "1028": "续押",
                    "1029": "六狮取消押注",
                    "1030": "押注返还",
                    "1031": "红包掉落",
                    "1032": "关闭桌子返还",
                    "1033": "超出爆机值退出",
                    "1034": "提取返利",
                    "1035": "充值码充值",
                    "1036": "在线充值",
                    "1037": "庄和闲押注"
                }
            },

            ReturnPage: {
                Table: {
                    total_return_coin: {
                        name: "返利额",
                        width: 8
                    },
                    add_return_coin: {
                        name: "变化量",
                        width: 8
                    },
                    subordinate_id: {
                        name: "下级_id",
                        width: 4
                    },
                    // change_score: "变化量",
                    subordinate: {
                        name: "下级账号",
                        width: 4
                    },
                    source: {
                        name: "来源",
                        width: 4
                    },
                    game: {
                        name: "游戏",
                        width: 4
                    },
                    room: {
                        name: "房间",
                        width: 4
                    },
                    desk: {
                        name: "桌号",
                        width: 4
                    },
                    time: {
                        name: "时间",
                        width: 8
                    },
                },
            }
        },

        Promoter: {
            title: "推广员数据",
            account: "推广员账号",
            log: "推广员日志",
            profit: '推广员盈利',
            manager: "推广员管理",
            promoter_set: "推广员设置",
            charge: "推广员充值",
            exchange: "推广员兑换",
            to_approve_button: "审批",
            approve_button: "通过",
            refuse_button: "拒绝",
            AccountPage: {
                detail_button: "详情",
                table_title: "推广员日志",
                Table: {
                    id: {
                        name: "推广员ID",
                        width: 4
                    },
                    account: {
                        name: "推广员账号",
                        width: 6
                    },
                    game_coin: {
                        name: "金币",
                        width: 6
                    },
                    leader: {
                        name: "上级",
                        width: 6
                    },
                    bang: {
                        name: "爆机值",
                        width: 6
                    },
                    status: {
                        name: "状态",
                        width: 4
                    },
                    language: {
                        name: "语言",
                        width: 6
                    },
                    time: {
                        name: "注册时间",
                        width: 10
                    }
                },
                bang: "爆机值",
                setBang: "设置爆机值",
                all: "全部列表",
                search_button: "查询",
                forbidden: "禁用",
                normal: "正常",
                new_account: "新增推广员",
                detail: "推广员详情",
                reset_pw_button: "重置密码",
                frozen_button: "禁用",
                thaw_button: "启用",
                delete_button: "删除",
                reset_account: "您要重置的账号",
                delete_account: "您要删除的账号",
                your_password: "您的密码：",
                promoter_account: "推广员账号",
                new_password: "新的密码",
                again_password: "再次输入密码",
                add_button: "新增推广员",
                promoter_password: "推广员密码",
                set_coin_button: "调整金币",
                coin_value: "金币数量，扣除请填入负值",
                coin_value2: "充值金额",
                coin_value3: "兑换金币"
            },
            ChargePage: {
                table_title: "推广员充值列表",
                history_title: "推广员充值历史",
                your_pw: "请输入您的密码",
                Table: {
                    order_id: {
                        name: "订单ID",
                        width: 5
                    },
                    account: {
                        name: "推广员账号",
                        width: 6
                    },
                    id: {
                        name: "推广员ID",
                        width: 3
                    },
                    rmb: {
                        name: "充值金额",
                        width: 4
                    },
                    approve: {
                        name: "状态",
                        width: 3
                    },
                    time: {
                        name: "申请时间",
                        width: 9
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 9
                    },
                    end_time: {
                        name: "结束时间",
                        width: 9
                    }
                }
            },
            ExchangePage: {
                table_title: "推广员兑换列表",
                history_title: "推广员兑换历史",
                your_pw: "请输入您的密码",
                Table: {
                    exchange_id: {
                        name: "订单ID",
                        width: 5
                    },
                    account: {
                        name: "推广员账号",
                        width: 6
                    },
                    id: {
                        name: "推广员ID",
                        width: 3
                    },
                    coin: {
                        name: "兑换金币",
                        width: 4
                    },
                    approve: {
                        name: "状态",
                        width: 3
                    },
                    time: {
                        name: "申请时间",
                        width: 9
                    },
                    invalid_time: {
                        name: "过期时间",
                        width: 9
                    },
                    end_time: {
                        name: "结束时间",
                        width: 9
                    }
                }
            },
            GivenPage: {
                Table: {
                    order_id: {
                        name: "订单ID",
                        width: 8
                    },
                    account: {
                        name: "推广员账号",
                        width: 12
                    },
                    id: {
                        name: "推广员ID",
                        width: 4
                    },
                    rmb: {
                        name: "赠送金币",
                        width: 8
                    },
                    time: {
                        name: "时间",
                        width: 16
                    }
                }
            },
            ConfiscatedPage: {
                Table: {
                    exchange_id: {
                        name: "订单ID",
                        width: 8
                    },
                    account: {
                        name: "推广员账号",
                        width: 12
                    },
                    id: {
                        name: "推广员ID",
                        width: 4
                    },
                    coin: {
                        name: "扣除金币",
                        width: 8
                    },
                    time: {
                        name: "时间",
                        width: 16
                    }
                }
            },
            LogPage: {
                table_title: "推广员日志",
                Table: {
                    account: {
                        name: "推广员账号",
                        width: 8
                    },
                    proto_name: {
                        name: "操作",
                        width: 20
                    },
                    flag: {
                        name: "结果",
                        width: 6
                    },
                    time: {
                        name: "时间",
                        width: 14
                    }
                },
                account: "账号",
            },
            ProfitPage: {
                Table: {
                    id: {
                        name: "推广员ID",
                        width: 5
                    },
                    totalStake: {
                        name: "总玩",
                        width: 9
                    },
                    totalWin: {
                        name: "总得",
                        width: 9
                    },
                    totalProfit: {
                        name: "总盈利",
                        width: 9
                    },
                    time: {
                        name: "时间",
                        width: 16
                    }
                }
            }
        },

        Administrator: {
            title: "管理员数据",
            account: "管理员账号",
            log: "管理员日志",
            adminSet: "管理员设置",
            AccountPage: {
                detail_button: "详情",
                table_title: "管理员列表",
                Table: {
                    id: {
                        name: "id",
                        width: 4,
                        resizable: false
                    },
                    account: {
                        name: "管理员",
                        width: 13,
                        resizable: true
                    },
                    leader: {
                        name: "上级",
                        width: 13,
                        resizable: true
                    },
                    status: {
                        name: "状态",
                        width: 4,
                        resizable: false
                    },
                    language: {
                        name: "语言",
                        width: 6,
                        resizable: false
                    },
                    time: {
                        name: "注册时间",
                        width: 8,
                        resizable: true
                    }
                },
                all: "全部列表",
                search_button: "查询",
                forbidden: "禁用",
                normal: "正常",
                new_account: "新增管理员",
                detail: "管理员详情",
                reset_pw_button: "重置密码",
                frozen_button: "禁用",
                thaw_button: "启用",
                delete_button: "删除",
                reset_account: "您要重置的账号",
                delete_account: "您要删除的账号",
                your_password: "您的密码：",
                new_password: "新的密码",
                again_password: "再次输入密码",
                add_button: "新增管理员",
                administrator_account: "管理员账号",
                administrator_password: "管理员密码"
            },
            LogPage: {
                table_title: "管理员日志",
                Table: {
                    account: "账号",
                    proto_name: "操作",
                    flag: "结果",
                    time: "时间",
                },
                success: "操作成功",
                account: "账号",
            },
        },

        Setting: {
            setting: "设置",
            title: "游戏大厅",
            game: "游戏配置",
            room: "房间设置",
            hall: "大厅配置",
            game_hall: "游戏大厅",
            zone: "分区配置",
            notice: "公告通知",
            server: "服务器配置",
            wx: "参数配置",
            channel: "渠道配置",
            auth: "谷歌认证配置",
            df: "难度系数配置",
            resetStatistics: "清除数据",
            resetPlatform: "平台重置",
            back: "返回",
            nextStep: "下一步",
            submit: "提交",
            reset: "重置",
            finish: "完成",
            rechargeCode: "充值码",
            rechargeCodeStatus: {
                1: "未使用",
                2: "无效",
                3: "已使用"
            },
            reportCode: "报码生成",
            executeCode: "报码验证",
            reportCodeOperate: {
                checkBoxTip: "请先填写参数值,再勾选",
                no_map_operate: "未匹配到相关操作或其他错误",
                desk_room_setting_error: "增加桌子数：设置参数有误",
                draw_water_error: "增加抽水额：设置参数有误",
                func: {
                    recharge_draw_water_coin: "增加抽水额度",
                    set_room_config: "增加房间最大桌数"
                },
                game: {
                    "10": "大厅",
                    "11": "摇钱树",
                    "12": "牛魔王",
                    "14": "幸运六狮",
                    "15": "海盗船"
                },
                room: {
                    "1": "新手练习场",
                    "2": "欢乐竞技场"
                },
                args: {
                    recharge_draw_water_coin: "增加抽水金额：$arg1金币",
                    set_room_config: "$arg1--$arg2--增加房间最大桌数：$arg3"
                },
            },
            GamePage: {
                numericError: "请输入有效数字",
                modify_warning: "注意：修改\"游戏难度\"、\"场地类型\"、\"一币分值\"后，账目清零。",

                0: {
                    game_name: "未在游戏中",
                    room: {
                        0: "0"
                    }
                },
                10: {
                    game_name: "游戏大厅",
                    room: {
                        0: "0"
                    }
                },
                11: {
                    game_name: "摇钱树",
                    account: "玩家账号",
                    name: "用户名",
                    game_coin: "游戏币",
                    taste_coin: "体验币",
                    score: "游戏分值",
                    recommend: "所属推广员",
                    total_play: "总玩",
                    total_win: "总赢",
                    desk_table: {
                        id: "桌号",
                        name: "桌名",
                        room: "所属房间",
                        player_count: "人数",
                        status: "状态"
                    },
                    room: {
                        1: "新手练习场",
                        2: "欢乐竞技场",
                    },
                    game_df: {
                        1: "最容易",
                        2: "容易",
                        3: "难",
                        4: "最难",
                        5: "死难"
                    },
                    hall_type: {
                        1: "小型场地",
                        2: "中型场地",
                        3: "大型场地"
                    },
                    DeskConfig: {
                        name: "桌名",
                        min_coin: "最小携带",
                        consume:
                        {
                            consume_min: "最小炮值",
                            consume_max: "最大炮值"
                        },
                        step: "炮值步长",
                        get_out: "一次取分数",
                        save: "一次存分数",
                        exchange_rate: "一币分值",
                        sort: "排序位置",
                    }
                },
                12: {
                    game_name: "牛魔王",
                    account: "玩家账号",
                    name: "用户名",
                    game_coin: "游戏币",
                    taste_coin: "体验币",
                    score: "游戏分值",
                    recommend: "所属推广员",
                    total_play: "总玩",
                    total_win: "总赢",
                    desk_table: {
                        id: "桌号",
                        name: "桌名",
                        room: "所属房间",
                        player_count: "人数",
                        status: "状态"
                    },
                    room: {
                        1: "新手练习场",
                        2: "欢乐竞技场",
                    },
                    game_df: {
                        1: "最容易",
                        2: "容易",
                        3: "难",
                        4: "最难",
                        5: "死难"
                    },
                    hall_type: {
                        1: "小型场地",
                        2: "中型场地",
                        3: "大型场地"
                    },
                    DeskConfig: {
                        name: "桌名",
                        min_coin: "最小金币数",
                        consume:
                        {
                            consume_min: "最小消费",
                            consume_max: "最大消费"
                        },
                        step: "步长",
                        get_out: "一次取分数",
                        save: "一次存分数",
                        exchange_rate: "一币分值",
                        sort: "排序位置",
                    }
                },
                14: {
                    game_name: "幸运六狮",
                    account: "玩家账号",
                    name: "用户名",
                    game_coin: "游戏币",
                    taste_coin: "体验币",
                    score: "游戏分值",
                    recommend: "所属推广员",
                    total_play: "总玩",
                    total_win: "总赢",
                    table: {
                        innings: {
                            name: "期号",
                            width: 4
                        },
                        time: {
                            name: "开奖时间",
                            width: 8
                        },
                        type: {
                            name: "开奖类型[倍率/送灯数]",
                            width: 8
                        },
                        bonus: {
                            name: "彩金数",
                            width: 4
                        },
                        animal_color: {
                            name: "动物、颜色开奖(倍率)",
                            width: 12
                        },
                        zhx_stake: {
                            name: "庄和闲开奖(倍率)",
                            width: 4
                        },
                        total_stake: {
                            name: "总玩",
                            width: 4,
                            sortable: false
                        },
                        total_win: {
                            name: "总得",
                            width: 4,
                            sortable: false
                        }
                    },
                    type: {
                        1: "普通",
                        2: "彩金",
                        3: "闪电",
                        4: "送灯",
                        5: "动物一条",
                        6: "颜色一条"
                    },
                    animal: {
                        1: "狮子",
                        2: "熊猫",
                        3: "猴子",
                        4: "兔子"
                    },
                    color: {
                        1: "红色",
                        2: "绿色",
                        3: "黄色"
                    },
                    desk_table: {
                        id: "桌号",
                        name: "桌名",
                        room: "所属房间",
                        player_count: "人数",
                        status: "状态"
                    },
                    room: {
                        1: "新手练习场",
                        2: "欢乐竞技场",
                    },
                    animal_rate_type: {
                        1: "固定",
                        2: "动态"
                    },
                    animal_rate_table_type: {
                        46: "46倍组合",
                        68: "68倍组合",
                        78: "78倍组合"
                    },
                    animal_rate: {

                    },
                    all_stake_rate: {

                    },
                    game_df: {
                        1: "最容易",
                        2: "容易",
                        3: "难",
                        4: "最难",
                        5: "死难"
                    },
                    zhx_game_df: {
                        1: "最容易",
                        2: "容易",
                        3: "难",
                        4: "最难",
                        5: "死难"
                    },
                    hall_type: {
                        1: "小型场地",
                        2: "中型场地",
                        3: "大型场地"
                    },
                    animal_zhx: {
                        seat: {
                            name: "座位",
                            width: 2
                        },
                        id: {
                            name: "id",
                            width: 4
                        },
                        bank: {
                            name: "庄",
                            width: 2
                        },
                        tie: {
                            name: "和",
                            width: 2
                        },
                        play: {
                            name: "闲",
                            width: 2
                        },
                        l_r: {
                            name: "狮子|红",
                            width: 2.5
                        },
                        l_g: {
                            name: "狮子|绿",
                            width: 2.5
                        },
                        l_y: {
                            name: "狮子|黄",
                            width: 2.5
                        },
                        p_r: {
                            name: "熊猫|红",
                            width: 2.5
                        },
                        p_g: {
                            name: "熊猫|绿",
                            width: 2.5
                        },
                        p_y: {
                            name: "熊猫|黄",
                            width: 2.5
                        },
                        m_r: {
                            name: "猴子|红",
                            width: 2.5
                        },
                        m_g: {
                            name: "猴子|绿",
                            width: 2.5
                        },
                        m_y: {
                            name: "猴子|黄",
                            width: 2.5
                        },
                        r_r: {
                            name: "兔子|红",
                            width: 2.5
                        },
                        r_g: {
                            name: "兔子|绿",
                            width: 2.5
                        },
                        r_y: {
                            name: "兔子|黄",
                            width: 2.5
                        },
                        stake: {
                            name: "总玩",
                            width: 3
                        },
                        win: {
                            name: "总得",
                            width: 3
                        }
                    },
                    DeskConfig: {
                        name: "桌名",
                        min_coin: "最小携带",
                        stake_time: "押注时间",
                        get_out: "一次取分数",
                        save: "一次存分数",
                        exchange_rate: "一币分值",
                        sort: "排序位置",
                        min_stake: "动物最小押注",
                        max_stake: "动物最大押注",
                        animal_rate_type: "赔率表模式",
                        animal_rate_table_type: "赔率表类型",
                        game_df: "动物难度",
                        zhx_game_df: "庄和闲难度",
                        hall_type: "场地类型",
                        zhx_min_max_stake: {
                            min: "庄和闲最小押注",
                            max: {
                                bank_play: "庄闲最大押注",
                                tie: "和最大押注"
                            }
                        }
                    }
                },
                15: {
                    game_name: "海盗船",
                    account: "玩家账号",
                    name: "用户名",
                    game_coin: "游戏币",
                    taste_coin: "体验币",
                    score: "游戏分值",
                    recommend: "所属推广员",
                    total_play: "总玩",
                    total_win: "总赢",
                    desk_table: {
                        id: "桌号",
                        name: "桌名",
                        room: "所属房间",
                        player_count: "人数",
                        status: "状态"
                    },
                    room: {
                        1: "新手练习场",
                        2: "欢乐竞技场",
                    },
                    game_df: {
                        1: "最容易",
                        2: "容易",
                        3: "难",
                        4: "最难",
                        5: "死难"
                    },
                    hall_type: {
                        1: "小型场地",
                        2: "中型场地",
                        3: "大型场地"
                    },
                    DeskConfig: {
                        name: "桌名",
                        min_coin: "最小金币数",
                        consume:
                        {
                            consume_min: "最小消费",
                            consume_max: "最大消费"
                        },
                        step: "步长",
                        get_out: "一次取分数",
                        save: "一次存分数",
                        exchange_rate: "一币分值",
                        sort: "排序位置",
                    }
                },
            },
            HallPage: {
                change_warning: "修改大厅配置，将立刻生效，影响当前服务器。您确定要修改么？",
                add_warning: "新增大厅配置，将立刻生效，影响当前服务器。",
                certain_setting: "警告:修改大厅配置",
                change_setting: "修改大厅配置",
                add_dialog_tilte: "新增大厅配置",
                delete_dialog_tilte: "删除大厅配置",
                change_dialog_tilte: "修改大厅配置",
                add_new_key: "新增配置key",
                add_new_value: "新增配置value",
                delete_warning: "删除大厅配置，将立刻生效，影响当前服务器。确定删除么？",
                Table: {
                    activity_name: "activity_name",
                    app_protoid: "app_protoid",
                    app_version: "app_version",
                    download: "download",
                    id: "id",
                    package_name: "package_name",
                    hotupdate_url: "hotupdate_url",
                    sort_id: "sort_id",
                    terminal: "terminal"
                },
                HallConfig: {
                    terminal: "terminal",
                    id: "id",
                    activity_name: "activity_name",
                    app_protoid: "app_protoid",
                    app_version: "app_version",
                    download: "download",
                    package_name: "package_name",
                    hotupdate_url: "hotupdate_url",
                    sort_id: "sort_id",
                }
            },
            ServerPage: {
                table_title: "服务器配置",
                change_warning: "修改服务器参数，将立刻生效，影响当前服务器。您确定要修改么？",
                add_warning: "新增服务器参数，将立刻生效，影响当前服务器。",
                certain_setting: "警告:修改配置",
                change_setting: "修改配置",
                add_dialog_tilte: "新增服务器参数",
                change_dialog_tilte: "修改服务器参数",
                delete_dialog_tilte: "删除服务器参数",
                add_new_key: "新增配置key",
                add_new_value: "新增配置value",
                add_new_type: "新增配置type",
                delete_warning: "删除服务器参数，将立刻生效，影响当前服务器。确定删除么？",
                Table: {
                    k: "key",
                    v: "value"
                },
                ServerConfig: {

                }
            },
            RoomPage: {
                detail_dialog_title: "您要修改的房间为:"
            },
            NoticePage: {
                "1000": { "type": 1000, "content": "你于~p成功提交充值~p元申请，祝您游戏愉快！" },
                "1001": { "type": 1001, "content": "你于~p成功提交兑换~p元申请，祝您游戏愉快！" },
                "1002": { "type": 1002, "content": "你于~p申请充值~p元，充值成功，祝您游戏愉快！" },
                "1003": { "type": 1003, "content": "你于~p申请兑换~p元，兑换成功，祝您游戏愉快！" },
                "1004": { "type": 1004, "content": "你于~p申请充值~p元，充值失败，请再次充值！" },
                "1005": { "type": 1005, "content": "你于~p申请兑换~p元，兑换失败，请再次兑换！" },
                "1006": { "type": 1006, "content": "1,欢迎|欢迎" },
                "1007": { "type": 1007, "content": "您于~p的充值申请因推广员业务繁忙未能及时审批已经过时，如有需要请再次充值，给您造成的不便深表歉意。" },
                "1008": { "type": 1008, "content": "您于~p的兑换申请因推广员业务繁忙未能及时审批已经过时，如有需要请再次兑换，给您造成的不便深表歉意。" },
                "1009": { "type": 1009, "content": "您于~p收到管理员发放的~p金币。" },
                "1010": { "type": 1010, "content": "您于~p被管理员收回~p的金币。" },
                "1011": { "type": 1011, "content": "您的推广员于~p为您充值~p元。" },
                "1012": { "type": 1012, "content": "您的推广员于~p为您兑换~p金币。" }
            },
            AuthPage: {
                create_button: "生成随机秘钥",
                use_button: "使用新秘钥",
            },
            DfPage: {
                game_df: "游戏难度",
                df_coefficient: "难度系数"
            },
            WXPage: {
                wx: "微信参数",
                tree: "摇钱树配置",
                bull: "牛魔王配置",
                lion: "幸运六狮配置",
                pirate: "海盗船配置",
                return_coin: "返利配置",
                pay_proxy: "在线充值配置"
            }
        },

        Vender: {
            title: "工厂设置",
            reset: "数据重置",
            hall_state: "大厅开关",
            profit: "盈利设置",
            export: "导出",
            server: "服务器操作",
            factor: {
                title: "游戏设置",
                fish: "摇钱树",
                bull: "牛魔王",
                lion: "幸运六狮",
                pirate: "海盗船"
            }
        },

        Coin: {
            title: "充值兑换",
            operation: "提交申请",
            chargeHistory: "我的充值记录",
            exchangeHistory: "我的兑换记录",
            operationPage: {

            },
            ChargePage: {
                table_title1: "正在进行中的充值",
                table_title2: "历史有效充值",
            },
            ExchangePage: {
                table_title1: "正在进行中的兑换",
                table_title2: "历史有效兑换",
            }
        },

        Tool: {
            title: "管理员工具",
            webSocket: "测试webSocket",
            protocol: "测试协议",
            log: "管理员日志",
            LoginPage: {
                login_button: "登陆",
            },

        },

        Release: {
            title: "发布",
            update: "游戏更新",
            deploy: "游戏发布",
        },
        Server: {
            title: "服务器管理",
            serverlist: "服务器管理",
            processlist: "进程管理"
        },
        System: {
            title: "系统管理",
            serverlist: "服务器列表",

        },
        game_setting: {
            title: "平台重置"
        },
        Log: {
            title: "管理员日志",
            table_title: "推广员日志",
            account: "账号",
            status: "状态",
            proto_name: "操作",
            flag: "结果",
            time: "时间"
        },
        Statistics: {
            title: "统计数据",
            detail: "大厅概况",
            desks: "游戏概况",
            player: "玩家数据",

            Player: {
                dailytotal: "今日概况",
                dnudau: "新增活跃",
                retain: "留存",
                awake: "日启动",
                playtime: "游戏时长",
            },
            Game: {
                hall: "大厅",
                fish: "摇钱树",
                bull: "牛魔王",
                lion: "幸运六狮",
                pirate: "海盗船"
            }
        },
        TableCommon: {
            boy: "男",
            girl: "女",
            forbidden: "禁用",
            normal: "正常",
            approving: "待审批",
            approved: "通过",
            refuse: "拒绝",
            invalid: "过期无效",
        },
        LogMap: {
            $game: {
                "10": "大厅",
                "11": "摇钱树",
                "12": "牛魔王",
                "14": "幸运六狮",
                "15": "海盗船"
            },
            $action: {
                flow: "启用",
                frozen: "禁用"
            },
            $type: {
                "1": "管理员",
                "2": "推广员",
                "3": "玩家",
            },
            $state: {
                "1": "开启",
                "2": "关闭",
            },
            query_game_status_c2s: "查询游戏开关状态",
            change_game_status_c2s: "改变游戏$game状态为$state",
            get_hall_score_c2s: "查询大厅详情",
            query_lion_record_c2s: "查询六狮$room号房间桌子$desk的开奖结果",
            query_promoter_statistics_c2s: "查询了总盈利情况",
            query_recharged_c2s: {
                1: "查询所有玩家充值",
                2: "查询了自己所属玩家的充值",
                3: "查询$recommend的所属玩家充值"
            },
            query_exchange_c2s: {
                1: "查询所有玩家兑换",
                2: "查询了自己所属玩家的兑换",
                3: "查询$recommend的所属玩家兑换"
            },
            approve_recharge_c2s: {
                1: "通过$approver的$order订单$value元的充值申请",
                2: "通过$approver的$order订单"
            },
            approve_exchange_c2s: {
                1: "通过$approver的$order订单$value金币的兑换申请",
                2: "通过$approver的$order订单"
            },
            refuse_recharge_c2s: {
                1: "拒绝$refuser的$order订单$value元的充值申请",
                2: "拒绝$refuser的充值申请订单$order"
            },
            refuse_exchange_c2s: {
                1: "拒绝$refuser的$order订单$value金币的兑换申请",
                2: "拒绝$refuser的兑换申请订单$order"
            },
            recharge_player_c2s: {
                1: "赠与玩家$account 金币$value",
                2: "为玩家$account充值$value元",
                3: "赠与玩家$account金币 该玩家不存在"
            },
            exchange_player_c2s: {
                1: "收回玩家$account 金币$value",
                2: "为玩家$account兑换$value金币",
                3: "收回玩家$account金币 该玩家不存在"
            },
            generate_recharge_code_c2s: "管理员$account生成了$number条$coin金币的充值码",
            download_recharge_code_c2s: "管理员$account生成了$count条充值码的下载信息",
            invalid_recharge_code_c2s: "管理员$account无效了$count条充值码",

            query_wx_order_c2s: "查询微信充值",
            query_players_recharge_c2s: "查询所属玩家充值",
            query_players_exchange_c2s: "查询所属玩家兑换",
            query_player_recharge_c2s: "查询$account的充值记录",
            query_player_exchange_c2s: "查询$account的兑换记录",
            refuse_promoter_recharge_c2s: {
                1: "拒绝推广员$account的$order订单$value元的充值申请",
                2: "拒绝推广员$account的充值订单$order"
            },
            refuse_promoter_exchange_c2s: {
                1: "拒绝推广员$account的$order订单$value金币的兑换申请",
                2: "拒绝推广员$account的兑换订单$order"
            },
            approve_promoter_recharge_c2s: {
                1: "通过推广员$account的$order订单$value元的充值申请",
                2: "通过推广员$account的充值订单$order"
            },
            approve_promoters_exchange_c2s: {
                1: "通过推广员$account的$order订单$value金币的兑换申请",
                2: "通过推广员$account的兑换订单$order"
            },
            recharge_promoter_c2s: "为推广员$account充值$value元人民币",
            exchange_promoter_c2s: "为推广员$account兑换$value金币",
            promoter_to_recharge_c2s: "推广员$account申请充值$value元",
            promoter_to_exchange_c2s: "推广员$account申请兑换$value金币",
            query_promoter_recharge_c2s: {
                1: "查询所有推广员的充值",
                2: "查询了推广员$account的充值"
            },
            query_promoter_exchange_c2s: {
                1: "查询所有推广员的兑换",
                2: "查询了推广员$account的兑换"
            },
            query_promoter_recharge_history_c2s: {
                2: "查询了推广员$account历史赠送",
                1: "查询了推广员$account历史充值",
            },
            query_promoter_exchange_history_c2s: {
                2: "查询了推广员$account历史收回",
                1: "查询了推广员$account历史兑换"
            },
            query_return_history_c2s: "查询返还历史",
            query_pay_order_c2s: "查询支付订单",
            recharge_allowed_c2s: { 1: "开启平台充值", 2: "关闭平台充值" },
            exchange_allowed_c2s: { 1: "开启平台兑换", 2: "关闭平台兑换" },
            reset_ranking_c2s: "重置排行榜",
            query_hall_c2s: "查询大厅配置",
            change_hall_config_c2s: "修改大厅配置",
            add_hall_config_c2s: "增加大厅terminal:$terminal,id:$id",
            delete_hall_config_c2s: "删除大厅terminal:$terminal,id:$id",
            query_server_args_config_c2s: "查询服务器配置",
            change_server_args_config_c2s: "修改服务器配置",
            add_server_args_config_c2s: "增加服务器配置",
            delete_server_args_config_c2s: "删除服务器配置",
            query_game_desk_c2s: "查询游戏$game的桌子",
            add_one_desk_c2s: "为游戏$game的$room房间增加新桌子$desk",
            add_lion_desk_c2s: "为游戏$game的$room房间增加新桌子$desk",
            modify_desk_c2s: "修改游戏$game的$room号房间桌子$desk",
            modify_lion_desk_c2s: "修改游戏$game的$room号房间桌子$desk",
            reduce_desk_c2s: "删除游戏$game的$room号房间桌子$desk",
            desk_set_state_c2s: "$state游戏$game的$room号房间桌子$desk",
            get_hall_notice_c2s: "查询大厅公告",
            set_hall_notice_c2s: {
                1: "设置大厅公告为:$content",
                2: "设置大厅公告支付宝账号为:$zfb",
                3: "设置大厅公告微信账号为:$wx"
            },
            query_game_args_config_c2s: "查询游戏参数",
            change_game_args_config_c2s: "修改游戏参数",
            add_game_args_config_c2s: "增加游戏参数",
            delete_game_args_config_c2s: "删除游戏参数",
            desk_draw_water_c2s: "对$game的$room号房间桌子$desk抽水$coin金币",
            get_google_auth_key_c2s: "查询谷歌参数",
            new_google_auth_key_c2s: "生成新的谷歌参数",
            get_desk_df_c2s: "查询桌子难度系数",
            set_desk_df_c2s: "设置桌子难度系数",
            desk_score_clean_c2s: "游戏$game房间$room桌子$desk清零",
            single_desk_c2s: "重新请求了游戏$game房间$room桌子$desk的数据",
            start_new_game_c2s: "开启新游戏$game",
            delete_recharge_return_coin_c2s: "删除充值返利等级$class的设置",
            set_recharge_return_coin_c2s: {
                1: "设置等级$class的充值返利$number返还$return_coin",
                2: "新建等级$class的充值返利"
            },

            query_players_c2s: {

                1: "查询所有玩家",
                2: "查询$account所属玩家"
            },
            reset_player_info_c2s: "修改玩家$account的基本信息",
            modify_player_c2s: "修改玩家$account的密码",
            query_player_log_c2s: "查询玩家$account的登录日志",
            query_score_stream_c2s: "查询玩家$account的分数流水",
            delete_player_c2s: "刪除$account账号",
            query_coin_stream_c2s: "查询玩家$account的金币流水",
            coin_stream_block_c2s: "查询$account分段金币流水",
            coin_stream_block_s2c: "查询$account分段金币流水",
            remark_player_vertify_c2s: "恢复$account流水正常",
            print_player_coin_log_c2s: "记录玩家$account当前金币情况",
            regist_promoter_c2s: "注册推广员$account",
            promoter_login_c2s: "推广员登录",
            query_return_stream_c2s: "查询$account的返利流水",
            query_promoter_c2s: {
                1: "查询推广员信息",
                2: "查找了推广员$account的信息"
            },
            admin_login_c2s: "管理员登陆",
            query_admin_log_c2s: { 1: "查询管理员$account日志", 2: "查询全部管理员日志" },
            query_promoter_log_c2s: "查询推广员$account日志",
            regist_administrater_c2s: "注册管理员$account",
            delete_administrater_c2s: "删除管理员$account",
            delete_promoter_c2s: "删除推广员$account",
            reset_administrater_c2s: "重置了管理员$account密码",
            reset_promoter_c2s: "重置了推广员$account密码",
            query_administraters_c2s: {
                1: "查询管理员",
                2: "查找了管理员$account的信息"
            },
            frozen_account_c2s: "$action了$type$account的账号",
            admin_login_auth_c2s: "管理员$account登录",
            promoter_login_auth_c2s: "推广员$account登录",
            manager_login_auth_c2s: "管理者登录",
            user_log_out_c2s: "$account 登出",
            drop_link_c2s: "$account 关闭页面",
            query_sessions_c2s: "查询了$account 所有登录",
            set_promoter_bang_c2s: "设置最大爆机值为$bang",

            execute_code_c2s: "执行$func,$passed",
            undefined_proto: "号协议,未定义语言"
        },
        ErrorCode: {
            0: "成功",
            11000: "不存在所选桌子",
            11001: "已存在所选桌子",
            11002: "请先登录",
            11003: "您没有相应的权限",
            11004: "删除失败",
            11005: "账号被禁用",
            11006: "充值金额错误",
            11007: "桌子已经开启",
            11008: "桌子已经关闭",
            11009: "充值订单已过期",
            11010: "兑换申请已过期",
            11011: "没有相关数据了",
            11012: "已经到头了",
            11013: "已经处理过该充值订单",
            11014: "已经处理过该兑换申请",
            11015: "推广员金币不足",
            11016: "该配置已经存在",
            11017: "该配置不存在",
            11018: "该大厅已经存在",
            11019: "大厅不存在",
            11020: "账号失效",
            11021: "验证码错误",
            11022: "您的自动登录已失效",
            11023: "尝试次数过多,请稍后再试",
            11024: "玩家正在游戏中",
            11025: "桌子已达房间最大上限",
            11026: "金额超出了最大上限",
            11027: "您的账号在其他位置登录",
            11028: "输入的头像序号有误",
            11029: "输入的性别错误",
            11030: "输入的等级超出范围",
            11031: "大厅被厂家平台禁用",
            11032: "自动关闭失败",
            11033: "玩家已爆机",
            11034: "爆机值无效",
            11035: "重置前请确保大厅关闭,并保持关闭",
            11036: "所查认证还未设置",
            11037: "协议缓冲加密失败",
            11038: "协议缓冲解密失败",
            11039: "密文长度不足",
            11040: "检验没有通过",
            11041: "密文填充错误",
            11042: "执行码已过期无效",
            11043: "输入的抽水金额有误",
            11044: "抽水额度超出,请申请扩大抽水额度",
            11045: "密文格式错误",
            11046: "该桌已经开启",
            11047: "密码类型错误",
            11048: "部分座位没有执行抽水",
            11049: "数量超出上限",
            11050: "修改充值返回设置失败",
            11051: "设置的值不可为负数",
            11502: "删除充值返回金币失败",
            10014: "您的游戏币不足",
            10020: "两次输入密码不一致",
            10021: "帐号已存在",
            10022: "推荐人帐号不可为空",
            10023: "账号不存在或已被删除",
            10024: "密码错误",
            10025: "充值订单号不存在",
            10026: "上次充值还未批准",
            10027: "兑换订单号不存在",
            10028: "上次兑换还未批准",
            10029: "帐号长度非法",
            10030: "帐号只能包含字母、数字、下划线",
            10031: "昵称过长",
            10032: "密码长度非法",
            10033: "密码过于简单，请包含字母、数字",
            10037: "该桌还有玩家，不可关闭",
            10047: "请先关闭该桌子",
            10070: "请输入正确的手机号码",
            10074: "该推广员账号不存在",
            99005: "没有相关数据",
            99006: "您选择的时间有误",
            99007: "查询账号不能为空",
            99008: "请检查网络",
            99009: "该玩家在这段时间没有记录",
            99010: "玩家金币不足",
            99011: "推广员金币不足",
            99012: "输入的金额错误",
            99013: "输入的金币数错误",
            99014: "请输入有效数字",
            99015: "标题中不能包含 | 字符",
            99016: "谷歌验证码不能为空",
            99017: "填入数据格式有错",
            99018: "请确保设置的服务器地址正确且运行正常",
            99019: "桌子名不得超过五个汉字",
            99020: "最大炮值超过上限",
            99021: "输入数字有误",
            99022: "单笔交易不得超出100000",
            99023: "请输入一个整数值",
            99024: "设置的值不得为负数",
            99025: "设置的最小押注不能超过最大押注",
            99026: "设置抽水值过大,不能超过最大抽水值"
        }
    }
}
export default Language;