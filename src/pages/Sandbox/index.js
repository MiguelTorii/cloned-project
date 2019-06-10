/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import cx from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

const styles = () => ({
  main: {
    position: 'relative'
  },
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'white',
    cursor: 'crosshair'
  },
  input: {
    position: 'absolute',
    display: 'none',
    color: 'black',
    width: 200,
    top: 0,
    left: 0
  },
  showInput: {
    display: 'inline'
  }
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
    showInput: false,
    inputPos: {
      top: 0,
      left: 0
    },
    inputValue: '',
    context: null
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.canvas = React.createRef();
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidMount = () => {
    this.handleResize();
    const context = this.canvas.current.getContext('2d');
    this.setState({ context });
  };

  componentDidUpdate = () => {
    this.input.focus();
  };

  handleClick = e => {
    const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    this.setState(() => ({
      showInput: true,
      inputPos: { top: y, left: x }
    }));
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleKeyDown = event => {
    const { key = '' } = event;
    const { inputValue, inputPos } = this.state;
    if (key === 'Enter') {
      const { context } = this.state;
      context.fillStyle = 'black';
      context.font = '16px Roboto';
      context.fillText(inputValue, inputPos.left, inputPos.top);
      this.setState({ inputValue: '', showInput: false });
    }
  };

  handleMouseDown = () => {};

  handleMouseUp = () => {};

  handleMouseMove = () => {};

  handleResize = () => {
    this.canvas.current.width = window.innerWidth;
    this.canvas.current.height = window.innerHeight;
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    // eslint-disable-next-line func-names
    return function() {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        // eslint-disable-next-line prefer-rest-params
        callback(...arguments);
      }
    };
  };

  render() {
    const { classes } = this.props;
    const { showInput, inputPos, inputValue } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <canvas
          ref={this.canvas}
          className={classes.root}
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseOut={this.handleMouseUp}
          onMouseMove={this.throttle(this.handleMouseMove, 10)}
        />
        <OutlinedInput
          inputRef={input => {
            this.input = input;
          }}
          placeholder="Add your text"
          className={cx(classes.input, showInput && classes.showInput)}
          style={{ ...inputPos }}
          labelWidth={0}
          value={inputValue}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignInPage));
