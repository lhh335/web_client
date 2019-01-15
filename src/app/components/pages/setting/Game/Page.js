import React, { Component } from 'react';
import Title from 'react-title-component';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import MsgEmitter from '../../../../MsgEmitter';
import Lang from '../../../../Language';

import FishGame from './Fish';
import BullGame from './Bull';


class SettingGame extends Component {
  state = {
    game: "fish",
  };

  handleChange = (event, index, value) => {
    this.setState({ game: value });
  }

  render() {
    return (
      <div>
        <Title render={(previousTitle) => `${Lang[window.Lang].Setting.game} - ${previousTitle}`} />
        <SelectField
          value={this.state.game}
          
          // floatingLabelText={Lang[window.Lang].User.ExchangePage.sort_ways}
          // value={this.state.sortWay}
          onChange={this.handleChange}
          >
          <MenuItem value={"fish"} primaryText={Lang[window.Lang].Setting.GamePage["11"].game_name} />
          <MenuItem value={"bull"} primaryText={Lang[window.Lang].Setting.GamePage["12"].game_name} />
        </SelectField>
        {this.state.game === "fish" ? <FishGame /> :
          this.state.game === "bull" ? <BullGame /> : ""
        }
      </div>
    );
  }

}



export default SettingGame;