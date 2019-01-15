import Lang from './Language';

var OperateCodeUtil = {
    operateDetail: (item) => {
        if (item === undefined) {
            return;
        }
        var Item = item;
        if (typeof (item) === "string") {
            Item = JSON.parse(item);
        }
        if (Item.func === undefined) {
            return Lang[window.Lang].Setting.reportCodeOperate.no_map_operate;
        } else {
            var args = Item.func.split('|');
            var func = args[0];
            switch (func) {
                case "recharge_draw_water_coin":
                    return ["完成执行码操作", (args.length === 2 ? ("增加抽水额" + args[1] + "个金币") : Lang[window.Lang].Setting.reportCodeOperate.draw_water_error)];
                case "set_room_config":
                    return ["完成执行码操作", args.length === 4 ? (Lang[window.Lang].Setting.reportCodeOperate.game[args[1]] + "-" + Lang[window.Lang].Setting.reportCodeOperate.room[args[2]] + "-最大桌子数增加" + args[3]) : Lang[window.Lang].Setting.reportCodeOperate.desk_room_setting_error]
            }
            return Lang[window.Lang].Setting.reportCodeOperate.no_map_operate;
        }

    },
    operateResult: (item) => {
        if (item === undefined) {
            return;
        }
        var Item = item;
        if (typeof (item) === "string") {
            Item = JSON.parse(item);
        }
        var result = Item.passed;
        if (result === undefined) {
            return Lang[window.Lang].Master.action_error;
        } else {
            if (result === true) {
                return Lang[window.Lang].Master.action_success;
            } else {
                return Lang[window.Lang].Master.action_fail;
            }
        }

    }
}
export default OperateCodeUtil;
