/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {}
});

type Props = {
  classes: Object,
  audio: ?Object
};

type State = {};

class AudioTrack extends React.PureComponent<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    // $FlowIgnore
    this.audioinput = React.createRef();
  }

  componentDidMount = () => {
    const { audio } = this.props;
    if (audio) {
      this.audioinput.current.appendChild(audio.attach());
    }
  };

  componentWillUnmount = () => {
    const { audio } = this.props;
    if (audio) {
      const attachedElements = audio.detach();
      attachedElements.forEach(element => element.remove());
    }
  };

  audioinput: Object;

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.audio} ref={this.audioinput} />
      </div>
    );
  }
}

export default withStyles(styles)(AudioTrack);
