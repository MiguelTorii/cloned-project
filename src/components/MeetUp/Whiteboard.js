/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'white'
  }
});

type Props = {
  classes: Object,
  drawData: string,
  sendDataMessage: Function
};

type State = {
  current: Object,
  drawing: boolean,
  context: ?Object,
  color: string
};

class Index extends React.Component<Props, State> {
  state = {
    current: {
      x: 0,
      y: 0
    },
    color: 'black',
    drawing: false,
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

  componentWillReceiveProps = prevProps => {
    const { drawData } = this.props;
    if (drawData !== prevProps.drawData && drawData !== '') {
      const data = JSON.parse(drawData);
      this.handleDrawingEvent(data);
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize, false);
  };

  handleMouseDown = e => {
    const current = {};
    current.x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    current.y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    this.setState({
      drawing: true,
      current
    });
  };

  handleMouseUp = e => {
    const { drawing, current, color } = this.state;
    if (!drawing) {
      return;
    }

    this.setState({ drawing: false });
    this.drawLine(
      current.x,
      current.y,
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      e.clientY || (e.touches ? e.touches[0].clientY : 0),
      color,
      true
    );
  };

  handleMouseMove = e => {
    const { drawing, current, color } = this.state;
    if (!drawing) {
      return;
    }

    this.drawLine(
      current.x,
      current.y,
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      e.clientY || (e.touches ? e.touches[0].clientY : 0),
      color,
      true
    );
    this.setState({
      current: {
        x: e.clientX || (e.touches ? e.touches[0].clientX : 0),
        y: e.clientY || (e.touches ? e.touches[0].clientY : 0)
      }
    });
  };

  handleResize = () => {
    this.canvas.current.width = window.innerWidth;
    this.canvas.current.height = window.innerHeight;
  };

  drawLine = (x0, y0, x1, y1, color, emit) => {
    const { context } = this.state;
    const { sendDataMessage } = this.props;
    if (!context) return null;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
    this.setState({ context });

    if (!emit) {
      return null;
    }

    const w = this.canvas.current.width;
    const h = this.canvas.current.height;

    const data = {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color,
      type: 'drawing'
    };

    sendDataMessage(JSON.stringify(data));
    return null;
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

  handleDrawingEvent = data => {
    const w = this.canvas.current.width;
    const h = this.canvas.current.height;
    this.drawLine(
      data.x0 * w,
      data.y0 * h,
      data.x1 * w,
      data.y1 * h,
      data.color
    );
  };

  canvas: Object;

  render() {
    const { classes } = this.props;

    return (
      <canvas
        ref={this.canvas}
        className={classes.root}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseOut={this.handleMouseUp}
        onMouseMove={this.throttle(this.handleMouseMove, 10)}
      />
    );
  }
}

export default withStyles(styles)(Index);
