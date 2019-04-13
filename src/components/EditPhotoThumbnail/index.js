// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    backgroundColor: 'white',
    color: 'black',
    position: 'relative',
    width: 100,
    height: 130
  },
  action: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing.unit
  },
  button: {
    padding: 4,
    backgroundColor: theme.circleIn.customBackground.iconButton
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  }
});

type Props = {
  classes: Object,
  id: string,
  onDelete: Function
};

type State = {};

class EditPhotoThumbnail extends React.PureComponent<Props, State> {
  handleDelete = () => {
    const { onDelete, id } = this.props;
    onDelete(id);
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root} elevation={8}>
        <div className={classes.action}>
          <IconButton aria-label="Edit" className={classes.button}>
            <CreateIcon className={classes.icon} fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Delete"
            className={classes.button}
            onClick={this.handleDelete}
          >
            <ClearIcon className={classes.icon} fontSize="small" />
          </IconButton>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(EditPhotoThumbnail);
