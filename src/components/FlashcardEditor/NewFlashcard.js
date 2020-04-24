// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  root: {
    margin: theme.spacing(1, 0),
    width:'100%',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.circleIn.palette.action
  },
  error: {
    backgroundColor: theme.palette.secondary.main
  }
});

type Props = {
  classes: Object,
  loading: boolean,
  error: boolean,
  onClick: Function
};

class NewFlashcard extends React.PureComponent<Props> {
  render() {
    const { classes, loading, error, onClick } = this.props;
    return (
      <ButtonBase
        disabled={loading}
        className={cx(classes.root, error && classes.error)}
        onClick={onClick}
      >
        <AddIcon />
        <Typography variant="h6">
          {error ? 'You have to at least add 1 Flashcard' : 'Add New'}
        </Typography>
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(NewFlashcard);
