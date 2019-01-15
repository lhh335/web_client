import React from 'react';
import TextField from 'material-ui/TextField';

export default class TableText extends React.Component {

  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '在此输入内容',
    };
  }

  handleFocus = (event) => {
    if (this.state.value !== '在此输入内容') {
      return;
    }
    this.setState({
      value: '',
    });
  }

  handleChange = (event) => {

    if (Number(event.target.value) == "Nan") {
      this.setState({
        value: event.target.value,
        errorText: "类型错误"
      });
    } else {
      this.setState({
        value: event.target.value,
        errorText: ""
      });
    }
  };

  render() {
    return (
      <div>
        <TextField
          id="text-field-controlled"
          value={this.state.value}
          errorText={this.state.errorText}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
