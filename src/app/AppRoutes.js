import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';

// Here we define all our material-ui ReactComponents.
import Master from './components/Master';
import Home from './components/pages/Home';

import UserAccount from './components/pages/user/Account/Page';
import UserInfo from './components/pages/user/Info/Page';
import UserWXCharge from './components/pages/user/WXCharge/Page'
import UserCharge from './components/pages/user/Charge/Page';
import UserExchange from './components/pages/user/Exchange/Page';
import UserPayOrder from './components/pages/user/PayOrder/Page';

import UserChargeHistory from './components/pages/user/ChargeHistory/Page';
import UserExchangeHistory from './components/pages/user/ExchangeHistory/Page';
import UserReturnHistory from './components/pages/user/ReturnHistory/Page';

import UserLog from './components/pages/user/Log/Page';
import UserGivenHistory from './components/pages/user/GivenHistory/Page';
import UserConfiscatedHistory from './components/pages/user/ConfiscatedHistory/Page';

import UserCoin from './components/pages/user/Coin/Page';
import UserScore from './components/pages/user/Score/Page';

import PromoterAccount from './components/pages/promoter/Account/Page';
import PromoterCharge from './components/pages/promoter/Charge/Page';
import PromoterExchange from './components/pages/promoter/Exchange/Page';
import PromoterChargeHistory from './components/pages/promoter/ChargeHistory/Page';
import PromoterExchangeHistory from './components/pages/promoter/ExchangeHistory/Page';
import PromoterGivenHistory from './components/pages/promoter/GivenHistory/Page';
import PromoterConfiscatedHistory from './components/pages/promoter/ConfiscatedHistory/Page';

import PromoterLog from './components/pages/promoter/Log/Page';
import PromoterProfit from './components/pages/promoter/Profit/Page';


import AdministratorAccount from './components/pages/administrator/Account/Page';
import AdministratorLog from './components/pages/administrator/Log/Page';

import SettingGame from './components/pages/setting/Game/Page';
import SettingHall from './components/pages/setting/Hall/Page';
import SettingNotice from './components/pages/setting/Notice/Page';
import SettingServer from './components/pages/setting/Server/Page';
import SettingAuth from './components/pages/setting/Auth/Page';
import RechargeCode from './components/pages/setting/RechargeCode/Page';
import SettingDf from './components/pages/setting/Df/Page';
import SettingZone from './components/pages/setting/Zone/Page';
import SettingChannel from './components/pages/setting/Channel/Page';
import SettingWX from './components/pages/setting/WX/Page';
import SettingRoom from './components/pages/setting/Room/Page';
import SettingGameHall from './components/pages/setting/Game/Hall';
import SettingGameFish from './components/pages/setting/Game/Fish';
import SettingGameBull from './components/pages/setting/Game/Bull';
import SettingGameLion from './components/pages/setting/Game/Lion';
import SettingGamepirate from './components/pages/setting/Game/Pirate';

import VerifyReportCode from './components/pages/setting/Verify/Report/Page';
import VerifyExecuteCode from './components/pages/setting/Verify/Execute/Page';


import CoinOperation from './components/pages/coin/Operation/Page';
import CoinRechargeHistory from './components/pages/coin/RechargeHistory/Page';
import CoinExchangeHistory from './components/pages/coin/ExchangeHistory/Page';
// import UserAccount from './components/pages/

import CleanStatistics from './components/pages/setting/CleanStatistics/Page';
import ResetPlatform from './components/pages/setting/ResetPlatform/Page';

import ReleaseUpdate from './components/pages/release/Update/Page';
import ReleaseDeploy from './components/pages/release/Deploy/Page';

import ServerServerlist from './components/pages/server/Serverlist/Page';

import SystemServerlist from './components/pages/system/Serverlist/Page';

import StatisticsDetail from './components/pages/statistics/Detail/Page';
import StatisticsGameFish from './components/pages/statistics/Game/Fish';
import StatisticsGameBull from './components/pages/statistics/Game/Bull';
import StatisticsGameLion from './components/pages/statistics/Game/Lion';
import StatisticsGamepirate from './components/pages/statistics/Game/Pirate';
import StatisticsDailytotal from './components/pages/statistics/Dailytotal/Page';
import StatisticsDnudau from './components/pages/statistics/Dnudau/Page';
import StatisticsRetain from './components/pages/statistics/Retain/Page';
import StatisticsAwake from './components/pages/statistics/Awake/Page';
import StatisticsPlaytime from './components/pages/statistics/Playtime/Page';

import VenderReset from './components/pages/vender/Reset/Page';
import VenderHall from './components/pages/vender/Hall/Page';
import VenderProfit from './components/pages/vender/Profit/Page';
import VenderExport from './components/pages/vender/Export/Page';
import VenderServer from './components/pages/vender/Server/Page';
import VenderFishFactor from './components/pages/vender/Factor/Fish';
import VenderBullFactor from './components/pages/vender/Factor/Bull';
import VenderLionFactor from './components/pages/vender/Factor/Lion';
import VenderpirateFactor from './components/pages/vender/Factor/Pirate';

import Protocol from '../www/test/Page';
/**
 * Routes: https://github.com/reactjs/react-router/blob/master/docs/API.md#route
 *·
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
const AppRoutes = {
  /*管理员数据*/
  "0": (
    <Route path="/" component={Master}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Redirect from="user" to="user/account" />
      <Route path="user">
        <Route path="account" component={UserAccount} />
        <Route path="info" component={UserInfo} />
        <Route path="wxCharge" component={UserWXCharge} />
        <Route path="charge" component={UserCharge} />
        <Route path="exchange" component={UserExchange} />
        <Route path="payOrder" component={UserPayOrder} />
        <Route path="charge_history" component={UserChargeHistory} />
        <Route path="exchange_history" component={UserExchangeHistory} />
        <Route path="return_history" component={UserReturnHistory} />
        
        <Route path="given_history" component={UserGivenHistory} />
        <Route path="confiscated_history" component={UserConfiscatedHistory} />
        <Route path="log" component={Home} />
        <Route path="coin" component={UserCoin} />
        <Route path="score" component={UserScore} />
      </Route>
      <Redirect from="promoter" to="promoter/account" />
      <Route path="promoter">
        <Route path="account" component={PromoterAccount} />
        <Route path="charge" component={PromoterCharge} />
        <Route path="exchange" component={PromoterExchange} />
        <Route path="charge_history" component={PromoterChargeHistory} />
        <Route path="exchange_history" component={PromoterExchangeHistory} />
        <Route path="given_history" component={PromoterGivenHistory} />
        <Route path="confiscated_history" component={PromoterConfiscatedHistory} />

        <Route path="log" component={PromoterLog} />
        <Route path="profit" component={PromoterProfit} />

      </Route>
      <Redirect from="setting" to="setting/game" />
      <Route path="setting">
        <Route path="game">
          <Route path="hall" component={SettingGameHall} />
          <Route path="fish" component={SettingGameFish} />
          <Route path="bull" component={SettingGameBull} />
          <Route path="lion" component={SettingGameLion} />
          <Route path="pirate" component={SettingGamepirate} />
        </Route>

        <Route path="reportCode" component={VerifyReportCode} />
        <Route path="rechargeCode" component={RechargeCode} />
        <Route path="hall" component={Home} />
        <Route path="notice" component={SettingNotice} />
        <Route path="server" component={Home} />
        <Route path="auth" component={SettingAuth} />
        <Route path="df" component={Home} />
        <Route path="wx" component={SettingWX} />
        <Route path="room" component={Home} />
      </Route>
      <Redirect from="administrator" to="administrator/account" />
      <Route path="administrator">
        <Route path="account" component={AdministratorAccount} />
        <Route path="log" component={AdministratorLog} />
      </Route>
      <Redirect from="release" to="release/update" />
      <Route path="release">
        <Route path="update" component={ReleaseUpdate} />
        <Route path="deploy" component={ReleaseDeploy} />
      </Route>
      <Redirect from="server" to="/server/serverlist" />
      <Route path="server">
        <Route path="serverlist" component={ServerServerlist} />
      </Route>
      <Redirect from="system" to="/system/serverlist" />
      <Route path="system">
        <Route path="serverlist" component={SystemServerlist} />
      </Route>
      <Redirect from="coin" to="coin/operation" />
      <Route path="coin">
        <Route path="operation" component={Home} />
        <Route path="recharge_history" component={Home} />
        <Route path="exchange_history" component={Home} />
      </Route>
      <Route path="tool">
        <Route path="protocol" component={Home} />
      </Route>

      <Route path="statistics">
        <Route path="detail" component={StatisticsDetail} />
        <Route path="player">
          <Route path="dnudau" component={StatisticsDnudau} />
          <Route path="retain" component={StatisticsRetain} />
        </Route>
        <Route path="game">
          <Route path="fish" component={StatisticsGameFish} />
          <Route path="bull" component={StatisticsGameBull} />
          <Route path="lion" component={StatisticsGameLion} />
          <Route path="pirate" component={StatisticsGamepirate} />
        </Route>
        <Route path="dailytotal" component={StatisticsDailytotal} />
      </Route>
      {
        //   
        //   <Route path="retain" component={StatisticsRetain} />
        //   <Route path="awake" component={StatisticsAwake} />
        //   <Route path="playtime" component={StatisticsPlaytime} />
        // 
      }
    </Route>
  ),
  /*推广员数据*/
  "1": (
    <Route path="/" component={Master}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Redirect from="user" to="user/account" />
      <Route path="user">
        <Route path="account" component={UserAccount} />
        <Route path="wxCharge" component={UserWXCharge} />
        <Route path="charge" component={UserCharge} />
        <Route path="exchange" component={UserExchange} />
        <Route path="charge_history" component={UserChargeHistory} />
        <Route path="exchange_history" component={UserExchangeHistory} />
        <Route path="log" component={Home} />
        <Route path="coin" component={UserCoin} />
        <Route path="score" component={UserScore} />
      </Route>
      <Redirect from="promoter" to="promoter/account" />
      <Route path="promoter">
        <Route path="account" component={Home} />
        <Route path="charge" component={Home} />
        <Route path="exchange" component={Home} />
        <Route path="charge_history" component={Home} />
        <Route path="exchange_history" component={Home} />
        <Route path="log" component={Home} />
      </Route>
      <Redirect from="setting" to="setting/game" />
      <Route path="setting">
        <Route path="game" component={Home} />
        <Route path="hall" component={Home} />
        <Route path="notice" component={Home} />
        <Route path="server" component={Home} />
        <Route path="auth" component={Home} />
        <Route path="df" component={Home} />
        <Route path="wx" component={Home} />
        <Route path="room" component={Home} />
      </Route>
      <Redirect from="administrator" to="administrator/account" />
      <Route path="administrator">
        <Route path="account" component={Home} />
        <Route path="log" component={Home} />
      </Route>
      <Redirect from="release" to="release/update" />
      <Route path="release">
        <Route path="update" component={Home} />
        <Route path="deploy" component={Home} />
      </Route>
      <Redirect from="server" to="/server/serverlist" />
      <Route path="server">
        <Route path="serverlist" component={Home} />
      </Route>
      <Redirect from="system" to="/system/serverlist" />
      <Route path="system">
        <Route path="serverlist" component={Home} />
      </Route>
      <Redirect from="coin" to="coin/operation" />
      <Route path="coin">
        <Route path="operation" component={CoinOperation} />
        <Route path="recharge_history" component={CoinRechargeHistory} />
        <Route path="exchange_history" component={CoinExchangeHistory} />
      </Route>
      <Route path="tool">
        <Route path="protocol" component={Home} />
      </Route>
    </Route>
  ),
  "2": (
    <Route path="/" component={Master}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Redirect from="statistics" to="statistics/detail" />
      <Route path="user">
        <Route path="account" component={UserAccount} />
        <Route path="wxCharge" component={UserWXCharge} />
        <Route path="charge" component={UserCharge} />
        <Route path="exchange" component={UserExchange} />
        <Route path="charge_history" component={UserChargeHistory} />
        <Route path="exchange_history" component={UserExchangeHistory} />
        <Route path="log" component={UserLog} />
        <Route path="coin" component={UserCoin} />
        <Route path="score" component={UserScore} />
      </Route>
      <Redirect from="promoter" to="promoter/account" />
      <Route path="promoter">
        <Route path="account" component={PromoterAccount} />
        <Route path="charge" component={PromoterCharge} />
        <Route path="exchange" component={PromoterExchange} />
        <Route path="charge_history" component={PromoterChargeHistory} />
        <Route path="exchange_history" component={PromoterExchangeHistory} />
        <Route path="log" component={PromoterLog} />
      </Route>
      <Redirect from="setting" to="setting/game" />
      <Route path="setting">
        <Route path="game" component={SettingGame} />
        <Route path="hall" component={SettingHall} />
        <Route path="notice" component={SettingNotice} />
        <Route path="server" component={SettingServer} />
        <Route path="auth" component={SettingAuth} />
        <Route path="df" component={SettingDf} />
        <Route path="wx" component={SettingWX} />
        <Route path="room" component={SettingRoom} />
        <Route path="game_hall" component={VenderHall} />

        <Route path="executeCode" component={VerifyExecuteCode} />

      </Route>
      <Route path="game_setting">
        <Route path="cleanStatistics" component={CleanStatistics} />
        <Route path="resetPlatform" component={ResetPlatform} />
      </Route>

      <Redirect from="administrator" to="administrator/account" />
      <Route path="administrator">
        <Route path="account" component={AdministratorAccount} />
        <Route path="log" component={AdministratorLog} />
      </Route>
      <Redirect from="release" to="release/update" />
      <Route path="release">
        <Route path="update" component={ReleaseUpdate} />
        <Route path="deploy" component={ReleaseDeploy} />
      </Route>
      <Redirect from="server" to="/server/serverlist" />
      <Route path="server">
        <Route path="serverlist" component={ServerServerlist} />
      </Route>
      <Redirect from="system" to="/system/serverlist" />
      <Route path="system">
        <Route path="serverlist" component={SystemServerlist} />
      </Route>
      <Redirect from="coin" to="coin/operation" />
      <Route path="coin">
        <Route path="operation" component={Home} />
        <Route path="recharge_history" component={Home} />
        <Route path="exchange_history" component={Home} />
      </Route>
      <Route path="tool">
        <Route path="protocol" component={Protocol} />
      </Route>
      <Route path="statistics">
        <Route path="detail" component={StatisticsDetail} />
        <Route path="game">
          <Route path="fish" component={StatisticsGameFish} />
          <Route path="bull" component={StatisticsGameBull} />
          <Route path="lion" component={StatisticsGameLion} />
          <Route path="pirate" component={StatisticsGamepirate} />
        </Route>
        <Route path="dailytotal" component={StatisticsDailytotal} />
      </Route>
    </Route>
  ),
  "3": (
    <Route path="/" component={Master}>
      <IndexRoute component={Home} />
      <Route path="home" component={Home} />
      <Redirect from="vender" to="vender/detail" />
      <Route path="vender">
        <Route path="detail" component={StatisticsDetail} />
        <Route path="log" component={UserLog} />
        <Route path="reset" component={VenderReset} />
        <Route path="profit" component={VenderProfit} />
        <Route path="export" component={VenderExport} />
        <Route path="auth" component={SettingAuth} />
        <Route path="server" component={VenderServer} />
        <Route path="factor">
          <Route path="fish" component={VenderFishFactor} />
          <Route path="bull" component={VenderBullFactor} />
          <Route path="lion" component={VenderLionFactor} />
          <Route path="pirate" component={VenderpirateFactor} />
        </Route>
      </Route>
    </Route>
  )
}

export default AppRoutes;
