import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Lang from '../../../Language';
import Snackbar from 'material-ui/Snackbar';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
export default class CommonAlert extends Component {
  static propTypes = {
    show: PropTypes.bool,
    type: React.PropTypes.oneOf(['warning', 'alert', 'notice']),
    code: PropTypes.number,
    content: PropTypes.string,
    args: PropTypes.object,
    handleCertainClose: PropTypes.func,
    handleCancelClose: PropTypes.func
  };

  static defaultProps = {
    show: true,
    code: 0,
    type: 'notice',
    args: {},
    content: "",
    // handleCertainClose: () => {
    //   this.setState({ open: false });
    // },
    // handleCancelClose: () => {
    //   this.setState({ open: false });
    // }
  }

  state = {
    open: false,
  };

  render() {
    const {
      show,
      type,
      code,
      content,
      args,
      handleCertainClose,
      handleCancelClose
    } = this.props;

    this.state.open = show;

    var actions = [];
    switch (type) {
      case "warning":
        actions = [<FlatButton
          label={Lang[window.Lang].Master.certain_button}
          primary={true}
          onTouchTap={handleCancelClose}
        />,
        ];
        break;

      case "alert":
        actions = [
          <FlatButton
            label={Lang[window.Lang].Master.certain_button}
            primary={true}
            onTouchTap={handleCertainClose}
          />,
          <FlatButton
            label={Lang[window.Lang].Master.cancel_button}
            primary={true}
            onTouchTap={handleCancelClose}
          />,
        ];
        break;

      case "notice":
        actions = [
          <FlatButton
            label={Lang[window.Lang].Master.certain_button}
            primary={true}
            onTouchTap={handleCertainClose}
          />,
        ];
        break;
    }


    return (
      <div>
        {type === "notice" ?
          <Snackbar
            open={this.state.open}
            message={code !== 0 ? Lang[window.Lang].ErrorCode[code] : content}
            autoHideDuration={1500}
            onRequestClose={handleCancelClose}
          >
          </Snackbar> :
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={handleCancelClose}>
            {code !== 0 ? Lang[window.Lang].ErrorCode[code] : (content !== "" ? content : "")}
          </Dialog>
        }

      </div>
    );
  }
}
