var TWEEN = require("tween.js");

var Util = {
    lion: {
        get_by_animal_color: (animal_color) => {
            var a_c_temp = animal_color.split("_");
            var animals = ["l", "p", "m", "r"];
            var colors = ["r", "g", "y"];
            return { animal: animals.indexOf(a_c_temp[0]) + 1, color: colors.indexOf(a_c_temp[1]) + 1 }
        },
        get_animal_color: (info) => {
            var animals = ["l", "p", "m", "r"];
            var colors = ["r", "g", "y"];
            return animals[info.animal - 1] + "_" + colors[info.color - 1];
        },
        player_stake: (players) => {
            var score = 0;
            var key;
            for (key in players) {
                if (key !== "seat" && key !== "id" && key !== "bank_rate"
                    && key !== "tie_rate" && key !== "play_rate") {
                    score += players[key]
                }
            }
            return score;
        },
        player_win: (data, player_index) => {
            var rates = {};
            var score = 0;
            var player = data.players[player_index];
            for (var rate = 0; rate < data.animal_rate.length; rate++) {
                rates[Util.lion.get_animal_color(data.animal_rate[rate])] = data.animal_rate[rate].rate;
            }
            // 动物开奖
            if (data.type[0] === 2) {
                // score += data.bonus;
                a_c = Util.lion.get_animal_color(data.result[0]);
                if (player[a_c]) {
                    score += (player[a_c] * rates[a_c]);
                }
            } else if (data.type[0] === 3) {
                a_c = Util.lion.get_animal_color(data.result[0]);
                if (player[a_c]) {
                    score += (player[a_c] * rates[a_c]);
                    score *= data.type[1];
                }
            } else {
                var a_c;
                for (var i = 0; i < data.result.length; i++) {
                    a_c = Util.lion.get_animal_color(data.result[i]);
                    if (player[a_c]) {
                        score += (player[a_c] * rates[a_c]);
                    }
                }
            }
            // 庄和闲开奖
            var zhx = ["bank", "tie", "play"];
            if (player[zhx[data.zhx_result - 1]]) {

                score += (player[zhx[data.zhx_result - 1]] * player[zhx[data.zhx_result - 1] + "_rate"]);
            }
            if (zhx[data.zhx_result - 1] === "tie") {
                score += isNaN(player["bank"]) ? 0 : (player["bank"] * 0.95);
                score += isNaN(player["play"]) ? 0 : (player["play"] * 0.95);
            }
            return score;
        },
        stake_win: (rate, score) => {

        },
        lighting: () => {

        }
    },
    time: {
        one_minute: 60,
        one_hour: 3600,
        one_day: 24 * 3600,
        downloadTimeString: (timeStamp) => {
            var date;
            var ts = parseInt(timeStamp);
            if (ts > 1000000000000) {
                date = new Date(ts);
            } else {
                date = new Date(ts * 1000);
            }
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();

            return [year, month, day].map(Util.number.formatTimeNumber).join('') + '_' + [hour, minute, second].map(Util.number.formatTimeNumber).join('')
        },

        getTimeSecond: () => {
            return Math.round(new Date().getTime() / 1000);
        },

        getTimeStamp: () => {
            return Math.round(new Date().getTime());
        },

        getTimeString: (timeStamp) => {
            var date;
            var ts = parseInt(timeStamp);
            if (ts > 1000000000000) {
                date = new Date(ts);
            } else {
                date = new Date(ts * 1000);
            }
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();

            return [year, month, day].map(Util.number.formatTimeNumber).join('/') + ' ' + [hour, minute, second].map(Util.number.formatTimeNumber).join(':')
        },

        getDateStringByTS: (timeStamp) => {
            var date;
            var ts = parseInt(timeStamp);
            if (ts > 1000000000000) {
                date = new Date(ts);
            } else {
                date = new Date(ts * 1000);
            }
            return Util.time.getDateString(date);
        },

        getDateString: (date) => {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return [year, month, day].map(Util.number.formatTimeNumber).join('-');
        },

        getHourMiniteStringByTS: (timeStamp) => {
            var date;
            var ts = parseInt(timeStamp);
            if (ts > 1000000000000) {
                date = new Date(ts);
            } else {
                date = new Date(ts * 1000);
            }
            return Util.time.getHourMiniteString(date);
        },

        getHourMiniteString: (date) => {
            var hour = date.getHours();
            var minute = date.getMinutes();
            return [hour, minute].map(Util.number.formatTimeNumber).join(':');
        },

        getZeroOClockStamp: (second = true) => {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            if (second === true) {
                return date.getTime();
            } else {
                return Math.floor(date.getTime() / 1000);
            }
        },

        getCurrentMonthStamp: (second = true) => {
            var date = new Date();
            date.setDate = 1;
            date.setHours(0, 0, 0, 0);
            if (second === true) {
                return date.getTime();
            } else {
                return Math.floor(date.getTime() / 1000);
            }
        },

        getTableTimeString: (timeStamp) => {
            var isMS;
            if (timeStamp > 1000000000000) {
                isMS = true;
            } else {
                isMS = false;
            }
            return Util.time.getZeroOClockStamp(isMS) > timeStamp ? Util.time.getDateStringByTS(timeStamp) : Util.time.getHourMiniteStringByTS(timeStamp)
        }
    },

    number: {
        formatTimeNumber: (n) => {
            n = n.toString()
            return n[1] ? n : '0' + n
        },
        toFixed2: (number) => {
            if (typeof (number) === "number") {
                var n = Math.round(number * 100) / 100;
                return n;
            }
            return new Error("arg must be a number");
        },
        blockGameCoinChange: (block) => {
            return parseInt(block.record_recharge) - parseInt(block.record_exchange) + parseInt(block.record_given) - parseInt(block.record_confiscated) + parseInt(block.record_game_win) / 1000 - parseInt(block.record_game_stake) / 1000
        },
        blockTasteCoinChange: (block) => {
            return parseInt(block.record_asked) + parseInt(block.record_taste_win) / 1000 - parseInt(block.record_taste_stake) / 1000;
        },
        /**
         * @param a, b 比较的两个数字
         * @param repair 误差范围
         * @return a比b超出误差范围 返回 1; a比b 小超出两位小数点 返回-1; a与b 相等及其他情况  返回0
         */
        coinVerify: (a, b, repair = 0) => {
            if (repair < 0) {
                throw new Error("repair must be positive-number");
            }
            if (a - b > repair) {
                return 1;
            } else if (a - b < repair && a - b > 0) {
                return 0;
            } else if (a - b < 0 && b - a < repair) {
                return b - a > 0.01 ? -1 : 0
            } else if (b - a > repair) {
                return -1
            } else if (a === b) {
                return 0
            }
        }
    },


    text: {
        base64_encode: (str) => {
            return window.btoa(str)
        },

        base64_decode: (atr) => {
            return window.atob(str)
        },

        unicode_to_string: (list) => {
            var result = "";
            if (list !== undefined) {
                for (var i = 0; i < list.length; i++) {
                    result += String.fromCharCode(list[i]);
                }
            }
            return result;
        },

        toUnicode: function (str) {
            return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
        },
        toGB2312: function (str) {
            return unescape(str.replace(/\\u/gi, '%u'));
        },
        string_to_unicode: (str) => {
            var list = [];
            escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u')
            if (str !== "") {
                for (var i = 0; i < str.length; i++) {
                    list.push(string.indexOf())
                }
            }
        },
    },

    phone: {
        isPC: () => {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
            }
            // sessionStorage.isPC = flag;
            return flag;
        }
    },

    event: {
        dispatcher: (type, index = "", msg = "") => {
            let e = new Event(type);
            e.index = index;
            e.msg = msg;
            dispatchEvent(e);
        }
    },

    storage: {
        create: (type = "", account = "", session = "", router = "", ip = "") => {
            if (type === 0) {
                return JSON.stringify({
                    "account": account,
                    "session": session,
                    "router": router,
                    "server_ip": ip
                })
            } else if (type === 1) {
                return JSON.stringify({
                    "account": account,
                    "session": session,
                    "router": router,
                    "server_ip": ip
                })
            }
            return JSON.stringify({
                "account": account,
                "session": session,
                "router": router,
                "server_ip": ip
            })
        },
        getSession: (user) => {
            var userSessions = JSON.parse(localStorage[user]);
            if (userSessions === undefined) return;
            sessionStorage.accountType = apptype;
            sessionStorage.relogin = true;
            sessionStorage.logged = true;
            sessionStorage.account = userSessions.account;
            sessionStorage.session = userSessions.session;
            sessionStorage.router = userSessions.router;
            sessionStorage.server_ip = userSessions.server_ip;
        },
        clearSession: (user) => {
            sessionStorage.account = "";
            sessionStorage.session = "";
            sessionStorage.logged = "false";
            sessionStorage.accountType = "";
            localStorage.removeItem(user);
        },
    },

    page: {
        getTotalPage: (count, rows = 10) => {
            let pageNum = Math.ceil(count / rows);
            if (pageNum === 0) {
                pageNum = 1;
            }
            return pageNum;
        }
    },

    tween: {
        generator: (duration, from, to, onUpdate, onComplete) => {
            if (typeof TWEEN == 'undefined')
                return;

            function animate() {
                requestAnimationFrame(animate);        //告知浏览器要开始动画效果并使其不断递归
                TWEEN.update();                        //执行动画的更新
            }

            //设定初始位置 position 和末位置 target
            function start_tween() {
                tween.start();
                animate();
            }


            var tween = new TWEEN.Tween(from).to(to, duration).onUpdate(() => {
                onUpdate(from);
                // this.setState({ startX: position.left });
            }).onComplete(() => {
                onComplete();
                TWEEN.remove(tween);
            });
            tween.start();
            animate();
            // return tween;
        }
    }
}

export default Util;