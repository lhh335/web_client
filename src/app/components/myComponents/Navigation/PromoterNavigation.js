import React, { Component, PropTypes } from 'react';
import FullWidthSection from '../../FullWidthSection';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Badge from 'material-ui/Badge';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import IconButton from 'material-ui/IconButton';


import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
// import IconIndex from 'material-ui/svg-icons/index';
import IconMoeny from 'material-ui/svg-icons/editor/money-off';
import IconPeople from 'material-ui/svg-icons/social/people';
import IconShop from 'material-ui/svg-icons/action/shop';
import IconWallet from 'material-ui/svg-icons/action/account-balance-wallet'
import IconWork from 'material-ui/svg-icons/action/work';
import IconSetting from 'material-ui/svg-icons/action/settings';

import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import Lang from '../../../Language';
import Util from '../../../util';

import { blue500, red500, greenA200 } from 'material-ui/styles/colors';

const iconStyles = {
    marginRight: 24,
};


// const indexIcon = <IconIndex />;
const peopleIcon = <IconPeople />;
const nearbyIcon = <IconLocationOn />;
const workIcon = <IconWork />;
const shopIcon = <IconWallet />;
const settingIcon = <IconSetting />;

class PromoterNavigation extends Component {

    static propTypes = {
        selectedIndex: PropTypes.number.isRequired,
    };

    static defaultProps = {
        selectedIndex: 0
    }


    state = {
        selectedIndex: 0
    }

    select = (index) => {
        this.setState({
            selectedIndex: index
        });
        Util.event.dispatcher("navigation", index);
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    getTitle = (index) => {
        switch (index) {
            case 0:
                return "玩家";

            case 1:
                return "交易";

            case 2:
                return "我";
        }
    }

    render() {
        const {
            selectedIndex,
        } = this.props;
        const styles = {
            bottomNavigation: {
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%"
            }
        };
        return (
            <div >
                <Paper zDepth={1} style={styles.bottomNavigation}>
                    <Divider inset={true} />
                    <BottomNavigation selectedIndex={this.props.selectedIndex}>
                        <BottomNavigationItem
                            label="玩家"
                            icon={
                                <IconPeople>

                                </IconPeople>
                                
                            }
                            onTouchTap={() => {
                                this.select(0)
                            }}
                        />
                        <BottomNavigationItem
                            label="交易"
                            icon={shopIcon}
                            onTouchTap={() => {
                                this.select(1)

                            }}
                        />
                        {/*<BottomNavigationItem
                            label="工具"

                            icon={<IconWork />}

                            onTouchTap={() => {
                                this.select(2)
                            }}
                        />*/}
                        <BottomNavigationItem
                            label="我"
                            icon={settingIcon}
                            onTouchTap={() => {
                                this.select(2)
                            }}
                        />
                    </BottomNavigation>
                </Paper>
            </div>
        )
    }
}

export default withWidth()(PromoterNavigation);
