import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { blue500 } from 'material-ui/styles/colors';
import Lang from '../Language';
import appConfig from '../config.json';

const SelectableList = makeSelectable(List);
const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: '50px',
    fontWeight: typography.fontWeightLight,
    backgroundColor: blue500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
    height: 50
  },
  version: {
    paddingLeft: spacing.desktopGutterLess,
    fontSize: 14,
  },
};

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
    tradeMsg: PropTypes.object
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    muiVersions: [],
    recharge_num: "",
    exchange_num: "",
    promoter_recharge_num: "",
    promoter_exchange_num: "",
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.tradeMsg !== undefined) {
      var tradeObj = nextProps.tradeMsg;
      this.state.recharge_num = tradeObj.recharge ? "(" + tradeObj.recharge + ")" : ""
      this.state.exchange_num = tradeObj.exchange ? "(" + tradeObj.exchange + ")" : ""
      this.state.promoter_recharge_num = tradeObj.promoter_recharge ? "(" + tradeObj.promoter_recharge + ")" : ""
      this.state.promoter_exchange_num = tradeObj.promoter_exchange ? "(" + tradeObj.promoter_exchange + ")" : ""
    }
  }

  handleRequestChangeLink = (event, value) => {
    window.location = value;
  };

  handleTouchTapHeader = () => {
    return;
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
      tradeMsg
    } = this.props;


    return (
      <Drawer
        width={190}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          {sessionStorage.accountType === "0" ? Lang[window.Lang].Master.admin_title :
            sessionStorage.accountType === "1" ? Lang[window.Lang].Master.promoter_title : sessionStorage.accountType === "2" ? Lang[window.Lang].Master.superAdmin_title : sessionStorage.accountType === "3" ? Lang[window.Lang].Master.vender_title : ''}
        </div>
        <span style={styles.version}>Version: {appConfig.app_version + "_" + appConfig.web_version}</span>
        <br />
        <span style={styles.version}>Server: {sessionStorage.server_version}</span>
        {
          sessionStorage.accountType === "0" ?
            <SelectableList
              value={location.pathname}
              onChange={onChangeList}
            >
              <ListItem
                primaryText={Lang[window.Lang].Statistics.title}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem primaryText={Lang[window.Lang].Statistics.detail} value="/statistics/detail" />,
                  /**<ListItem
                    primaryText={Lang[window.Lang].Statistics.player}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Statistics.Player.dnudau} value="/statistics/player/dnudau" />,
                      <ListItem primaryText={Lang[window.Lang].Statistics.Player.retain} value="/statistics/player/retain" />
                    ]}
                  />,*/
                  <ListItem
                    primaryText={Lang[window.Lang].Statistics.desks}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} value="/statistics/game/fish" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} value="/statistics/game/bull" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["14"].game_name} value="/statistics/game/lion" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} value="/statistics/game/pirate" />
                    ]}
                  />,
                ]}
              />
              <ListItem
                primaryText={Lang[window.Lang].User.title}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem primaryText={Lang[window.Lang].User.account} value="/user/account" />,
                  // <ListItem primaryText={Lang[window.Lang].User.info} value="/user/info" />,
                  <ListItem primaryText={Lang[window.Lang].User.charge_page + this.state.recharge_num} value="/user/charge" />,
                  <ListItem primaryText={Lang[window.Lang].User.exchange_page + this.state.exchange_num} value="/user/exchange" />,
                  <ListItem primaryText={Lang[window.Lang].User.pay_order} value="/user/payOrder" />,
                  <ListItem primaryText={Lang[window.Lang].User.wxcharge_page} value="/user/wxCharge" />,
                  <ListItem primaryText={Lang[window.Lang].User.charge_history} value="/user/charge_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.exchange_history} value="/user/exchange_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.return_history} value="/user/return_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.given_history} value="/user/given_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.confiscated_history} value="/user/confiscated_history" />,
                ]}
              />
              <ListItem
                primaryText={Lang[window.Lang].Promoter.title}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem primaryText={Lang[window.Lang].Promoter.account} value="/promoter/account" />,
                  <ListItem primaryText={Lang[window.Lang].Promoter.charge + this.state.promoter_recharge_num} value="/promoter/charge" />,
                  <ListItem primaryText={Lang[window.Lang].Promoter.exchange + this.state.promoter_exchange_num} value="/promoter/exchange" />,
                  <ListItem primaryText={Lang[window.Lang].User.charge_history} value="/promoter/charge_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.exchange_history} value="/promoter/exchange_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.given_history} value="/promoter/given_history" />,
                  <ListItem primaryText={Lang[window.Lang].User.confiscated_history} value="/promoter/confiscated_history" />,
                  <ListItem primaryText={Lang[window.Lang].Promoter.profit} value="/promoter/profit" />,
                  <ListItem primaryText={Lang[window.Lang].Promoter.log} value="/promoter/log" />,

                ]}
              />
              <ListItem
                primaryText={Lang[window.Lang].Setting.title}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem
                    primaryText={Lang[window.Lang].Setting.game}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["10"].game_name} value="/setting/game/hall" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} value="/setting/game/fish" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} value="/setting/game/bull" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["14"].game_name} value="/setting/game/lion" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} value="/setting/game/pirate" />

                    ]}
                  />,
                  <ListItem primaryText={Lang[window.Lang].Setting.notice} value="/setting/notice" />,
                  <ListItem primaryText={Lang[window.Lang].Setting.wx} value="/setting/wx" />,
                  <ListItem primaryText={Lang[window.Lang].Setting.auth} value="/setting/auth" />,
                  <ListItem primaryText={Lang[window.Lang].Setting.reportCode} value="/setting/reportCode" />,
                  <ListItem primaryText={Lang[window.Lang].Setting.rechargeCode} value="/setting/rechargeCode" />

                ]}
              />
              <ListItem
                primaryText={Lang[window.Lang].Administrator.title}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem primaryText={Lang[window.Lang].Administrator.account} value="/administrator/account" />,
                  <ListItem primaryText={Lang[window.Lang].Administrator.log} value="/administrator/log" />,
                ]}
              />
            </SelectableList> : sessionStorage.accountType === "1" ?
              <SelectableList
                value={location.pathname}
                onChange={onChangeList}
              >
                <ListItem
                  primaryText={Lang[window.Lang].User.title}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem primaryText={Lang[window.Lang].User.account} value="/user/account" />,
                    <ListItem primaryText={Lang[window.Lang].User.charge_page + this.state.recharge_num} value="/user/charge" />,
                    <ListItem primaryText={Lang[window.Lang].User.exchange_page + this.state.exchange_num} value="/user/exchange" />,
                    <ListItem primaryText={Lang[window.Lang].User.wxcharge_page} value="/user/wxCharge" />,
                    <ListItem primaryText={Lang[window.Lang].User.charge_history} value="/user/charge_history" />,
                    <ListItem primaryText={Lang[window.Lang].User.exchange_history} value="/user/exchange_history" />,
                    <ListItem primaryText={Lang[window.Lang].User.coin} value="/user/coin" />,
                    <ListItem primaryText={Lang[window.Lang].User.score} value="/user/score" />,
                  ]}
                />
                <ListItem
                  primaryText={Lang[window.Lang].Coin.title}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem primaryText={Lang[window.Lang].Coin.operation} value="/coin/operation" />,
                    <ListItem primaryText={Lang[window.Lang].Coin.chargeHistory} value="/coin/recharge_history" />,
                    <ListItem primaryText={Lang[window.Lang].Coin.exchangeHistory} value="/coin/exchange_history" />,
                  ]}
                />
              </SelectableList> : sessionStorage.accountType === "2" ?
                <SelectableList
                  value={location.pathname}
                  onChange={onChangeList}
                >
                  <ListItem
                    primaryText={Lang[window.Lang].Setting.title}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Setting.df} value="/setting/df" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.room} value="/setting/room" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.hall} value="/setting/hall" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.server} value="/setting/server" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.wx} value="/setting/wx" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.auth} value="/setting/auth" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.game_hall} value="/setting/game_hall" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.executeCode} value="/setting/executeCode" />,
                    ]}
                  />
                  <ListItem
                    primaryText={Lang[window.Lang].Statistics.title}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Statistics.detail} value="/statistics/detail" />,
                      <ListItem
                        primaryText={Lang[window.Lang].Statistics.desks}
                        primaryTogglesNestedList={true}
                        nestedItems={[
                          <ListItem primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} value="/statistics/game/fish" />,
                          <ListItem primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} value="/statistics/game/bull" />,
                          <ListItem primaryText={Lang[window.Lang].Setting.GamePage["14"].game_name} value="/statistics/game/lion" />,
                          <ListItem primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} value="/statistics/game/pirate" />
                        ]}
                      />,
                    ]}
                  />
                  <ListItem
                    primaryText={Lang[window.Lang].Administrator.title}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Administrator.account} value="/administrator/account" />,
                      <ListItem primaryText={Lang[window.Lang].Administrator.log} value="/administrator/log" />,
                    ]}
                  />
                  <ListItem
                    primaryText={Lang[window.Lang].Setting.setting}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                      <ListItem primaryText={Lang[window.Lang].Setting.resetStatistics} value="/game_setting/cleanStatistics" />,
                      <ListItem primaryText={Lang[window.Lang].Setting.resetPlatform} value="/game_setting/resetPlatform" />,
                    ]}
                  />
                </SelectableList> : sessionStorage.accountType === "3" ?
                  <SelectableList
                    value={location.pathname}
                    onChange={onChangeList}
                  >
                    <ListItem
                      primaryText={Lang[window.Lang].Vender.title}
                      primaryTogglesNestedList={true}
                      nestedItems={[
                        <ListItem primaryText={Lang[window.Lang].Statistics.detail} value="/vender/detail" />,
                        <ListItem primaryText={Lang[window.Lang].User.log} value="/vender/log" />,
                        <ListItem primaryText={Lang[window.Lang].Vender.reset} value="/vender/reset" />,
                        <ListItem primaryText={Lang[window.Lang].Vender.profit} value="/vender/profit" />,
                        <ListItem primaryText={Lang[window.Lang].Setting.auth} value="/vender/auth" />,
                        <ListItem primaryText={Lang[window.Lang].Vender.export} value="/vender/export" />,
                        <ListItem primaryText={Lang[window.Lang].Vender.server} value="/vender/server" />,
                        <ListItem
                          primaryText={Lang[window.Lang].Vender.factor.title}
                          primaryTogglesNestedList={true}
                          nestedItems={[
                            <ListItem primaryText={Lang[window.Lang].Vender.factor.fish} value="/vender/factor/fish" />,
                            <ListItem primaryText={Lang[window.Lang].Vender.factor.bull} value="/vender/factor/bull" />,
                            <ListItem primaryText={Lang[window.Lang].Vender.factor.lion} value="/vender/factor/lion" />,
                            <ListItem primaryText={Lang[window.Lang].Setting.GamePage["15"].game_name} value="/vender/factor/pirate" />
                          ]}
                        />
                      ]}
                    />
                  </SelectableList> :
                  <SelectableList />
        }

        <Divider />

      </Drawer>
    );
  }
}

export default AppNavDrawer;

