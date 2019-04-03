// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing.unit * 2
  },
  actions: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

type Props = {
  classes: Object
};

type State = {};

class PostItemAddComment extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.body}>
          <Avatar>CR</Avatar>
          <TextField
            id="outlined-bare"
            placeholder="Have a question? Ask here"
            margin="normal"
            variant="outlined"
            className={classes.textField}
            fullWidth
          />
        </div>
        <div className={classes.actions}>
          <Button>Cancel</Button>
          <Button color="primary" variant="contained">
            Reply
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PostItemAddComment);
