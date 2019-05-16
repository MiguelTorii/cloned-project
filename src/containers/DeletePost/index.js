// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { deletePost } from '../../api/posts';

const styles = theme => ({
  paper: {
    width: '80%'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

type Props = {
  classes: Object,
  user: UserState,
  feedId: number,
  open: boolean,
  onClose: Function
};

type State = {
  loading: boolean
};

class DeletePost extends React.PureComponent<Props, State> {
  state = {
    loading: false
  };

  handleSubmit = async () => {
    const {
      user: {
        data: { userId }
      },
      feedId,
      onClose
    } = this.props;

    this.setState({ loading: true });
    try {
      await deletePost({
        userId,
        feedId
      });
    } finally {
      this.setState({ loading: false });
      onClose();
    }
  };

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      open,
      onClose
    } = this.props;
    const { loading } = this.state;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <Dialog
        maxWidth="md"
        disableBackdropClick={loading}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        classes={{
          paper: classes.paper
        }}
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="confirmation-dialog-title">Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={onClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              disabled={loading}
              onClick={this.handleSubmit}
              type="submit"
              color="primary"
              variant="contained"
            >
              Delete
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(DeletePost));
