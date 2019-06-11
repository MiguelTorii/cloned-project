/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import throttle from 'lodash/throttle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

const styles = theme => ({
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
  participant: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: theme.palette.primary.main,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    padding: theme.spacing.unit / 2
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
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.canvas = React.createRef();
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidMount = () => {
    this.handleResize();
    this.handleCursor = throttle(this.handleCursor, 1000);
  };

  handleClick = () => {};

  handleChange = () => {};

  handleKeyDown = () => {};

  handleMouseDown = () => {};

  handleMouseUp = () => {};

  handleMouseMove = e => {
    this.handleCursor(
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      e.clientY || (e.touches ? e.touches[0].clientY : 0)
    );
  };

  handleResize = () => {
    this.canvas.current.width = window.innerWidth;
    this.canvas.current.height = window.innerHeight;
  };

  handleCursor = (x, y) => {
    console.log(x, y);
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

    const participants = [
      { name: 'Camilo', x: 21, y: 50 },
      { name: 'Jon', x: 300, y: 200 }
    ];

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
        {participants.map(item => (
          <Typography
            key={item.name}
            className={classes.participant}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              color: 'black'
            }}
          >
            {item.name}
          </Typography>
        ))}
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignInPage));
