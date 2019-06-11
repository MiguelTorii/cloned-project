/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// @flow
import React from 'react';
import update from 'immutability-helper';
import cx from 'classnames';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  main: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  root: {
    width: '95%',
    height: '95%',
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

type Props = {
  classes: Object,
  userId: string,
  name: string,
  drawData: string,
  lineWidth: number,
  color: string,
  isText: boolean,
  sendDataMessage: Function
};

type State = {
  current: Object,
  drawing: boolean,
  context: ?Object,
  showInput: boolean,
  inputPos: {
    top: number,
    left: number
  },
  inputValue: string,
  participants: Array<{ userId: string, name: string, x: number, y: number }>
};

class Index extends React.Component<Props, State> {
  state = {
    current: {
      x: 0,
      y: 0
    },
    drawing: false,
    context: null,
    showInput: false,
    inputPos: {
      top: 0,
      left: 0
    },
    inputValue: '',
    participants: []
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
    this.handleCursor = this.throttle(this.handleCursor, 500);
  };

  componentDidUpdate = () => {
    this.input.focus();
  };

  componentWillReceiveProps = prevProps => {
    const { drawData, isText } = this.props;
    if (drawData !== prevProps.drawData && drawData !== '') {
      const data = JSON.parse(drawData);
      const { type = '' } = data;
      if (type === 'drawing') this.handleDrawingEvent(data);
      else if (type === 'texting') this.handleTextingEvent(data);
      else if (type === 'cursor') this.handleCursorEvent(data);
    }
    if (!isText) {
      this.setState({ showInput: false, inputValue: '' });
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize, false);
  };

  handleMouseDown = e => {
    const { isText } = this.props;
    if (isText) return;
    const current = {};
    current.x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    current.y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    this.setState({
      drawing: true,
      current
    });
  };

  handleMouseUp = e => {
    const { isText } = this.props;
    if (isText) return;
    const { lineWidth, color } = this.props;
    const { drawing, current } = this.state;
    if (!drawing) {
      return;
    }

    this.setState({ drawing: false });
    this.drawLine(
      current.x,
      current.y,
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      e.clientY || (e.touches ? e.touches[0].clientY : 0),
      lineWidth,
      color,
      true
    );
  };

  handleMouseMove = e => {
    this.handleCursor(
      // $FlowIgnore
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      // $FlowIgnore
      e.clientY || (e.touches ? e.touches[0].clientY : 0)
    );

    const { isText } = this.props;
    if (isText) return;
    const { lineWidth, color } = this.props;
    const { drawing, current } = this.state;
    if (!drawing) {
      return;
    }

    this.drawLine(
      current.x,
      current.y,
      e.clientX || (e.touches ? e.touches[0].clientX : 0),
      e.clientY || (e.touches ? e.touches[0].clientY : 0),
      lineWidth,
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

  handleClick = e => {
    const { isText } = this.props;
    if (isText) {
      const x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const y = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      this.setState(() => ({
        showInput: true,
        inputPos: { top: y, left: x }
      }));
    }
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleKeyDown = event => {
    const { key = '' } = event;
    const { color } = this.props;
    const { inputValue, inputPos } = this.state;
    if (key === 'Enter') {
      this.drawText(inputValue, color, inputPos.left, inputPos.top, true);
      this.setState({ inputValue: '', showInput: false });
    }
  };

  handleResize = () => {
    this.canvas.current.width = window.innerWidth;
    this.canvas.current.height = window.innerHeight;
  };

  handleCursor = (x, y) => {
    const { userId, name, sendDataMessage } = this.props;
    const w = this.canvas.current.width;
    const h = this.canvas.current.height;

    const data = {
      userId,
      name,
      x: x / w,
      y: y / h,
      type: 'cursor'
    };

    sendDataMessage(JSON.stringify(data));
  };

  drawLine = (x0, y0, x1, y1, lineWidth, color, emit) => {
    // const { context } = this.state;
    const context = this.canvas.current.getContext('2d');
    const { sendDataMessage } = this.props;
    if (!context) return null;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    // context.closePath();
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
      lineWidth,
      color,
      type: 'drawing'
    };

    sendDataMessage(JSON.stringify(data));
    return null;
  };

  drawText = (text, color, x, y, emit) => {
    const { sendDataMessage } = this.props;
    const { context } = this.state;
    if (!context) return null;
    context.fillStyle = color;
    context.font = '16px Roboto';
    context.fillText(text, x, y);

    this.setState({ context });

    if (!emit) {
      return null;
    }

    const w = this.canvas.current.width;
    const h = this.canvas.current.height;

    const data = {
      x: x / w,
      y: y / h,
      text,
      color,
      type: 'texting'
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
      data.lineWidth,
      data.color
    );
  };

  handleTextingEvent = data => {
    const w = this.canvas.current.width;
    const h = this.canvas.current.height;
    this.drawText(data.text, data.color, data.x * w, data.y * h);
  };

  handleCursorEvent = data => {
    const { userId, name, x, y } = data;
    const w = this.canvas.current.width;
    const h = this.canvas.current.height;
    const newState = update(this.state, {
      participants: {
        $apply: b => {
          // console.log(b);
          const index = b.findIndex(item => item.userId === userId);
          if (index > -1) {
            return update(b, {
              [index]: { $set: { userId, name, x: x * w, y: y * h } }
            });
          }
          return [...b, { userId, name, x: x * w, y: y * h }];
        }
      }
    });
    this.setState(newState);
  };

  canvas: Object;

  input: Object;

  render() {
    const { classes } = this.props;
    const { showInput, inputPos, inputValue, participants } = this.state;

    return (
      <div className={classes.main}>
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
        {participants.map(item => (
          <Typography
            key={item.userId}
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
      </div>
    );
  }
}

export default withStyles(styles)(Index);
