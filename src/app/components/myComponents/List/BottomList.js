import React, { Component, PropTypes } from 'react';
import FullWidthSection from '../../FullWidthSection';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import { Menu, MenuItem } from 'material-ui';
import ActionGrade from 'material-ui/svg-icons/action/grade';

export default class BottomList extends Component {
    state = {
        open: true
    }


    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    handleTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {

        const styles = {
            bottomList: {
                position: "fixed",
                left: 10,
                right: 10,
                bottom: 0,
            }
        }
        return (
            <div>
                <Popover
                    open={this.state.open}
                    style={styles.bottomList}
                    anchorEl={document.getElementById("app")}
                    anchorOrigin={{ "horizontal": "middle", "vertical": "bottom" }}
                    targetOrigin={{ "horizontal": "middle", "vertical": "top" }}
                    onRequestClose={this.handleRequestClose}
                >
                    <Menu>
                        <MenuItem primaryText="Refresh" />
                        <MenuItem primaryText="Help &amp; feedback" />
                        <MenuItem primaryText="Settings" />
                        <MenuItem primaryText="Sign out" />
                    </Menu>
                </Popover>
            </div>
        )
    }
}