// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import NotesForm from '../../components/NotesForm';

const styles = () => ({});

type Props = {
  classes: Object
};

class CreateNotes extends React.PureComponent<Props> {
  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NotesForm handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default withStyles(styles)(CreateNotes);
