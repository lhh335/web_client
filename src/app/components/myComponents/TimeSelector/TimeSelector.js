import React, { Component, PropTypes } from 'react';
import FullWidthSection from '../../FullWidthSection';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import Paper from 'material-ui/Paper';
import DatePicker from 'angon_datepicker/DatePicker';
import TimePicker from 'angon_timepicker/TimePicker';
import Lang from '../../../Language';
import FlatButton from 'material-ui/FlatButton';

import areIntlLocalesSupported from 'intl-locales-supported';
let DateTimeFormat;
const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/zh-Hans-CN');

class TimeSelector extends Component {

    constructor(props) {
        super(props);
        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(1);
        maxDate.setHours(23, 59, 59, 0);
        this.state = {
            show: true,
            minDate: minDate,
            maxDate: maxDate,
        }
    }

    static propTypes = {
        callbackMaxDateFuction: PropTypes.func.isRequired,
        callbackMaxTimeFuction: PropTypes.func.isRequired,
        callbackMinDateFuction: PropTypes.func.isRequired,
        callbackMinTimeFuction: PropTypes.func.isRequired,
        minDate: PropTypes.number,
        quickSearch: PropTypes.bool
    };

    static defaultProps = {
        callbackMaxDateFuction: (event, date) => { },
        callbackMaxTimeFuction: (event, date) => { },
        callbackMinDateFuction: (event, date) => { },
        callbackMinTimeFuction: (event, date) => { },
        minDate: 0,
        quickSearch: true
    }

    componentDidMount() {
    }
    quickSearch = (timePeriod) => {
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();
        var currentDay = currentDate.getDate();
        if (timePeriod === 1) {
            var minDate = new Date(currentYear, currentMonth, currentDay - 1, 0, 0, 0);
            var maxDate = new Date(currentYear, currentMonth, currentDay, 23, 59, 59);
        } else {
            var maxDate = new Date(currentYear, currentMonth, currentDay, 23, 59, 59);
            var minDate = maxDate.getTime() / 1000 - timePeriod * 24 * 60 * 60 + 1;
            minDate = new Date(minDate * 1000);
        }
        this.setState({
            minDate: minDate,
            maxDate: maxDate
        })
        this.state.minDate = minDate;
        this.state.maxDate = maxDate;
        return [minDate, maxDate];
    }

    render() {
        const {
            callbackMaxDateFuction,
            callbackMaxTimeFuction,
            callbackMinDateFuction,
            callbackMinTimeFuction,
            minDate,
            quickSearch
        } = this.props;
        const styles = {
            simple: {
                margin: '00px 5px',
                float: 'left'
            }
        };
        return (
            <div>
                {this.state.show === true ?
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 10, marginBottom: -20 }}>
                            <div style={{ marginRight: 20 }}>
                                <h6 style={{ marginBottom: -5, marginLeft: 3 }}>起始日期/时间</h6>
                                <DatePicker
                                    id='1'
                                    style={styles.simple}
                                    onChange={(e, date) => {
                                        this.setState({
                                            minDate: date,
                                        })
                                        callbackMinDateFuction(e, date);
                                    }}
                                    autoOk={false}
                                    defaultDate={this.state.minDate}
                                    value={this.state.minDate}
                                    disableYearSelection={false}
                                    cancelLabel={Lang[window.Lang].Master.cancel_button}
                                    okLabel={Lang[window.Lang].Master.certain_button}
                                    DateTimeFormat={DateTimeFormat}
                                    locale="zh-Hans-CN"

                                />
                                <TimePicker
                                    id='2'
                                    minWidth={true}
                                    style={styles.simple}
                                    onChange={callbackMinTimeFuction}
                                    format="24hr"
                                    hintText="24hr Format"
                                    defaultTime={this.state.minDate}
                                    value={this.state.minDate}
                                    okLabel={Lang[window.Lang].Master.certain_button}
                                    cancelLabel={Lang[window.Lang].Master.cancel_button}
                                    onChange={(e, date) => {
                                        this.setState({
                                            minDate: date,
                                        })
                                        callbackMinTimeFuction(e, date);
                                    }}
                                />
                            </div>
                            <div style={{ marginRight: 20 }}>
                                <h6 style={{ marginBottom: -5, marginLeft: 3 }}>结束日期/时间</h6>
                                <DatePicker
                                    id='3'
                                    style={styles.simple}
                                    onChange={callbackMaxDateFuction}
                                    autoOk={this.state.autoOk}
                                    defaultDate={this.state.maxDate}
                                    value={this.state.maxDate}

                                    disableYearSelection={this.state.disableYearSelection}
                                    cancelLabel={Lang[window.Lang].Master.cancel_button}
                                    okLabel={Lang[window.Lang].Master.certain_button}
                                    DateTimeFormat={DateTimeFormat}
                                    locale="zh-Hans-CN"
                                    onChange={(e, date) => {
                                        this.setState({
                                            maxDate: date,
                                        })
                                        callbackMaxDateFuction(e, date);
                                    }}
                                />
                                <TimePicker
                                    id='4'
                                    minWidth={true}
                                    style={styles.simple}
                                    onChange={callbackMaxTimeFuction}
                                    format="24hr"
                                    hintText="24hr Format"
                                    defaultTime={this.state.maxDate}
                                    okLabel={Lang[window.Lang].Master.certain_button}
                                    cancelLabel={Lang[window.Lang].Master.cancel_button}
                                    value={this.state.maxDate}
                                    onChange={(e, date) => {
                                        this.setState({
                                            maxDate: date,
                                        })
                                        callbackMaxTimeFuction(e, date);
                                    }}
                                />
                            </div>
                            {quickSearch === true ?
                                <div style={{ paddingTop: 22, marginRight: 20 }}>
                                    <FlatButton label={'昨天'} secondary={true}
                                        onTouchTap={() => {
                                            callbackMinDateFuction(event, this.quickSearch(1)[0]);
                                            callbackMinTimeFuction(event, this.quickSearch(1)[0]);

                                            callbackMaxDateFuction(event, this.quickSearch(1)[1]);
                                            callbackMaxTimeFuction(event, this.quickSearch(1)[1]);

                                        }
                                        } />
                                    <FlatButton label={'最近7天'} secondary={true}
                                        onTouchTap={() => {
                                            callbackMinDateFuction(event, this.quickSearch(7)[0]);
                                            callbackMinTimeFuction(event, this.quickSearch(7)[0]);

                                            callbackMaxDateFuction(event, this.quickSearch(7)[1]);
                                            callbackMaxTimeFuction(event, this.quickSearch(7)[1]);

                                        }} />
                                    <FlatButton label={'最近30天'} secondary={true}
                                        onTouchTap={() => {
                                            this.quickSearch(30);
                                            callbackMinDateFuction(event, this.quickSearch(30)[0]);
                                            callbackMinTimeFuction(event, this.quickSearch(30)[0]);

                                            callbackMaxDateFuction(event, this.quickSearch(30)[1]);
                                            callbackMaxTimeFuction(event, this.quickSearch(30)[1]);

                                        }} />
                                </div> : ''
                            }
                        </div>
                        <br />


                    </div> : <FlatButton
                        label={"时间选择器"}
                        primary={true}
                        onTouchTap={() => { this.setState({ show: true }) }}
                    />}
            </div>

        )
    }
}

export default withWidth()(TimeSelector);
