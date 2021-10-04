/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
  root: {}
});

type Props = {
  classes: Record<string, any>;
  audio: Record<string, any> | null | undefined;
  type: boolean;
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
    const {
      audio,
      type
    } = this.props;

    if (audio && type !== 'local') {
      this.audioinput.current.appendChild(audio.attach());
    }
  };
  componentWillUnmount = () => {
    const {
      audio
    } = this.props;

    if (audio) {
      const attachedElements = audio.detach();
      attachedElements.forEach(element => element.remove());
    }
  };

  render() {
    const {
      classes,
      type
    } = this.props;
    return <div className={classes.root}>
        {type !== 'local' ? <div className={classes.audio} ref={this.audioinput} /> : <audio ref={this.audioinput} id="localaudioinput" autoPlay />}
      </div>;
  }

}

export default withStyles(styles)(AudioTrack);