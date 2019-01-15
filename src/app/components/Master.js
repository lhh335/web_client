import { ERROR_ENSURE_SERVER_RUNNING, ERROR_SESSION, ERROR_NULL_GOOGLE_AUTH, ERROR_NETWORK, LOGIC_SUCCESS } from "../ecode_enum";
import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import spacing from 'material-ui/styles/spacing';
import { darkWhite, lightWhite, grey900, deepPurple900 } from 'material-ui/styles/colors';
import AppNavDrawer from './AppNavDrawer';
import FullWidthSection from './FullWidthSection';
import withWidth, { MEDIUM, LARGE } from 'material-ui/utils/withWidth';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import ArrowDropRight from 'material-ui/svg-icons/navigation/chevron-left';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import RaisedButton from 'material-ui/RaisedButton';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import BeingLoading from './myComponents/BeingLoading/BeingLoading';
// import getLightTheme from '../themes/getLightTheme';
// import getDarkTheme from '../themes/getDarkTheme';
// import baseDarkTheme from '../themes/base/darkBaseTheme';

import MsgEmitter from '../MsgEmitter';
import MsgMap from '../proto_map.json';
import Lang from '../Language';
import Util from '../util';
import CommonAlert from './myComponents/Alert/CommonAlert'
// import config from 'config.json';
import appConfig from '../config.json';
import {
  POLLING_MESSAGE_S2C, POLLING_MESSAGE_C2S, DROP_LINK_C2S, USER_LOG_OUT_C2S, USER_LOG_OUT_S2C, ADMIN_LOGIN_C2S, ADMIN_LOGIN_AUTH_C2S, PROMOTER_LOGIN_AUTH_C2S,
  PROMOTER_LOGIN_C2S, SESSION_LOGIN_C2S, RESET_PROMOTER_C2S, RESET_ADMINISTRATER_C2S, MANAGER_LOGIN_AUTH_C2S, VENDER_LOGIN_AUTH_C2S,
  QUERY_SESSIONS_C2S, GET_VENDER_AUTH_S2C, GET_VENDER_AUTH_C2S, RESET_ADMINISTRATER_S2C, RESET_PROMOTER_S2C,
} from '../proto_enum';

class Master extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: PropTypes.object,
  };

  state = {
    socket_connect: false,    // socket 连接
    navDrawerOpen: false,
    inputSocketOpen: false,  // ip窗口
    loginFormOpen: true,  //登录窗口
    logged: true, // 用户登录

    resetDialog: false,
    detailDialog: false,
    sessionDialog: false,
    openAlert: false,
    type: "notice",
    code: 0,
    content: "",

    connect_ip: "",         //连接地址
    login_user: "",         // 登录用户
    rememberLogin: false,
    singleUserInfo: [],
    theme: localStorage.curtaTheme ? localStorage.curtaTheme : "light",
    trade_notice: {},
    beingLoading: false,
    windowHeight: window.innerHeight,
    originWindowHeight: window.innerHeight,
    loginSessionData: []
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', (e) => {
      this.setState({
        windowHeight: window.innerHeight
      })
    })
    if (document.getElementById('app-bar')) {
      var app_bar = document.getElementById('app-bar');
      if (app_bar.firstChild.nextSibling) {
        var selectedElement = app_bar.firstChild.nextSibling;
        if (app_bar.hasChildNodes('h1') && selectedElement.nodeName === 'H1') {
          selectedElement.style.height = '50px';
          selectedElement.style.lineHeight = '50px';
        }
      }
    }
  }

  /**
   * 处理奇葩的文本框内容继承
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputSocketOpen === true && prevState.inputSocketOpen === false && this.state.logged === false) {
      if (document.getElementById("login_account") !== null) {
        document.getElementById("login_account").value = this.state.connect_ip.replace("wss://", "").replace("/websocket", "");
      }
    }
    if (this.state.inputSocketOpen === false && prevState.inputSocketOpen === true && this.state.logged === false) {
      document.getElementById("socket_ip_textfiled").value = this.state.login_user ? this.state.login_user : "";
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
    });
  }

  getStyles() {
    var themecolor = this.state.theme === "dark" ? "#303030" : "#ffffff";
    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
        height: 50,

      },
      root: {
        paddingTop: 0,
        backgroundColor: themecolor,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
        marginLeft: 30
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '20 auto',
        padding: 0,
        color: darkWhite,
        maxWidth: 356,
      },
      browserstack: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: '25px 15px 0',
        padding: 0,
        color: darkWhite,
        lineHeight: '25px',
        fontSize: 12,
      },
      browserstackLogo: {
        margin: '0 3px',
      },
      iconButton: {
        color: darkWhite,
      },
      simple: {
        margin: "0 16px",
        marginTop: "100px",
        marginRight: "16px",
        marginBottom: "0px",
        marginLeft: "16px",

      }
    };

    // if (this.props.width === MEDIUM || this.props.width === LARGE) {
    styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    // }

    return styles;
  }

  handleConnect = (event) => {
    this.setState({ inputSocketOpen: false });
  }

  handleOpen = (event, logged) => {
    this.setState({ loginFormOpen: true });
  };

  handleClose = () => {
    this.setState({ loginFormOpen: false });
  };

  handleChangeLogin = (logged) => {
    this.setState({
      logged: logged,
      loginFormOpen: !logged
    });
  };

  handleOpenDetail = () => {
    this.setState({ detailDialog: true });
  }

  handleCloseDetail = () => {
    this.setState({ detailDialog: false });
  }

  handleOpenSession = () => {
    this.setState({ sessionDialog: true });
  }

  handleCloseSession = () => {
    this.setState({ sessionDialog: false });
  }

  handleOpenReset = () => {
    this.setState({ resetDialog: true });
  }

  handleCloseReset = () => {
    this.setState({ resetDialog: false });
  }

  popUpNotice = (type, code, content) => {
    this.setState({ type: type, code: code, content: content, openAlert: true });
  }

  componentWillMount() {
    window.master = this;

    // 选择主题
    switch (this.state.theme) {
      case "dark":
        this.setState({
          muiTheme: getMuiTheme(darkBaseTheme),
        });
        break;
      case "light":
        this.setState({
          muiTheme: getMuiTheme(lightBaseTheme),
        });
        break;
    }



    if (apptype === 0) {
      this.relogin("admin");
    } else if (apptype === 1) {
      this.relogin("promoter");
    } else if (apptype === 2) {
      if (sessionStorage.logged === true) {
        this.connectSocket(true);
      } else {
        this.unlogin();
      }
    } else if (apptype === 3) {
      if (sessionStorage.logged === true) {
        this.connectSocket(true);
      } else {
        this.unlogin();
      }
    } else {
      this.unlogin();
    }

    addEventListener("loading", (e) => {
      this.setState({
        beingLoading: true
      })
    })
    addEventListener("profit_exceed_80per", () => {
      this.popUpNotice("warning", 0, "您的盈利已达极限, 请联系平台技术客服");
    })
    addEventListener("dataOnload", (e) => {
      this.setState({
        beingLoading: false
      })
    })
    addEventListener("socket_connect", this.handleConnect);
    addEventListener("app_log_out", this.logout);

    window.onbeforeunload = (e) => {
      if (this.state.rememberLogin === false) {
        if (apptype === 0) {
          localStorage.admin = "";
        } else if (apptype === 1) {
          localStorage.promoter = "";
        }
      } else {
        if (apptype === 0) {
          var admin = JSON.parse(localStorage.admin);
          admin.router = window.location.hash.substr(1);
          var save = JSON.stringify(admin);
          localStorage.admin = save;
          this.dropLink(1);
        } else if (apptype === 1) {
          var promoter_storage = JSON.parse(localStorage.promoter);
          promoter_storage.router = window.location.hash.substr(1);
          var save = JSON.stringify(promoter_storage);
          localStorage.promoter = save;
          this.dropLink(2);
        }
      }

      // 断开连接
      // this.clearConnect();
    }

    window.addEventListener("storage", function (e) {
      if (apptype === 0 && localStorage.admin !== undefined && localStorage.admin !== "") {
        window.master.relogin("admin");
      } else if (apptype === 1 && localStorage.promoter !== undefined && localStorage.promoter !== "") {
        window.master.relogin("promoter");
      }
    })
    window.onclose = function () {
    }
  }

  relogin = (type = "admin") => {
    try {
      Util.storage.getSession(type);
      this.state.connect_ip = sessionStorage.server_ip
      this.state.inputSocketOpen = false;
      this.state.loginFormOpen = false;
      this.state.rememberLogin = true;
      this.connectSocket(true);
    } catch (e) {
      this.state.rememberLogin = false;
      this.unlogin();
    }
  }

  unlogin = () => {
    this.state.connect_ip = sessionStorage.server_ip === undefined ? "" : sessionStorage.server_ip;
    if (this.state.connect_ip !== "") {
      this.state.loginFormOpen = true;
      this.state.inputSocketOpen = false;
    } else {
      this.state.loginFormOpen = true;
      this.state.inputSocketOpen = true;
    }
    this.setState({ navDrawerOpen: false, logged: false });
    sessionStorage.logged = false;
    this.context.router.push("/");
  }

  socketSetting = (socket_ip) => {
    if (window.socket) {
      console.log("new one");
    } else {
      try {
        window.socket = new WebSocket(socket_ip);
      } catch (error) {
        window.master.popUpNotice("notice", ERROR_ENSURE_SERVER_RUNNING, Lang[window.Lang].ErrorCode[ERROR_ENSURE_SERVER_RUNNING]);

      }
    }

    window.socket.reconnect = this.connectSocket;
    window.loginRequest = this.loginRequest;

    window.socket.onopen = function (event) {

      window.loginRequest();

      if (sessionStorage.logged === "true") {
        if (window.timerID) {
          window.clearInterval(window.timerID);
          window.master.setState({ openAlert: false });
          window.timerID = 0;
        }

      } else {
      }
      // 发送socket已经连接事件 用于更新页面
    };
    window.socket.onerror = function (event) {
      if (window.timerID2) {
        window.clearInterval(window.timerID2);
        window.timerID2 = 0;
      }
      window.master.popUpNotice("notice", ERROR_ENSURE_SERVER_RUNNING, Lang[window.Lang].ErrorCode[ERROR_ENSURE_SERVER_RUNNING]);
    };
    window.socket.onclose = function (event) {
      if (window.timerID2) {
        window.clearInterval(window.timerID2);
        window.timerID2 = 0;
      }
      var connectTimeOut;
      if (window.socket === undefined || window.socket.readyState !== 1) {
        if (sessionStorage.logged === "true") {
          if (!window.timerID) {
            window.timerID = setInterval(function () {

              try {
                if (sessionStorage.accountType === "0") {
                  Util.storage.getSession("admin")

                } else if (sessionStorage.accountType === "1") {
                  Util.storage.getSession("promoter")

                }
                window.master.popUpNotice("notice", 0, Lang[window.Lang].Master.reconnect);
                window.socket.reconnect();
              } catch (e) {
                sessionStorage.logged === "false"
                window.master.logout();
                window.clearInterval(window.timerID);
                window.master.setState({ openAlert: false });
                window.timerID = 0;
              }
            }, 5000);
          }
        } else {
          // window.master.logout();
          // window.master.state.socket_connect = false;
        }
      } else {
        if (sessionStorage.server_ip !== undefined && sessionStorage.server_ip !== "") {
          // 选择服务器面板
          window.socket.reconnect();
        }
      }
    };
  }

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open,
    });
  };

  handleChangeList = (event, value) => {
    this.context.router.push(value);
    this.setState({
      navDrawerOpen: true,
      docked: true
    });
  };

  handleChangeMuiTheme = (muiTheme) => {
    this.setState({
      muiTheme: muiTheme,
    });
  };

  connectSocket = (only_create = false) => {

    // 连接服务器
    var websocket;
    window.socket = websocket;

    if (sessionStorage.server_ip !== undefined && sessionStorage.server_ip !== "") {
      this.socketSetting(sessionStorage.server_ip);
    }
  }

  polling = () => {
    var cb = function (id, message, arg) {
      if (id !== POLLING_MESSAGE_S2C) {
        return
      }
      var self = arg[0];
      var tradeObj = JSON.parse(message.msg);
      for (var k in tradeObj) {
        if (tradeObj[k] !== self.state.trade_notice[k]) {
          self.state.trade_notice = tradeObj;
          self.setState({ trade_notice: tradeObj })
          break;
        }
      }
    }

    var obj = {
      "account": sessionStorage.account,
      "type": sessionStorage.accountType === "0" ? 1 : 2,
    };
    MsgEmitter.emit(POLLING_MESSAGE_C2S, obj, cb, [this]);
  }

  dropLink = (type) => {
    var cb = function (id, message, arg) {
      var self = arg[0];
      // self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      self.context.router.push("/");
      self.setState({ navDrawerOpen: false, loginFormOpen: true, inputSocketOpen: false, logged: false });
    }

    var obj = {
      "account": sessionStorage.account,
      "type": type,
      "session": sessionStorage.session,
    };

    MsgEmitter.emit(DROP_LINK_C2S, obj, cb, [this]);
  }

  clearConnect = (type) => {
    if (((localStorage.admin === undefined || localStorage.admin === "") && type === 1) || ((localStorage.promoter === undefined || localStorage.promoter === "") && type === 2)) {
      return;
    }
    var cb = function (id, message, arg) {
      var self = arg[0];
      // self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
      if (id === USER_LOG_OUT_S2C && message.code === ERROR_SESSION) {
        self.logout();
        self.context.router.push("/");
        self.setState({ navDrawerOpen: false, loginFormOpen: true, inputSocketOpen: false, logged: false });
      }
    }

    var obj = {
      "account": sessionStorage.account,
      "type": type,
      "session": sessionStorage.session,
    };

    MsgEmitter.emit(USER_LOG_OUT_C2S, obj, cb, [this]);
  }

  logout = () => {
    this.state.connect_ip = sessionStorage.server_ip === undefined ? "" : sessionStorage.server_ip;
    if (sessionStorage.account !== undefined && sessionStorage.accountType !== undefined && sessionStorage.session !== undefined) {
      if (apptype === 0) {
        this.clearConnect(1);
        Util.storage.clearSession("admin");
      } else if (apptype === 1) {
        this.clearConnect(2);
        Util.storage.clearSession("promoter");
      }
    }
    if (window.timerID2) {
      window.clearInterval(window.timerID2);
      window.timerID2 = 0;
    }
    this.context.router.push("/");
    this.setState({ navDrawerOpen: false, loginFormOpen: true, logged: false, socket_connect: false, inputSocketOpen: false });
  }

  loginRequest = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      // this.popUpNotice("notice", ERROR_ENSURE_SERVER_RUNNING, Lang[window.Lang].ErrorCode[ERROR_ENSURE_SERVER_RUNNING]);
      return;
    }
    this.state.socket_connect = true;
    var cb = function (id, message, arg) {
      var self = arg[0];
      if (message.code === LOGIC_SUCCESS) {
        var version = appConfig.app_version.split(".");
        // if (version[0] * 10000 + version[1] * 100 + version[2] * 1 >= 1000) {
        if (apptype !== 2 && apptype !== 3) {
          self.polling();
          window.timerID2 = setInterval(function () {
            if (window.socket === undefined || window.socket.readyState !== 1) {
              return;
            } else {
              self.polling();
            }
          }, 5000);
        }

        // }

        if (arg[3] === true) {
          self.popUpNotice("notice", message.code, Lang[window.Lang].Master.login_success);
        }

        var self = arg[0];

        self.handleChangeLogin(true);
        sessionStorage.accountType = apptype.toString();

        if (apptype === 2 || apptype === 3) {
          sessionStorage.logged = "true";
          sessionStorage.session = message.session;
          sessionStorage.server_version = message.version;
          self.setState({ navDrawerOpen: true });
          var subRoute = apptype === 2 ? "/statistics/detail" : apptype === 3 ? "/vender/detail" : "/user/account";
          self.context.router.push(subRoute);
        } else if (apptype === 1) {
          var userInfo = message.pi;
          sessionStorage.account = arg[1];
          sessionStorage.server_version = message.version;
          sessionStorage.session = userInfo[0].session;
          sessionStorage.logged = "true";
          userInfo[0].type = Lang[window.Lang].Master[sessionStorage.accountType];
          self.setState({ singleUserInfo: userInfo, navDrawerOpen: true });
          if (localStorage.promoter && sessionStorage.router !== "/") {
            self.context.router.push(sessionStorage.router);
            Util.event.dispatcher("socket_connect");

          } else {
            if (Util.phone.isPC()) {
              self.context.router.push("/user/account");
            } else {
              self.context.router.push("/app/main/");
            }
          }
          if (self.state.rememberLogin === true) {
            localStorage.promoter = Util.storage.create(apptype, arg[1], userInfo[0].session, sessionStorage.router, sessionStorage.server_ip);
          }

        } else if (apptype === 0) {
          var userInfo = message.ai;
          sessionStorage.server_version = message.version;
          sessionStorage.account = arg[1];
          sessionStorage.session = userInfo[0].session;
          sessionStorage.logged = "true";
          userInfo[0].type = Lang[window.Lang].Master[sessionStorage.accountType];
          self.setState({ singleUserInfo: userInfo, navDrawerOpen: true });
          if (localStorage.admin && sessionStorage.router !== "/") {
            self.context.router.push(sessionStorage.router);
            Util.event.dispatcher("socket_connect");

          } else {
            self.context.router.push("/user/account");
          }
          if (self.state.rememberLogin === true) {
            localStorage.admin = Util.storage.create(apptype, arg[1], userInfo[0].session, sessionStorage.router, sessionStorage.server_ip);
          }
        }
      } else {
        self.popUpNotice("notice", message.code, Lang[window.Lang].ErrorCode[message.code]);
        if (self.state.loginFormOpen === false) {
          self.unlogin();
        }
        // self.logout();
        return;
      }
    }

    var account, password, session, auth;
    var protocol;
    var obj = {};
    var isLogin = true;
    if (sessionStorage.logged === "true") {
      account = sessionStorage.account;
      session = sessionStorage.session;
      isLogin = false;


      switch (apptype) {
        case 0:
          obj = {
            "account": account,
            "session": session,
          };
          protocol = ADMIN_LOGIN_C2S;
          break;
        case 1:
          obj = {
            "account": account,
            "session": session,
          };
          protocol = PROMOTER_LOGIN_C2S;
          break;
        case 2:
          obj = {
            "type": 4,
            "session": session,
          };
          protocol = SESSION_LOGIN_C2S;
          break;
        case 3:
          obj = {
            "type": 5,
            "session": session,
          };
          protocol = SESSION_LOGIN_C2S;
          break;
      }

    } else if (sessionStorage.logged === "false") {
      auth = document.getElementById("login_auth").value;
      if (auth === null || auth === "") {
        this.popUpNotice("notice", ERROR_NULL_GOOGLE_AUTH, Lang[window.Lang].ErrorCode[ERROR_NULL_GOOGLE_AUTH]);
        return;
      }
      if (apptype === 2) {
        obj = {
          "auth": parseInt(auth)
        };

        isLogin = true;
        protocol = MANAGER_LOGIN_AUTH_C2S;
      } else if (apptype === 3) {
        obj = {
          "auth": parseInt(auth)
        };

        isLogin = true;
        protocol = VENDER_LOGIN_AUTH_C2S;
      } else {
        account = document.getElementById("login_account").value;
        password = document.getElementById("login_password").value;
        auth = document.getElementById("login_auth").value;

        if (this.state.rememberLogin === true) {
          sessionStorage.account = account;
          sessionStorage.relogin = true;
        } else {
          sessionStorage.account = account;
          sessionStorage.relogin = false;
          if (apptype === 1) {
            localStorage.promoter = "";
          } else if (apptype === 0) {
            localStorage.admin = "";
          }
        }
        if (auth === "") {
          this.popUpNotice("notice", ERROR_NULL_GOOGLE_AUTH, Lang[window.Lang].ErrorCode[ERROR_NULL_GOOGLE_AUTH]);
          return;
        }
        isLogin = true;
        obj = {
          "account": account,
          "password": password,
          "auth": parseInt(auth)
        };

        switch (apptype) {
          case 0:
            protocol = ADMIN_LOGIN_AUTH_C2S;
            break;
          case 1:
            protocol = PROMOTER_LOGIN_AUTH_C2S;
            break;
        }
      }
    }
    if (MsgEmitter.emit(protocol, obj, cb, [this, account, password, isLogin])) {
    } else {
      // this.popUpNotice("notice", ERROR_NETWORK, Lang[window.Lang].ErrorCode[ERROR_NETWORK]);
      // this.handleClose();
      if (sessionStorage.logged === "true") {
        window.socket.reconnect(sessionStorage.server_ip);
      }
    }
  }

  onRememberLogin = (e, isInputChecked) => {
    this.setState({ rememberLogin: isInputChecked });
  }

  insertDetail = () => {
    if (this.state.singleUserInfo.length !== 1) {
      return [];
    }
    var userInfo = this.state.singleUserInfo[0];
    var table = Lang[window.Lang].Master.user_table;
    var list = [];
    for (var key in table) {
      if (sessionStorage.accountType === "0" && key === "game_coin") {
        continue;
      }
      list.push(
        <ul key={key}>
          <li>
            {table[key]}: {userInfo === {} ? "" :
              key === "language" ? Lang[window.Lang].Lang[1] :
                key === "time" ? Util.time.getTimeString(userInfo.time) : userInfo[key]}
            <br />
          </li>
        </ul>
      )
    }
    return list;
  }

  ResetDialog = () => {
    return (<Dialog
      title={Lang[window.Lang].Master.reset_account}
      actions={[<FlatButton
        label={Lang[window.Lang].Master.certain_button}
        primary={true}
        onTouchTap={this.resetPassword}
      />]}
      modal={false}
      open={this.state.resetDialog}
      onRequestClose={this.handleCloseReset}
      autoScrollBodyContent={true}
    >
      <TextField
        id="your_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Master.your_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="reset_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Master.new_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />
      <TextField
        id="reset_again_password_text_field"
        disabled={false}
        multiLine={false}
        type="password"
        hintText={Lang[window.Lang].Master.again_password}
        defaultValue=""
        fullWidth={true}
      />
      <br />
    </Dialog>)
  }

  resetPassword = () => {
    if (window.socket === undefined || window.socket.readyState !== 1) {
      this.popUpNotice("notice", ERROR_NETWORK, Lang[window.Lang].ErrorCode[ERROR_NETWORK]);
      return;
    }
    var account = sessionStorage.account;
    if (account === "") {
      return;
    }
    var cb = function (id, message, arg) {
      if (id === RESET_PROMOTER_S2C || id === RESET_ADMINISTRATER_S2C) {
        var self = arg;
        // self.popUpNotice("notice", message.code, Lang[window.Lang].Master.action_success);
        self.handleCloseReset();
        self.popUpNotice("notice", message.code, Lang[window.Lang].Master.password_change_success);
        if (message.code === LOGIC_SUCCESS) {
          self.logout();

        }
        // location.replace("/web_client");
      }
    }
    var your_password = document.getElementById("your_password_text_field");
    var password = document.getElementById("reset_password_text_field");
    var again_password = document.getElementById("reset_again_password_text_field");
    if (password.value !== again_password.value) {
      return;
    }
    var obj = {
      "target_account": sessionStorage.account,
      "your_password": your_password.value,
      "password": password.value
    }
    switch (sessionStorage.accountType) {
      case "0":
        MsgEmitter.emit(RESET_ADMINISTRATER_C2S, obj, cb, this);
        break;
      case "1":
        MsgEmitter.emit(RESET_PROMOTER_C2S, obj, cb, this);
        break;
    }
  }

  getSessions = () => {
    var list = [];
    for (var i = 0; i < this.state.loginSessionData.length; i++) {
      list.push(<ListItem
        value={this.state.loginSessionData[i].id}
        key={i} leftIcon={<ContentSend />}
        primaryText={this.state.loginSessionData[i].id}
        secondaryText={"登录于" + Util.time.getTimeString(this.state.loginSessionData[i].login_time)}
        onTouchTap={(event) => {
          var cb = function (id, message, arg) {
            var self = arg[0];
            if (message.code === LOGIC_SUCCESS) {
              // sel
              self.handleCloseSession();
            }
          }

          var obj = {
            "account": sessionStorage.account,
            "type": 1,
            "session": event.target.textContent,
          };

          MsgEmitter.emit(USER_LOG_OUT_C2S, obj, cb, [this]);
        }}
      />)
    }
    return list;
  }

  Logged = (props) => (
    <div>
      <IconButton
        iconStyle={{ color: darkWhite }}
        onTouchTap={() => {
          window.currentPage.refresh();
        }}
      >
        <Refresh />
      </IconButton>
      <IconMenu
        {...props}
        iconButtonElement={

          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText={Lang[window.Lang].Master.change_theme}
          leftIcon={<ArrowDropRight />}
          menuItems={[
            <MenuItem primaryText={Lang[window.Lang].Master.bright}
              onTouchTap={() => {
                this.setState({ theme: "light", muiTheme: getMuiTheme(lightBaseTheme) })
                localStorage.curtaTheme = "light";
              }}
            />,
            <MenuItem primaryText={Lang[window.Lang].Master.dark}
              onTouchTap={() => {
                this.setState({ theme: "dark", muiTheme: getMuiTheme(darkBaseTheme) })
                localStorage.curtaTheme = "dark";
              }} />,
          ]}
        />
        {(apptype !== 2 && apptype !== 3) ?
          <MenuItem
            primaryText={sessionStorage.account}
            leftIcon={<ArrowDropRight />}
            menuItems={[
              <MenuItem primaryText={sessionStorage.accountType === "0" ? Lang[window.Lang].Master["admin"] : Lang[window.Lang].Master["promoter"]} />,

              <Divider />,
              <MenuItem primaryText={Lang[window.Lang].Master.personal}
                onTouchTap={() => {
                  this.handleOpenDetail();
                }} />,
              <MenuItem primaryText={Lang[window.Lang].Master.login_session}
                onTouchTap={() => {
                  var cb = (id, message, arg) => {
                    var self = arg[0];
                    self.state.loginSessionData = message.si;
                    self.handleOpenSession();
                  }
                  var obj = {
                    "account": sessionStorage.account,
                    "type": 1,
                    "session": sessionStorage.session,
                  }
                  MsgEmitter.emit(QUERY_SESSIONS_C2S, obj, cb, [this]);
                }} />,
              <MenuItem
                primaryText={Lang[window.Lang].Master.reset_password}
                onTouchTap={() => {
                  this.handleOpenReset();
                }} />,
              <MenuItem
                primaryText={Lang[window.Lang].Master.log_out}
                onTouchTap={() => {

                  // location.reload();
                  // location.replace("/web_client");
                  this.logout();

                }
                } />
            ]}
          />
          : ""}

      </IconMenu>
    </div>

  );

  DetailDialog = () => {
    return (
      <Dialog
        modal={false}
        open={this.state.detailDialog}
        onRequestClose={this.handleCloseDetail}

      >
        {
          this.insertDetail().map((key) => (key))
        }
      </Dialog>
    )
  }

  SessionsDialog = () => {
    return (
      <Dialog
        title={Lang[window.Lang].Master.login_session}
        modal={false}
        open={this.state.sessionDialog}
        onRequestClose={this.handleCloseSession}
        autoScrollBodyContent={true}>
        当前登录: {sessionStorage.session}
        {this.getSessions()}
      </Dialog>)
  }

  ServerIpInput = () => {
    return (
      <div>
        <TextField
          name="socket_ip_textfiled"
          id="socket_ip_textfiled"
          hintText={Lang[window.Lang].Master.server_ip}
          floatingLabelText={Lang[window.Lang].Master.server_ip}
          fullWidth={true}
          defaultValue={this.state.connect_ip.replace("wss://", "").replace("/websocket", "").replace(/ /g, '')}
        />
        <RaisedButton
          id="server_ip_button"
          label={Lang[window.Lang].Master.connect}
          primary={true}
          type="submit"
          fullWidth={true}
          onTouchTap={(e) => {

            var reg = /^(localhost|([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})$/;
            if (reg.test(document.getElementById("socket_ip_textfiled").value)) {

            } else {
              window.master.popUpNotice('notice', 0, '服务器地址格式错误');
              return;
            }

            var input_ip = "wss://" + document.getElementById("socket_ip_textfiled").value.replace(/ /g, '') + "/websocket";
            sessionStorage.server_ip = input_ip;
            this.state.connect_ip = input_ip;
            this.handleConnect(e);

            if (apptype === 3) {
              window.socket = new WebSocket(input_ip)
              window.socket.onopen = (e) => {
                MsgEmitter.emit(GET_VENDER_AUTH_C2S, {}, (id, msg, arg) => {
                  if (id !== GET_VENDER_AUTH_S2C) return;
                  console.log(msg.auth)
                }, []);
              }
            }

            // if (sessionStorage.connect_ip === undefined || (input_ip != "wss:///websocket" && sessionStorage.connect_ip != input_ip)) {
            //   sessionStorage.connect_ip = "wss://" + document.getElementById("socket_ip_textfiled").value + "/websocket";
            // }

          }}
        />
      </div>)
  }

  LoginInput = () => {
    return (
      <div style={{ paddingBottom: 30 }}>
        {(apptype !== 2 && apptype !== 3) ?
          <div>
            <TextField
              name="login_account"
              id="login_account"
              hintText={Lang[window.Lang].Master.input_your_account}
              floatingLabelText={Lang[window.Lang].Master.account}
              fullWidth={true}
              defaultValue={sessionStorage.account}
            />
            <TextField
              name="password"
              id="login_password"
              type="password"
              hintText={Lang[window.Lang].Master.input_your_password}
              floatingLabelText={Lang[window.Lang].Master.password}
              fullWidth={true}
              defaultValue={""}
            />
            <Checkbox
              label="记住登录状态"
              checked={this.state.rememberLogin}
              style={{
                checkbox: {
                  marginTop: 10,
                  marginBottom: 10
                },
              }}
              onCheck={this.onRememberLogin}
            />
          </div> : ""}
        <TextField
          name="auth"
          id="login_auth"
          type="auth"
          hintText={Lang[window.Lang].Master.input_your_auth}
          floatingLabelText={Lang[window.Lang].Master.auth}
          fullWidth={true}
          onChange={() => {
            document.getElementById('login_auth').onkeydown = (e) => {
              var ev = e || window.event;
              if (ev.keyCode === 13) {
                this.connectSocket();
              }
            }
          }}
        />
        <br />

        <RaisedButton
          id="login_button"
          label={Lang[window.Lang].Master.login}
          primary={true}
          style={{
            Fmargin: "0px",
            marginTop: "5px",
            marginBottom: "2px",
          }}
          type="submit"
          fullWidth={true}
          onTouchTap={this.connectSocket}
        />
        <br />
        <RaisedButton id="promoter_ip" label="设置服务器地址" style={{
          Fmargin: "0px",
          marginTop: "5px",
          marginBottom: "2px",
        }} secondary={true} fullWidth={true} onTouchTap={
          // sessionStorage.accountType = apptype.toString();
          () => {
            // sessionStorage.connect_ip = "";
            if (apptype !== 2 && apptype !== 3) {
              this.state.login_user = document.getElementById("login_account").value;
            }
            this.setState({ navDrawerOpen: false, inputSocketOpen: true });
          }
        } />
        <h6 style={this.state.windowHeight <= (this.state.originWindowHeight - 50) ? { display: 'none' } : { position: 'fixed', bottom: 10, left: 0, right: 0, margin: 'auto 0px', textAlign: 'center' }}>版本号: {appConfig.app_version + "_" + appConfig.web_version}</h6>

      </div >)
  }

  AppLoginDialog = () => {
    const simple = {
      margin: "0 16px",
      marginTop: "100px",
      marginRight: "16px",
      marginBottom: "0px",
      marginLeft: "16px",
    }
    if (this.state.inputSocketOpen === true) {
      return (
        <div style={simple}>
          {this.ServerIpInput()}
        </div>
      )
    } else {
      return (
        <div style={simple}>
          {this.LoginInput()}
        </div>)
    }
  }

  PCLoginDialog = () => {
    if (this.state.inputSocketOpen === true) {
      return (<Dialog
        title={"输入连接服务器地址"}
        modal={false}
        open={this.state.loginFormOpen}
        onRequestClose={this.handleClose}
      >
        {this.ServerIpInput()}
      </Dialog>)
    } else {
      return (<Dialog
        title={Lang[window.Lang].Master.logType[apptype]}
        modal={false}
        open={this.state.loginFormOpen}
        onRequestClose={this.handleClose}
      >
        {this.LoginInput()}

      </Dialog>)
    }
  }

  render() {

    this.Logged.muiName = 'IconMenu';

    const {
      location,
      children,
    } = this.props;

    let {
      navDrawerOpen,
      logged,
      loginFormOpen
    } = this.state;

    const {
          prepareStyles,
        } = this.state.muiTheme;

    const router = this.context.router;
    const styles = this.getStyles();
    const title =
      router.isActive('/user') ? Lang[window.Lang].User.title :
        router.isActive('/promoter') ? Lang[window.Lang].Promoter.title :
          router.isActive('/setting') ? Lang[window.Lang].Setting.title :
            router.isActive('/tool') ? Lang[window.Lang].Tool.title :
              router.isActive('/administrator') ? Lang[window.Lang].Administrator.title :
                router.isActive('/release') ? Lang[window.Lang].Release.title :
                  router.isActive('/server') ? Lang[window.Lang].Server.title :
                    router.isActive('/system') ? Lang[window.Lang].System.title :
                      router.isActive('/statistics') ? Lang[window.Lang].Statistics.title :
                        router.isActive('/coin') ? Lang[window.Lang].Coin.title :
                          router.isActive('/vender') ? Lang[window.Lang].Vender.title :
                            router.isActive('/game_setting') ? Lang[window.Lang].game_setting.title : '';

    let docked = false;
    let showMenuIconButton = Util.phone.isPC() ? true : false;
    if (this.props.width === LARGE && Util.phone.isPC() && title !== '') {
      docked = true;
      navDrawerOpen = true;
      showMenuIconButton = true;

      styles.navDrawer = {
        zIndex: styles.appBar.zIndex - 1,
      };
      styles.root.paddingLeft = 200;
      styles.footer.paddingLeft = 200;
    } else {
      docked = false
      this.state.navDrawerOpen = false;
      showMenuIconButton = true
    }

    return (
      <div>
        {title !== '' ?
          <div style={prepareStyles(styles.root)}>
            <div style={prepareStyles(styles.content)}>
              {React.cloneElement(children, {
                onChangeMuiTheme: this.handleChangeMuiTheme,
              })}
            </div>
          </div> :
          children
        }
        {
          <div>
            <Title render={sessionStorage.accountType === "0" ? Lang[window.Lang].Master.admin_title :
              sessionStorage.accountType === "1" ? Lang[window.Lang].Master.promoter_title : sessionStorage.accountType === "3" ? Lang[window.Lang].Master.vender_title : sessionStorage.accountType === "2" ? Lang[window.Lang].Master.superAdmin_title : ''}
            />
            <AppBar
              id="app-bar"
              onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
              title={title}
              zDepth={0}
              style={styles.appBar}
              showMenuIconButton={showMenuIconButton}
              iconStyleRight={{ marginTop: 0 }}
              iconStyleLeft={{ marginTop: 0 }}

              iconElementRight={this.state.logged ?
                <this.Logged /> :
                <FlatButton
                  label={Lang[window.Lang].Master.login}
                  onTouchTap={
                    (event) => {
                      this.setState({ loginFormOpen: true });
                    }} />}
            />
            {this.state.logged ?
              <AppNavDrawer
                style={styles.navDrawer}
                location={location}
                docked={docked}
                onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
                onChangeList={this.handleChangeList}
                open={navDrawerOpen}
                tradeMsg={this.state.trade_notice}
              />
              : (Util.phone.isPC() ? this.PCLoginDialog() : this.AppLoginDialog())
            }
            {this.state.singleUserInfo.length === 1 ? this.DetailDialog() : ""}
            {this.ResetDialog()}
            {this.SessionsDialog()}
          </div>
        }
        <CommonAlert
          show={this.state.openAlert}
          type={this.state.type}
          code={this.state.code}
          content={this.state.content}
          handleCertainClose={() => {
            this.setState({ openAlert: false })
          }}
          handleCancelClose={() => {
            this.setState({ openAlert: false })
          }}>
        </CommonAlert>
        {this.state.beingLoading ?
          <BeingLoading /> : ''
        }
      </div>
    );
  }
}

export default withWidth()(Master);
