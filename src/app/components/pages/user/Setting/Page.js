import { DELETE_PLAYER_C2S, MODIFY_PLAYER_C2S, RESET_PLAYER_INFO_C2S, FROZEN_ACCOUNT_C2S, RECHARGE_PLAYER_C2S, EXCHANGE_PLAYER_C2S, PRINT_PLAYER_COIN_LOG_C2S, RESET_PLAYER_INFO_S2C, FROZEN_ACCOUNT_S2C, PRINT_PLAYER_COIN_LOG_S2C, DELETE_PLAYER_S2C, MODIFY_PLAYER_S2C, EXCHANGE_PLAYER_S2C, } from "../../../../proto_enum";
import { LOGIC_SUCCESS } from "../../../../ecode_enum";
import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import ReactDataGrid from 'angon_react_data_grid';
import TextField from 'material-ui/TextField';
import { Tabs, Tab } from 'material-ui/Tabs';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';
import Styles from '../../../../Styles';

import RaisedButton from 'material-ui/RaisedButton';

import RechargeHistory from '../ChargeHistory/Page';
import ExchangeHistory from '../ExchangeHistory/Page';
import ReturnHistory from '../ReturnHistory/Page';

import GivenHistory from '../GivenHistory/Page';
import ConfiscatedHistory from '../ConfiscatedHistory/Page';

import CommonAlert from '../../../myComponents/Alert/CommonAlert';
import ScoreLog from '../Score/Page';
import CoinLog from '../Coin/Page';
import ReturnLog from '../Return/Page';
import CoinBlockLog from '../CoinBlock/Page';
import PlayerRelation from '../PlayerRelation/Page';




class UserSetting extends Component {
  static PropTypes = {
    player: PropTypes.object
  }

  static defaultProps = {
    player: {}
  }


  state = {
    alertOpen: false,
    showSelect: "coinBlockStream",
    player: {},
    player_account: "",
    resetPlayerAccount: this.props.player.account,
    resetPlayerName: this.props.player.name,
    resetPlayerPhone: this.props.player.mobile_phone,
    resetPlayerRecommend: this.props.player.recommend,
    resetPlayerLevel: this.props.player.level,
    resetPlayerSex: this.props.player.sex,
    resetPlayerAvatar: this.props.player.head_portrait
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showSelect === "resetPlayerInfo" && prevState.showSelect !== "resetPlayerInfo") {
      document.getElementById('account_textfield').value = this.state.player.account;
      document.getElementById('name_textfield').value = this.state.player.name;
      document.getElementById('level_textfield').value = this.state.player.level;
      document.getElementById('avatar_textfield').value = this.state.player.head_portrait;
      document.getElementById('recommend_textfield').value = this.state.player.recommend;
      document.getElementById('phone_textfield').value = this.state.player.mobile_phone;
    }
    if (this.state.showSelect === 'promoter_trade' && prevState.showSelect !== "promoter_trade" && document.getElementById('coin_value_text_field') && document.getElementById('set_coin_your_password_text_field')) {
      document.getElementById('coin_value_text_field').value = '';
      document.getElementById('set_coin_your_password_text_field').value = '';
    }
    if (this.state.showSelect === 'resetPassword' && prevState.showSelect !== "resetPassword" && document.getElementById('your_password_text_field') && document.getElementById('reset_password_text_field') && document.getElementById('reset_again_password_text_field')) {
      document.getElementById('your_password_text_field').value = '';
      document.getElementById('reset_password_text_field').value = '';
      document.getElementById('reset_again_password_text_field').value = '';
    }
    if (this.state.showSelect === 'deletePlayer' && prevState.showSelect !== "deletePlayer" && document.getElementById('delete_your_password_text_field')) {
      document.getElementById('delete_your_password_text_field').value = '';
    }
    if (prevState.showSelect === 'playerRelation') {
      // this.state.showSelect = 'playerRelation';
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.player.account !== nextProps.player.account && this.state.showSelect === "resetPlayerInfo") {
      if (document.getElementById('account_textfield') === null) {
        return;
      }
      document.getElementById('account_textfield').value = nextProps.player.account;
      document.getElementById('name_textfield').value = nextProps.player.name;
      document.getElementById('level_textfield').value = nextProps.player.level;
      document.getElementById('avatar_textfield').value = nextProps.player.head_portrait;
      document.getElementById('recommend_textfield').value = nextProps.player.recommend;
      document.getElementById('phone_textfield').value = nextProps.player.mobile_phone;
    }
    if (this.state.player.account !== nextProps.player.account && this.state.showSelect === "playerRelation") {
      this.state.showSelect = 'playerRelation';
      this.state.selectedIndex = 5;
      this.setState({ showSelect: 'playerRelation' });
    }
  }

  popUpNotice = (type, code, content) => {
    this.setState({ type: type, code: code, content: content, alertOpen: true });
  }

  handleChange = (event, index, value) => {
    this.setState({ type: value });
  }
  // 删除玩家确定按钮
  deletePlayer = () => {
    var account = this.state.player.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== DELETE_PLAYER_S2C) {
        return;
      }
      if (message.code === LOGIC_SUCCESS) {
        var self = arg;
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        window.currentPage.handleQueryPage(true);

      }

    }
    var your_password = document.getElementById("delete_your_password_text_field");
    var obj = {
      "target_account": this.state.player.account,
      "your_password": your_password.value,
    }
    MsgEmitter.emit(DELETE_PLAYER_C2S, obj, cb, this);
  }
  //重置密码确定按钮
  resetPassword = () => {
    var account = this.state.player.account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      self = arg;
      if (id !== MODIFY_PLAYER_S2C) {
        return;
      }
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
    }
    var your_password = document.getElementById("your_password_text_field");
    var password = document.getElementById("reset_password_text_field");
    var again_password = document.getElementById("reset_again_password_text_field");
    if (password.value !== again_password.value) {
      this.popUpNotice("notice", 10020, Lang[window.Lang].ErrorCode[10020]);
      return
    }
    var obj = {
      "target_account": this.state.player.account,
      "your_password": your_password.value,
      "password": password.value,
    }
    MsgEmitter.emit(MODIFY_PLAYER_C2S, obj, cb, this);
  }
  // 重置玩家信息
  resetPlayerInfo = () => {
    var account = this.state.player.account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === RESET_PLAYER_INFO_S2C) {
        var self = arg[0];
        self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        if (message.code === LOGIC_SUCCESS) {
          // self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
          // self.state.player.recommend = "";
          // self.setState({
          //   resetPlayerSex: arg[1].sex
          // })
          self.state.player.sex = arg[1].sex;
          self.state.player.account = arg[1].target_account;
          self.state.player.name = arg[1].name;
          self.state.player.head_portrait = arg[1].head_portrait;
          self.state.player.recommend = arg[1].recommend;
          self.state.player.level = arg[1].level;
          self.state.player.mobile_phone = arg[1].mobile_phone;
          window.currentPage.handleQueryPlayer(self.state.player.account);
          self.forceUpdate();
        }
      }
    }
    var obj = {
      target_account: document.getElementById('account_textfield').value,
      name: document.getElementById('name_textfield').value,
      head_portrait: Number(document.getElementById('avatar_textfield').value),
      sex: this.state.resetPlayerSex,
      level: Number(document.getElementById('level_textfield').value),
      recommend: document.getElementById('recommend_textfield').value,
      mobile_phone: document.getElementById('phone_textfield').value
    }
    MsgEmitter.emit(RESET_PLAYER_INFO_C2S, obj, cb, [this, obj]);
  }

  // 禁用或启动
  frozenAccount = () => {
    var account = this.state.player.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === FROZEN_ACCOUNT_S2C) {
        var self = arg[0];
        if (message.code === LOGIC_SUCCESS) {
          self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
          arg[1] === true ? self.state.player.status = 1 : self.state.player.status = 0;
          window.currentPage.handleQueryPlayer(self.state.player.account);

        }
      }
    }
    var frozen;
    if (this.state.player.status === 0) {
      frozen = true;
    } else if (this.state.player.status === 1) {
      frozen = false;
    }
    var obj = {
      "target_account": this.state.player.account,
      "type": 3,
      "be_frozen": frozen
    }
    MsgEmitter.emit(FROZEN_ACCOUNT_C2S, obj, cb, [this, frozen]);
  }

  handlePromoterSetCoin = () => {
    var account = this.state.player.account;

    if (account === "") {
      return;
    }

    var cb = function (id, message, arg) {
      if (id !== EXCHANGE_PLAYER_S2C && id !== 9718) {
        return;
      }
      var self = arg[0];
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      if (message.code === LOGIC_SUCCESS) {
        self.state.player.game_coin += arg[1];
        if (arg[1] > 0) {
          self.state.player.cd.total_given = parseInt(self.state.player.cd.total_given) + arg[1];

        } else {
          self.state.player.cd.total_confiscated = parseInt(self.state.player.cd.total_confiscated) - arg[1];
        }
        self.setState({ player: self.state.player });
        arg[2].value = "";
        arg[3].value = "";
        window.currentPage.handleQueryPlayer(self.state.player.account);
      }
    }
    var your_password = document.getElementById("set_coin_promoter_password_text_field");
    var coin_value = document.getElementById("coin_value_promoter_text_field");
    if (Number(coin_value.value) > 0 && Number(coin_value.value) < Math.pow(2, 31) - 1) {
      if (this.state.isRecharge === true) {
        var obj = {
          "target_account": this.state.player.account,
          "your_password": your_password.value,
          "rmb": Number(coin_value.value)
        }
        MsgEmitter.emit(RECHARGE_PLAYER_C2S, obj, cb, [this, Number(coin_value.value), your_password, coin_value]);
      } else if (this.state.isRecharge === false) {
        var obj = {
          "target_account": this.state.player.account,
          "your_password": your_password.value,
          "game_coin": Number(coin_value.value)
        }
        MsgEmitter.emit(EXCHANGE_PLAYER_C2S, obj, cb, [this, -Number(coin_value.value)]);
      }
    } else if (this.state.isRecharge === true) {
      this.popUpNotice("notice", 99012, Lang[window.Lang].ErrorCode[99012]);
    } else if (this.state.isRecharge === false) {
      this.popUpNotice("notice", 99013, Lang[window.Lang].ErrorCode[99013]);
    }
  }
  // 调整金币确定按钮
  handleSetCoin = () => {
    var account = this.state.player.account;

    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id !== EXCHANGE_PLAYER_S2C && id !== 9718) {
        return;
      }
      var self = arg[0];
      self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      if (message.code === LOGIC_SUCCESS) {
        // self.state.player.game_coin += arg[1];
        // if (arg[1] > 0) {
        //   self.state.player.cd.total_given = parseInt(self.state.player.cd.total_given) + arg[1];

        // } else {
        //   self.state.player.cd.total_confiscated = parseInt(self.state.player.cd.total_confiscated) - arg[1];
        // }
        window.currentPage.handleQueryPlayer(self.state.player.account);
        self.setState({ player: self.state.player });
        arg[2].value = "";
        arg[3].value = "";


      }
    }
    var your_password = document.getElementById("set_coin_your_password_text_field");
    var coin_value = document.getElementById("coin_value_text_field");
    if (isNaN(Number(coin_value.value))) {
      this.popUpNotice("notice", 0, '请输入正确数值型');
      return;
    }
    if (Number(coin_value.value) % 1 != 0) {
      this.popUpNotice("notice", 99023, Lang[window.Lang].ErrorCode[99023]);
      return;
    }
    if (Number(coin_value.value) > 0) {
      var obj = {
        "target_account": this.state.player.account,
        "your_password": your_password.value,
        "rmb": Number(coin_value.value)
      }
      if (Number(coin_value.value) > 100000) {
        this.popUpNotice("notice", 99022, Lang[window.Lang].ErrorCode[99022]);
        return;
      }
      MsgEmitter.emit(RECHARGE_PLAYER_C2S, obj, cb, [this, Number(coin_value.value), your_password, coin_value]);
    } else if (Number(coin_value.value) < 0) {
      var game_coin = -Number(coin_value.value);
      // if (game_coin > this.state.player.game_coin) {
      //   this.popUpNotice("notice", 99010, Lang[window.Lang].ErrorCode[99010]);
      // } else {
      var obj = {
        "target_account": this.state.player.account,
        "your_password": your_password.value,
        "game_coin": game_coin
      }
      if (game_coin > 100000) {
        this.popUpNotice("notice", 99022, Lang[window.Lang].ErrorCode[99022]);
        return;
      }
      MsgEmitter.emit(EXCHANGE_PLAYER_C2S, obj, cb, [this, Number(coin_value.value), your_password, coin_value]);
      // }
    }
  }


  // 玩家信息--游戏币
  GameCoin = () => {
    var history = parseInt(this.state.player.cr.record_recharge) - parseInt(this.state.player.cr.record_game_stake) / 1000 + parseInt(this.state.player.cr.record_game_win) / 1000 + parseInt(this.state.player.cr.record_return) - parseInt(this.state.player.cr.record_exchange) + parseInt(this.state.player.cr.record_given) - parseInt(this.state.player.cr.record_confiscated);
    var now = parseInt(this.state.player.cd.total_recharge) - parseInt(this.state.player.game_coin_sw.total_stake) / 1000 + parseInt(this.state.player.game_coin_sw.total_win) / 1000 + parseInt(this.state.player.cd.total_return) - parseInt(this.state.player.cd.total_exchange) + parseInt(this.state.player.cd.total_given) - parseInt(this.state.player.cd.total_confiscated);
    // 欢乐竞技场才是金币分对应的值

    var score_exchange_coin = 0;
    if (this.state.player.room === 2) {
      score_exchange_coin = this.state.player.score / this.state.player.exchange_rate;
    } else {
      score_exchange_coin = 0;
    }
    return (
      <Paper>
        <p style={Styles.fontLeftFloat}>统计游戏币 = 总充值金额 - 总玩 + 总得 +总返利- 总兑换 + 赠予 - 收回 - 游戏中分数对应金币;</p>
        <p style={Styles.fontLeftFloat}>正确期望: 游戏币 微小于 统计游戏币</p>
        <ReactDataGrid
          rowKey="title"
          columns={[
            {
              key: 'title',
              name: " ",
              resizable: true
            },
            {
              key: 'game_coin',
              name: "游戏币",
              resizable: true,
            },
            {
              key: 'statistics_coin',
              name: "统计游戏币",
              resizable: true,
            },
            {
              key: 'total_recharge',
              name: "总充值",
              resizable: true,
            },
            {
              key: "total_exchange",
              name: "总兑换",
              resizable: true,
            },
            {
              key: 'total_stake',
              name: '总玩',
              resizable: true,
            },
            {
              key: 'total_win',
              name: "总得",
              resizable: true,
            },
            {
              key: 'total_return',
              name: "总返利",
              resizable: true,
            },
            {
              key: 'total_given',
              name: "赠予",
              resizable: true,
            },
            {
              key: 'total_confiscated',
              name: "收回",
              resizable: true,
            },
            {
              key: 'score_exchange_coin',
              name: "游戏中分数对应金币",
              resizable: true,
            }
          ]}

          rowGetter={(i) => {
            if (i === -1) {
              return {}
            } else if (i === 0) {
              return {
                title: "当期记录",
                game_coin: parseInt(this.state.player.game_coin) - parseInt(this.state.player.cr.record_game_coin),
                statistics_coin: Math.round(now - history - score_exchange_coin),
                total_recharge: parseInt(this.state.player.cd.total_recharge) - parseInt(this.state.player.cr.record_recharge),
                total_exchange: parseInt(this.state.player.cd.total_exchange) - parseInt(this.state.player.cr.record_exchange),
                total_stake: Math.round(parseInt(this.state.player.game_coin_sw.total_stake) / 1000 - parseInt(this.state.player.cr.record_game_stake) / 1000),
                total_win: Math.round(parseInt(this.state.player.game_coin_sw.total_win) / 1000 - parseInt(this.state.player.cr.record_game_win) / 1000),
                total_return: parseInt(this.state.player.cd.total_return) - parseInt(this.state.player.cr.record_return),
                total_given: parseInt(this.state.player.cd.total_given) - parseInt(this.state.player.cr.record_given),
                total_confiscated: parseInt(this.state.player.cd.total_confiscated) - parseInt(this.state.player.cr.record_confiscated),
                score_exchange_coin: score_exchange_coin,
              }
            } else if (i === 1) {
              return {
                title: "总记录",
                game_coin: parseInt(this.state.player.game_coin),
                statistics_coin: Math.round(now - score_exchange_coin),
                total_recharge: parseInt(this.state.player.cd.total_recharge),
                total_exchange: parseInt(this.state.player.cd.total_exchange),
                total_stake: Math.round(parseInt(this.state.player.game_coin_sw.total_stake) / 1000),
                total_win: Math.round(parseInt(this.state.player.game_coin_sw.total_win) / 1000),
                total_return: parseInt(this.state.player.cd.total_return),
                total_given: parseInt(this.state.player.cd.total_given),
                total_confiscated: parseInt(this.state.player.cd.total_confiscated),
                score_exchange_coin: score_exchange_coin,
              }
            }
          }}
          rowHeight={30}
          rowsCount={2}
          minHeight={90}
        />
        {/*记录当前金币*/}
        <FlatButton
          label={Lang[window.Lang].User.AccountPage.recordCurrentCoin}
          primary={true}
          onTouchTap={() => { this.recordCurrentCoin(this.state.player.account); }}
        />
      </Paper>)
  }
  // 玩家信息--体验币
  TasteCoin = () => {
    var history = parseInt(this.state.player.cr.record_asked) + parseInt(this.state.player.cr.record_taste_win) / 1000 - parseInt(this.state.player.cr.record_taste_stake) / 1000;
    var now = parseInt(this.state.player.cd.total_asked) - parseInt(this.state.player.taste_coin_sw.total_stake) / 1000 + parseInt(this.state.player.taste_coin_sw.total_win) / 1000;
    // 欢乐竞技场才是金币分对应的值
    var score_exchange_coin = 0;
    if (this.state.player.room === 1) {
      score_exchange_coin = this.state.player.score / this.state.player.exchange_rate;
    } else {
      score_exchange_coin = 0;
    }
    return (
      <Paper>
        <p style={Styles.fontLeftFloat}>统计体验币 = 总申请金额 - 总玩 + 总得 - 游戏中分数对应金币;</p>
        <p style={Styles.fontLeftFloat}>正确期望: 游戏币 微小于 统计游戏币</p>
        <ReactDataGrid
          rowKey="title"
          columns={[
            {
              key: 'title',
              name: " ",
              resizable: true
            },
            {
              key: 'taste_coin',
              name: "体验币",
              resizable: true,
            },
            {
              key: 'statistics_coin',
              name: "统计体验币",
              resizable: true,
            },
            {
              key: 'total_stake',
              name: '总玩',
              resizable: true,
            },
            {
              key: 'total_win',
              name: "总得",
              resizable: true,
            },
            {
              key: 'total_asked',
              name: "总申请",
              resizable: true,
            },
            {
              key: 'score_exchange_coin',
              name: "游戏中分数对应金币",
              resizable: true,
            }
          ]}
          rowGetter={(i) => {
            if (i === -1) {
              return {}
            } else if (i === 0) {
              return {
                title: "当期记录",
                taste_coin: parseInt(this.state.player.taste_coin) - parseInt(this.state.player.cr.record_taste_coin),
                statistics_coin: Math.round(now - history - score_exchange_coin),
                total_stake: Math.round(parseInt(this.state.player.taste_coin_sw.total_stake) / 1000 - parseInt(this.state.player.cr.record_taste_stake) / 1000),
                total_win: Math.round(parseInt(this.state.player.taste_coin_sw.total_win) / 1000 - parseInt(this.state.player.cr.record_taste_win) / 1000),
                total_asked: parseInt(this.state.player.cd.total_asked -
                  parseInt(this.state.player.cr.record_asked)),
                score_exchange_coin: score_exchange_coin,
              }
            } else if (i === 1) {
              return {
                title: "总记录",
                taste_coin: parseInt(this.state.player.taste_coin),
                statistics_coin: Math.round(now - score_exchange_coin),
                total_stake: Math.round(this.state.player.taste_coin_sw.total_stake / 1000),
                total_win: Math.round(this.state.player.taste_coin_sw.total_win / 1000),
                total_asked: parseInt(this.state.player.cd.total_asked),
                score_exchange_coin: score_exchange_coin,
              }
            }
          }}
          rowsCount={2}
          rowHeight={30}
          minHeight={90}
        />
        {/*记录当前金币*/}
        <FlatButton
          label={Lang[window.Lang].User.AccountPage.recordCurrentCoin}
          primary={true}
          onTouchTap={() => { this.recordCurrentCoin(this.state.player.account); }}
        />
      </Paper>)
  }

  // 记录当前金币
  recordCurrentCoin = (account) => {
    var account = account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === PRINT_PLAYER_COIN_LOG_S2C) {
        var self = arg[0];
        if (message.code === LOGIC_SUCCESS) {
          // 操作成功
          self.state.player.cr = message.cr;
        }
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        // self.handleRequestClose();
      }
    }
    var obj = {
      "target_account": account
    }
    MsgEmitter.emit(PRINT_PLAYER_COIN_LOG_C2S, obj, cb, [this]);
    // 相当于发送到数据库
  }
  handleRequestDelete = () => {
    alert('You clicked the delete button.');
  }

  handleTouchTap = () => {
  }
  render() {
    var {
          player
        } = this.props;
    this.state.player = player;
    this.state.resetPlayerAccount = player.account;
    this.state.resetPlayerName = player.name;
    this.state.resetPlayerPhone = player.mobile_phone;
    this.state.resetPlayerRecommend = player.recommend;
    this.state.resetPlayerLevel = player.level;
    this.state.resetPlayerSex = player.sex;
    this.state.resetPlayerAvatar = player.head_portrait;
    if (this.state.player !== player) {
      this.setState({ player: player });
    }

    if (player.account === undefined) {
      return <Paper />
    }
    return (
      <Paper>
        <Tabs
          value={this.state.selectedIndex}
        >


          <Tab
            value={1}
            label={Lang[window.Lang].User.AccountPage.coin_stream}
            onActive={() => {
              this.setState({ showSelect: "coinBlockStream", selectedIndex: 1 })
            }}
          >
            <div>
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.coinBlock_stream}
                primary={true}
                disabled={this.state.showSelect === "coinBlockStream"}
                onTouchTap={() => {
                  this.setState({ showSelect: "coinBlockStream" })
                }}
              />
              {/*金币流水*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.coin_stream}
                primary={true}
                disabled={this.state.showSelect === "coinStream"}
                onTouchTap={() => {
                  this.setState({ showSelect: "coinStream" })
                }}
              />
              {/*分段金币流水*/}

              {/*分数流水*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.score_stream}
                primary={true}
                disabled={this.state.showSelect === "scoreStream"}
                onTouchTap={() => {
                  this.setState({ showSelect: "scoreStream" })
                }}
              />
              {/**
               * 返利流水
               */}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.return_stream}
                primary={true}
                disabled={this.state.showSelect === "returnStream"}
                onTouchTap={() => {
                  this.setState({ showSelect: "returnStream" })
                }}
              />
              {
                this.state.showSelect === "coinStream" ?
                  <CoinLog player={this.state.player.account} /> : this.state.showSelect === "scoreStream" ?
                    <ScoreLog player={this.state.player.account} /> : this.state.showSelect === "returnStream" ?
                      <ReturnLog player={this.state.player.account} /> : this.state.showSelect === "coinBlockStream" ? <CoinBlockLog player={this.state.player.account} /> : ""
              }
            </div>
          </Tab>

          <Tab
            value={2}
            label={Lang[window.Lang].User.AccountPage.setting_user}
            onActive={() => {
              this.setState({ selectedIndex: 2 })
            }}
          >
            <div>
              {/*调整金币*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.coin_button}
                primary={true}
                disabled={this.state.showSelect === "promoter_trade"}
                onTouchTap={() => {
                  this.setState({ showSelect: "promoter_trade" })
                }
                }
              />
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.reset_pw_button}
                primary={true}
                disabled={this.state.showSelect === "resetPassword"}
                onTouchTap={() => {
                  this.setState({
                    showSelect: 'resetPassword'
                  })
                }}
              />
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.delete_account}
                primary={true}
                disabled={this.state.showSelect === "deletePlayer"}
                onTouchTap={() => {
                  this.setState({
                    showSelect: 'deletePlayer'
                  })
                }}
              />
              <FlatButton
                label={player.status === 0 ?
                  Lang[window.Lang].User.AccountPage.frozen_button : Lang[window.Lang].User.AccountPage.thaw_button}
                primary={true}
                onTouchTap={this.frozenAccount}
              />
              {apptype === 0 ?
                <FlatButton
                  label={Lang[window.Lang].User.AccountPage.resetPlayerInfo}
                  primary={true}
                  disabled={this.state.showSelect === 'resetPlayerInfo'}
                  onTouchTap={() => {
                    this.setState({
                      showSelect: 'resetPlayerInfo'
                    })
                  }}
                /> : ""}

              {this.state.showSelect === "resetPassword" ?
                <Paper>
                  <TextField
                    id="your_password_text_field"
                    disabled={false}
                    multiLine={false}
                    type="password"
                    floatingLabelText={Lang[window.Lang].User.AccountPage.your_password}
                    defaultValue=""
                    fullWidth={true}
                    floatingLabelStyle={Styles.floatingLabelStyle}
                    floatingLabelFixed={true}
                    inputStyle={Styles.inputStyle}
                  />
                  <br />
                  <TextField
                    id="reset_password_text_field"
                    disabled={false}
                    multiLine={false}
                    type="password"
                    floatingLabelText={Lang[window.Lang].User.AccountPage.new_password}
                    defaultValue=""
                    fullWidth={true}
                    floatingLabelFixed={true}

                    floatingLabelStyle={Styles.floatingLabelStyle}
                    inputStyle={Styles.inputStyle}
                  />
                  <br />
                  <TextField
                    id="reset_again_password_text_field"
                    disabled={false}
                    multiLine={false}
                    type="password"
                    floatingLabelText={Lang[window.Lang].User.AccountPage.again_password}
                    defaultValue=""
                    fullWidth={true}
                    floatingLabelFixed={true}
                    floatingLabelStyle={Styles.floatingLabelStyle}
                    inputStyle={Styles.inputStyle}
                    onChange={() => {
                      document.getElementById('reset_again_password_text_field').onkeydown = (e) => {
                        var ev = e || window.event;
                        if (ev.keyCode === 13) {
                          this.resetPassword();
                        }
                      }
                    }}
                  />
                  <br />
                  <FlatButton
                    label={Lang[window.Lang].Master.certain_button}
                    primary={true}
                    onTouchTap={this.resetPassword}
                  />
                  <br />
                </Paper> : this.state.showSelect === "deletePlayer" ?
                  <Paper >
                    <TextField
                      id="delete_your_password_text_field"
                      disabled={false}
                      multiLine={false}
                      type="password"
                      floatingLabelText='您的密码'
                      floatingLabelStyle={Styles.floatingLabelStyle}
                      inputStyle={Styles.inputStyle}
                      defaultValue=""
                      fullWidth={true}
                      floatingLabelFixed={true}
                      onChange={() => {
                        document.getElementById('delete_your_password_text_field').onkeydown = (e) => {
                          var ev = e || window.event;
                          if (ev.keyCode === 13) {
                            this.deletePlayer();
                          }
                        }
                      }}
                    />
                    <FlatButton
                      label={Lang[window.Lang].Master.certain_button}
                      primary={true}
                      onTouchTap={this.deletePlayer}
                    />
                    <br />
                  </Paper> : this.state.showSelect === "promoter_trade" ?
                    <Paper>
                      <TextField
                        id="coin_value_text_field"
                        disabled={false}
                        multiLine={false}
                        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.coin_value}
                        defaultValue=""
                        fullWidth={true}
                        floatingLabelFixed={true}
                        floatingLabelStyle={Styles.floatingLabelStyle}
                        inputStyle={Styles.inputStyle}
                      />
                      <br />
                      <TextField
                        id="set_coin_your_password_text_field"
                        disabled={false}
                        multiLine={false}
                        type="password"
                        floatingLabelText={Lang[window.Lang].Promoter.AccountPage.your_password}
                        defaultValue=""
                        fullWidth={true}
                        floatingLabelFixed={true}
                        floatingLabelStyle={Styles.floatingLabelStyle}
                        inputStyle={Styles.inputStyle}
                        onChange={() => {
                          document.getElementById('set_coin_your_password_text_field').onkeydown = (e) => {
                            var ev = e || window.event;
                            if (ev.keyCode === 13) {
                              this.handleSetCoin();
                            }
                          }
                        }}
                      />
                      <FlatButton
                        label={Lang[window.Lang].Master.certain_button}
                        primary={true}
                        onTouchTap={this.handleSetCoin}

                      />
                      <br />
                    </Paper> : this.state.showSelect === "resetPlayerInfo" ?
                      <Paper style={Styles.hidden}>
                        <TextField
                          id={"account_textfield"}
                          floatingLabelFixed={true}
                          defaultValue={this.state.player.account}
                          floatingLabelText="玩家账号"
                          disabled={true}
                          style={Styles.rightGapFloat}
                          onChange={(e) => {
                            this.state.resetPlayerAccount = e.target.value;
                          }}
                        />
                        <TextField
                          id={"avatar_textfield"}
                          defaultValue={this.state.player.head_portrait}
                          floatingLabelText="玩家头像编号"
                          floatingLabelFixed={true}
                          style={Styles.rightGapFloat}

                          onChange={(e) => {
                            this.state.resetPlayerAvatar = Number(e.target.value);
                          }} />

                        <TextField
                          id={"name_textfield"}
                          defaultValue={this.state.player.name}
                          floatingLabelText="玩家昵称"
                          style={Styles.rightGapFloat}

                          floatingLabelFixed={true}

                          onChange={(e) => {
                            this.state.resetPlayerName = e.target.value;
                          }}
                        />
                        <div style={Styles.rightGapFloat}>
                          <RadioButtonGroup name="sex" valueSelected={this.state.player.sex} style={Styles.flex}
                            onChange={(event, value) => {
                              this.state.resetPlayerSex = Number(value);
                            }}
                          >
                            <RadioButton
                              value={0}
                              label="女"
                            />
                            <RadioButton
                              value={1}
                              label="男"
                            />
                          </RadioButtonGroup>
                          <Divider style={Styles.divider} />
                        </div>
                        <TextField
                          id={"phone_textfield"}
                          defaultValue={this.state.player.mobile_phone}
                          floatingLabelFixed={true}
                          floatingLabelText="手机号"
                          style={Styles.rightGapFloat}
                          onChange={(e) => {
                            this.state.resetPlayerPhone = e.target.value;
                          }}
                        />
                        <TextField
                          id={"level_textfield"}
                          defaultValue={this.state.player.level}
                          floatingLabelText="等级"
                          floatingLabelFixed={true}
                          style={Styles.rightGapFloat}

                          onChange={(e) => {
                            this.state.resetPlayerLevel = Number(e.target.value);
                          }}
                        />
                        <TextField
                          id={"recommend_textfield"}
                          defaultValue={this.state.player.recommend}
                          floatingLabelFixed={true}
                          floatingLabelText="推广员"
                          style={Styles.rightGapFloat}

                          onChange={(e) => {
                            this.state.resetPlayerRecommend = e.target.value;
                          }}
                        /><br />

                        <RaisedButton label={Lang[window.Lang].Master.certain_button} primary={true} style={{
                          float: 'left',
                          marginRight: 15,
                          marginTop: 20,
                          marginLeft: 20
                        }}
                          onTouchTap={() => {
                            this.resetPlayerInfo();
                          }} />
                      </Paper>
                      : ''}


            </div>
          </Tab>
          <Tab
            value={3}
            label={Lang[window.Lang].User.AccountPage.recharge_history}
            onActive={() => {
              this.setState({ showSelect: "chargeHistory", selectedIndex: 3 })
            }}
          >

            <div>
              {/*充值历史*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.recharge_history}
                primary={true}
                disabled={this.state.showSelect === "chargeHistory"}
                onTouchTap={() => {
                  this.setState({ showSelect: "chargeHistory" })
                }}
              />
              {/*兑换历史*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.exCharge_history}
                primary={true}
                disabled={this.state.showSelect === "exchangeHistory"}
                onTouchTap={() => {
                  this.setState({ showSelect: "exchangeHistory" })
                }}
              />

              {
                this.state.showSelect === "chargeHistory" ?
                  <RechargeHistory player={this.state.player.account} /> : this.state.showSelect === "exchangeHistory" ?
                    <ExchangeHistory player={this.state.player.account} /> : ""
              }
            </div>
          </Tab>
          <Tab
            value={4}
            label={Lang[window.Lang].User.AccountPage.given_history}
            onActive={() => {
              this.setState({ showSelect: "givenHistory", selectedIndex: 4 })
            }}
          >

            <div>
              {/*赠送历史*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.given_history}
                primary={true}
                disabled={this.state.showSelect === "givenHistory"}
                onTouchTap={() => {
                  this.setState({ showSelect: "givenHistory" })
                }}
              />
              {/*扣除历史*/}
              <FlatButton
                label={Lang[window.Lang].User.AccountPage.confiscated_history}
                primary={true}
                disabled={this.state.showSelect === "confiscatedHistory"}
                onTouchTap={() => {
                  this.setState({ showSelect: "confiscatedHistory" })
                }}
              />
              {
                this.state.showSelect === "givenHistory" ?
                  <GivenHistory player={this.state.player.account} /> : this.state.showSelect === "confiscatedHistory" ?
                    <ConfiscatedHistory player={this.state.player.account} /> : ""
              }
            </div>
          </Tab>
          <Tab
            value={5}
            label={Lang[window.Lang].User.AccountPage.playerRelation}
            onActive={() => {
              this.setState({ showSelect: "playerRelation", selectedIndex: 5 })

            }}
          >
            {/*返利历史*/}
            <FlatButton
              label={Lang[window.Lang].User.AccountPage.player_relation}
              primary={true}
              disabled={this.state.showSelect === "playerRelation"}
              onTouchTap={() => {
                this.setState({ showSelect: "playerRelation" })
              }}
            />
            <FlatButton
              label={Lang[window.Lang].User.AccountPage.return_history}
              primary={true}
              disabled={this.state.showSelect === "returnHistory"}
              onTouchTap={() => {
                this.setState({ showSelect: "returnHistory" })
              }}
            />
            {
              this.state.showSelect === "playerRelation" ? <PlayerRelation player={this.state.player} /> : this.state.showSelect === "returnHistory" ?
                <ReturnHistory player={this.state.player.account} /> : ''
            }
          </Tab>

        </Tabs>
        <Tabs>
          <Tab label={Lang[window.Lang].User.AccountPage.game_coin_detail} >
            <div>
              {this.GameCoin()}
            </div>
          </Tab>
          <Tab label={Lang[window.Lang].User.AccountPage.taste_coin_detail} >
            <div>
              {this.TasteCoin()}
            </div>
          </Tab>

        </Tabs>
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
      </Paper>

    );
  }

}



export default UserSetting;
