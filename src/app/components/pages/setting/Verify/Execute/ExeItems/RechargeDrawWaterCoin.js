import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import TextField from 'angonsoft_textfield';
import Lang from '../../../../../../Language';


class RechargeDrawWaterCoin extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        callback: (func, isInputChecked, args) => { },
    }

    static propTypes = {
        callback: PropTypes.func.isRequired,
    }

    state = {
        disabled: false,
        draw_water_value: 100
    }

    render() {
        const {
            callback,
            selected
        } = this.props;
        const func = "recharge_draw_water_coin";
        return (
            <ListItem
                primaryText={Lang[window.Lang].Setting.reportCodeOperate.func[func]}
                secondaryText={"增加:" + this.state.draw_water_value}
                leftCheckbox={<Checkbox title={Lang[window.Lang].Setting.reportCodeOperate.checkBoxTip} checked={func === selected} disabled={this.state.disabled} onCheck={(e, isInputChecked) => {
                    if (isInputChecked) {
                        if (this.state.draw_water_value > 0) {
                            callback(func, isInputChecked, [Number(this.state.draw_water_value)])
                        }
                    } else {
                        callback(func, isInputChecked, [])
                    }
                }} />}
                nestedItems={[
                    <TextField
                        key={1}
                        inputStyle={{ paddingLeft: 20, }}
                        id={'recharge_draw_water_coin'}
                        fullWidth={true}

                        hintText={'请输入增加抽水额度'}
                        value={this.state.draw_water_value}
                        onChange={(event, value) => {
                            if (isNaN(value) === true || value === "" || value < 0) {
                                this.setState({
                                    disabled: true,
                                    draw_water_value: value
                                })
                                if (func === selected) {
                                    callback(func, false, [])
                                }
                            } else {
                                this.setState({
                                    disabled: false,
                                    draw_water_value: value
                                })
                                if (func === selected) {
                                    callback(func, true, [Number(value)])
                                }
                            }
                        }}
                    />
                ]}
            />
        )
    }
}

export default RechargeDrawWaterCoin;
