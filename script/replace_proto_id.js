var fs = require('fs');

var Replace = { "9501": "data_reset_cmd_c2s", "9502": "data_reset_cmd_s2c", "9503": "set_hall_state_c2s", "9504": "set_hall_state_s2c", "9505": "set_max_profit_c2s", "9506": "set_max_profit_s2c", "9507": "export_players_c2s", "9508": "export_players_s2c", "9509": "self_destruct_c2s", "9510": "self_destruct_s2c", "9511": "change_fish_factor_c2s", "9512": "change_fish_factor_s2c", "9513": "query_fish_factor_c2s", "9514": "query_fish_factor_s2c", "9598": "get_vender_auth_c2s", "9599": "get_vender_auth_s2c", "9601": "get_hall_score_c2s", "9602": "get_hall_score_s2c", "9603": "query_player_statistics_c2s", "9604": "query_player_statistics_s2c", "9605": "query_desk_score_info_c2s", "9606": "query_desk_score_info_s2c", "9607": "query_promoter_statistics_c2s", "9608": "query_promoter_statistics_s2c", "9609": "query_retention_player_statistics_c2s", "9610": "query_retention_player_statistics_s2c", "9611": "query_promoter_total_statistics_c2s", "9612": "clean_statistics_c2s", "9613": "clean_statistics_s2c", "9614": "query_seat_score_info_c2s", "9615": "query_seat_score_info_s2c", "9705": "query_recharged_c2s", "9706": "query_recharged_s2c", "9707": "query_exchange_c2s", "9708": "query_exchange_s2c", "9709": "approve_recharge_c2s", "9710": "approve_recharge_s2c", "9711": "approve_exchange_c2s", "9712": "approve_exchange_s2c", "9713": "refuse_recharge_c2s", "9714": "refuse_recharge_s2c", "9715": "refuse_exchange_c2s", "9716": "refuse_exchange_s2c", "9717": "recharge_player_c2s", "9718": "recharge_player_s2c", "9719": "exchange_player_c2s", "9720": "exchange_player_s2c", "9721": "query_wx_order_c2s", "9722": "query_wx_order_s2c", "9723": "cancel_exchange_c2s", "9724": "cancel_exchange_s2c", "9729": "query_players_recharge_c2s", "9730": "query_players_exchange_c2s", "9731": "query_player_recharge_c2s", "9732": "query_recharged_history_s2c", "9733": "query_player_exchange_c2s", "9734": "query_exchange_history_s2c", "9743": "refuse_promoter_recharge_c2s", "9744": "refuse_promoter_recharge_s2c", "9745": "refuse_promoter_exchange_c2s", "9746": "refuse_promoter_exchange_s2c", "9747": "approve_promoter_recharge_c2s", "9748": "approve_promoter_recharge_s2c", "9749": "approve_promoters_exchange_c2s", "9750": "approve_promoters_exchange_s2c", "9777": "recharge_promoter_c2s", "9778": "recharge_promoter_s2c", "9779": "exchange_promoter_c2s", "9780": "exchange_promoter_s2c", "9781": "promoter_to_recharge_c2s", "9782": "promoter_to_recharge_s2c", "9783": "promoter_to_exchange_c2s", "9784": "promoter_to_exchange_s2c", "9785": "query_promoter_recharge_c2s", "9786": "query_promoter_recharge_s2c", "9787": "query_promoter_exchange_c2s", "9788": "query_promoter_exchange_s2c", "9789": "query_promoter_recharge_history_c2s", "9790": "query_promoter_recharge_history_s2c", "9791": "query_promoter_exchange_history_c2s", "9792": "query_promoter_exchange_history_s2c", "9801": "query_hall_c2s", "9802": "query_hall_s2c", "9803": "change_hall_config_c2s", "9804": "change_hall_config_s2c", "9805": "add_hall_config_c2s", "9806": "add_hall_config_s2c", "9807": "delete_hall_config_c2s", "9808": "delete_hall_config_s2c", "9809": "query_server_args_config_c2s", "9810": "query_server_args_config_s2c", "9811": "change_server_args_config_c2s", "9812": "change_server_args_config_s2c", "9813": "add_server_args_config_c2s", "9814": "add_server_args_config_s2c", "9815": "delete_server_args_config_c2s", "9816": "delete_server_args_config_s2c", "9817": "query_game_desk_c2s", "9818": "query_game_desk_s2c", "9819": "add_one_desk_c2s", "9820": "reduce_desk_c2s", "9821": "modify_desk_c2s", "9822": "desk_modify_result_s2c", "9823": "desk_set_state_c2s", "9824": "desk_set_state_s2c", "9825": "get_hall_notice_c2s", "9826": "get_hall_notice_s2c", "9827": "set_hall_notice_c2s", "9828": "set_hall_notice_s2c", "9829": "query_game_args_config_c2s", "9830": "query_game_args_config_s2c", "9831": "change_game_args_config_c2s", "9832": "change_game_args_config_s2c", "9833": "add_game_args_config_c2s", "9834": "add_game_args_config_s2c", "9835": "delete_game_args_config_c2s", "9836": "delete_game_args_config_s2c", "9845": "get_google_auth_key_c2s", "9846": "get_google_auth_key_s2c", "9847": "new_google_auth_key_c2s", "9848": "new_google_auth_key_s2c", "9849": "set_google_auth_key_c2s", "9850": "set_google_auth_key_s2c", "9851": "get_desk_df_c2s", "9852": "get_desk_df_s2c", "9853": "set_desk_df_c2s", "9854": "set_desk_df_s2c", "9855": "get_room_config_c2s", "9856": "get_room_config_s2c", "9857": "set_room_config_c2s", "9858": "set_room_config_s2c", "9859": "query_game_status_c2s", "9860": "query_game_status_s2c", "9861": "change_game_status_c2s", "9862": "change_game_status_s2c", "9863": "reset_ranking_c2s", "9864": "reset_ranking_s2c", "9865": "recharge_allowd_c2s", "9866": "exchange_allowd_c2s", "9867": "trade_allowd_s2c", "9894": "desk_score_clean_c2s", "9895": "desk_score_clean_s2c", "9896": "single_desk_c2s", "9897": "single_desk_s2c", "9898": "start_new_game_c2s", "9899": "start_new_game_s2c", "9901": "query_players_c2s", "9902": "query_players_s2c", "9921": "reset_player_info_c2s", "9922": "reset_player_info_s2c", "9923": "modify_player_c2s", "9924": "modify_player_s2c", "9925": "query_player_log_c2s", "9926": "query_player_log_s2c", "9927": "query_score_stream_c2s", "9928": "query_score_stream_s2c", "9929": "delete_player_c2s", "9930": "delete_player_s2c", "9931": "query_coin_stream_c2s", "9932": "query_coin_stream_s2c", "9933": "coin_stream_block_c2s", "9934": "coin_stream_block_s2c", "9935": "remark_player_vertify_c2s", "9936": "remark_player_vertify_s2c", "9937": "print_player_coin_log_c2s", "9938": "print_player_coin_log_s2c", "9939": "remove_operate_log_c2s", "9940": "remove_operate_log_s2c", "9941": "set_promoter_bang_c2s", "9942": "set_promoter_bang_s2c", "9951": "regist_promoter_c2s", "9952": "regist_promoter_s2c", "9953": "promoter_login_c2s", "9954": "promoter_login_s2c", "9955": "query_promoter_c2s", "9956": "query_promoter_s2c", "9957": "admin_login_c2s", "9958": "admin_login_s2c", "9959": "query_admin_log_c2s", "9960": "query_admin_log_s2c", "9961": "query_promoter_log_c2s", "9962": "query_promoter_log_s2c", "9963": "regist_administrater_c2s", "9964": "regist_administrater_s2c", "9965": "delete_administrater_c2s", "9966": "delete_administrater_s2c", "9967": "delete_promoter_c2s", "9968": "delete_promoter_s2c", "9969": "reset_administrater_c2s", "9970": "reset_administrater_s2c", "9971": "reset_promoter_c2s", "9972": "reset_promoter_s2c", "9973": "query_administraters_c2s", "9974": "query_administraters_s2c", "9975": "frozen_account_c2s", "9976": "frozen_account_s2c", "9977": "admin_login_auth_c2s", "9978": "promoter_login_auth_c2s", "9979": "manager_login_auth_c2s", "9980": "user_log_out_c2s", "9981": "user_log_out_s2c", "9982": "drop_link_c2s", "9983": "vender_login_auth_c2s", "9984": "user_login_s2c", "9985": "session_login_c2s", "9994": "query_sessions_c2s", "9995": "query_sessions_s2c", "9996": "polling_message_c2s", "9997": "polling_message_s2c", "9998": "push_notifications_s2c", "9999": "error_not_login_s2c" };

// const files_dir = "../src/app/components/pages/";
const files_dir = "../src/app/components/components/Master.js";

var file_total = 0;
var fix_total = 0;

var digFileDir = (dir) => {
    fs.readdir(dir, function (err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach(function (item) {
            if (item.includes(".js")) {
                fs.readFile(dir + "/" + item, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    var fromIndex = 0;
                    var dataString = "";
                    var protos = "";
                    if (data.includes(".emit(")) {
                        console.log(dir + "/" + item);

                        dataString = data.toString();
                        protos = "";

                        fromIndex = 0;
                        while (fromIndex < dataString.length && fromIndex !== -1) {
                            var string_index = dataString.indexOf(".emit(", fromIndex + 6);
                            fromIndex = string_index;
                            if (fromIndex === -1) {
                                break;
                            }
                            var id = dataString.slice(string_index + 6, string_index + 10);
                            console.log(Number(id));
                            if (Replace[id] !== undefined) {
                                console.log(Replace[id]);
                                dataString = dataString.replace(id, Replace[id].toUpperCase());
                                if (!protos.includes(Replace[id].toUpperCase())) {
                                    protos += Replace[id].toUpperCase() + ","
                                }
                            }
                        }
                        fromIndex = 0;
                        while (fromIndex < dataString.length && fromIndex !== -1) {
                            var string_index = dataString.indexOf("(id === ", fromIndex + 8);
                            fromIndex = string_index;
                            if (fromIndex === -1) {
                                break;
                            }
                            var id = dataString.slice(string_index + 8, string_index + 12);
                            console.log(Number(id));
                            if (Replace[id] !== undefined) {
                                console.log(Replace[id]);
                                dataString = dataString.replace(id, Replace[id].toUpperCase());
                                if (!protos.includes(Replace[id].toUpperCase())) {
                                    protos += Replace[id].toUpperCase() + ","
                                }
                            }
                        }
                        fromIndex = 0;
                        while (fromIndex < dataString.length && fromIndex !== -1) {
                            var string_index = dataString.indexOf("(id !== ", fromIndex + 8);
                            fromIndex = string_index;
                            if (fromIndex === -1) {
                                break;
                            }
                            var id = dataString.slice(string_index + 8, string_index + 12);
                            console.log(Number(id));
                            if (Replace[id] !== undefined) {
                                console.log(Replace[id]);
                                dataString = dataString.replace(id, Replace[id].toUpperCase());
                                if (!protos.includes(Replace[id].toUpperCase())) {
                                    protos += Replace[id].toUpperCase() + ","
                                }
                            }
                        }
                        console.log(protos);
                        var newFile = "import {" + protos + "} from \"../../../../proto_enum\";\r\n" + dataString;

                        fs.writeFile(dir + "/" + item, newFile, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }


                });
                // console.log(item);
                // console.log(file_total++);
                // console.log(data);

            } else {
                digFileDir(dir + "/" + item);
            }


        });
    });
}

digFileDir(files_dir);