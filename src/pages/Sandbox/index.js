// @flow

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import withRoot from '../../withRoot';
import EmojiSelector from '../../components/EmojiSelector';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
};

type State = {
  text: string
};

class Sandbox extends React.Component<ProvidedProps & Props, State> {
  state = {
    text: 'test'
  };

  componentDidMount = () => {};

  handleSelect = emoji => {
    this.setState(({ text }) => ({ text: `${text}${emoji}` }));
  };

  render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Typography>{text}</Typography>
        <EmojiSelector onSelect={this.handleSelect} />
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(Sandbox));
