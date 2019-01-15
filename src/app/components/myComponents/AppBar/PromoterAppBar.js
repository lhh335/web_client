import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ContentAdd from 'material-ui/svg-icons/content/add';

class PromoterAppBar extends Component {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        showIcons: PropTypes.bool.isRequired,
        leftType: PropTypes.string.isRequired,
        leftFunction: PropTypes.func.isRequired,
        rightType: PropTypes.string.isRequired,
        rightFunction: PropTypes.func.isRequired

    }

    static defaultProps = {
        title: "",
        leftType: "ArrowBack",
        rightType: "Add",
        showIcons: false,
        leftFunction: () => { },
        rightFunction: () => { }
    }

    render() {
        const {
            title,
            showIcons,
            leftType,
            leftFunction,
            rightType,
            rightFunction
        } = this.props;
        const styles = {
            appBar: {
                position: 'fixed',
                zIndex: 1,
                top: 0,
                left: 0,
            }
        }
        return (
            <div>
                {showIcons ? <AppBar
                    title={title}
                    titleStyle={{ textAlign: "center" } }
                    zDepth={0}
                    style={styles.appBar}
                    iconElementLeft={
                        <IconButton
                            onTouchTap={leftFunction} >
                            <NavigationArrowBack />
                        </IconButton>}
                    iconElementRight={<IconButton
                        onTouchTap={rightFunction} >
                        {rightType === "Add"?<ContentAdd />:""}
                    </IconButton>}
                /> : <AppBar
                        title={title}
                        titleStyle={{ textAlign: "center" }}
                        zDepth={0}
                        style={styles.appBar}
                        showMenuIconButton={showIcons}
                    />
                }
            </div>)
    }
}

export default withWidth()(PromoterAppBar);