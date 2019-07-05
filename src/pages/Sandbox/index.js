/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Input from '@material-ui/core/Input';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

const styles = () => ({
  main: {}
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {};

class SignInPage extends React.Component<ProvidedProps & Props, State> {
  state = {
    value: '',
    addNextLine: false
  };

  handleKeyDown = event => {
    const { addNextLine } = this.state;
    if (event.keyCode === 13 && !addNextLine) {
      event.preventDefault();
      this.handleSubmit();
    }
    if (event.keyCode === 16) {
      this.setState({ addNextLine: true });
    }
  };

  handleKeyUp = event => {
    if (event.keyCode === 16) {
      this.setState({ addNextLine: false });
    }
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = () => {
    const { value } = this.state;
    console.log('submit: ', value);
    this.setState({ value: '' });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Input
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={value}
          multiline
          onKeyUp={this.handleKeyUp}
        />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignInPage));
