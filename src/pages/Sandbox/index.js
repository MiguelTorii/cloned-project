/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import WhiteboardControls from '../../components/MeetUp/WhiteboardControls';
import Whiteboard from '../../components/MeetUp/Whiteboard';

const styles = () => ({
  main: {}
});

type Props = {
  classes: Object
};

type State = {};

class Sandbox extends React.Component<Props, State> {
  state = {
    drawData: '',
    lineWidth: 1,
    color: 'black',
    isText: false,
    eraser: false
  };

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.whiteboard = React.createRef();
  }

  sendDataMessage = () => {};

  handlePencilChange = size => {
    this.setState({ lineWidth: size, isText: false, eraser: false });
  };

  handleTextChange = () => {
    this.setState({ isText: true, eraser: false });
  };

  handleColorChange = color => {
    this.setState({ color });
  };

  handleErase = size => {
    this.setState({ lineWidth: size, isText: false, eraser: true });
  };

  handleSave = () => {};

  handleClear = () => {
    const { current } = this.whiteboard;
    if (current) {
      const { canvas } = current;
      if (canvas) {
        const { current: currentCanvas } = canvas;
        if (currentCanvas) {
          const context = currentCanvas.getContext('2d');
          context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
        }
      }
    }
  };

  render() {
    const { classes } = this.props;
    const {
      userId = '123',
      name = 'Camilo Rios',
      drawData,
      lineWidth,
      color,
      isText,
      eraser
    } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Whiteboard
          innerRef={this.whiteboard}
          userId={userId}
          name={name}
          drawData={drawData}
          lineWidth={lineWidth}
          color={color}
          isText={isText}
          eraser={eraser}
          sendDataMessage={this.sendDataMessage}
        />
        <WhiteboardControls
          onPencilChange={this.handlePencilChange}
          onColorChange={this.handleColorChange}
          onErase={this.handleErase}
          onText={this.handleTextChange}
          onSave={this.handleSave}
          onClear={this.handleClear}
        />
      </main>
    );
  }
}

export default withRoot(
  connect(
    null,
    null
  )(withStyles(styles)(Sandbox))
);
