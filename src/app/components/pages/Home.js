import React, { Component, PropTypes } from 'react';
import FullWidthSection from '../FullWidthSection';
import RaisedButton from 'material-ui/RaisedButton';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import spacing from 'material-ui/styles/spacing';
import typography from 'material-ui/styles/typography';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { cyan500, grey200, darkWhite, deepPurple900 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
// import IconIndex from 'material-ui/svg-icons/index';
import IconMoeny from 'material-ui/svg-icons/editor/money-off';

import Util from '../../util';
import PromoterNavigation from "../myComponents/Navigation/PromoterNavigation";
// const indexIcon = <IconIndex />;
const moneyIcon = <IconMoeny />;
const nearbyIcon = <IconLocationOn />;

class HomePage extends Component {

  state = {
    selectedIndex: 0
  }

  select = (index) => this.setState({ selectedIndex: index });

  static propTypes = {
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };



  render() {
    const styles = {
      bottomNavigation: {
        position: "fixed",
        bottom: 0
      }
    };
    if (apptype === 1 && sessionStorage.isPC === "false") {
      return (
        <div >
          {/*{window.socket.connected ? "" :
            <div>
              <Dialog
                title={Lang[window.Lang].Master.logType[apptype]}
                modal={false}
                open={this.state.loginFormOpen}
                onRequestClose={this.handleClose}
              >


                <TextField
                  name="account"
                  id="login_account"
                  hintText={Lang[window.Lang].Master.input_your_account}
                  floatingLabelText={Lang[window.Lang].Master.account}
                  fullWidth={true}
                />
                <TextField
                  name="password"
                  id="login_password"
                  type="password"
                  hintText={Lang[window.Lang].Master.input_your_password}
                  floatingLabelText={Lang[window.Lang].Master.password}
                  fullWidth={true}
                />
                <TextField
                  name="auth"
                  id="login_auth"
                  type="auth"
                  hintText={Lang[window.Lang].Master.input_your_auth}
                  floatingLabelText={Lang[window.Lang].Master.auth}
                  fullWidth={true}
                />
                <br />

                <RaisedButton
                  label={Lang[window.Lang].Master.log_in}
                  primary={true}
                  style={this.demoStyle}
                  type="submit"
                  onMouseUp={this.loginRequest}
                />
              </Dialog>
              <PromoterNavigation />
            </div>}*/}
        </div>
      )
    } else {
      return (
        <div >
        </div>
      )
    };
  }
}

export default withWidth()(HomePage);
