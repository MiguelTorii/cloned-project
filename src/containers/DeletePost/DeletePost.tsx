import React from 'react';

import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { deletePost } from 'api/posts';
import Dialog from 'components/Dialog/Dialog';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(),
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
  classes?: Record<string, any>;
  user?: UserState;
  feedId: number;
  open: boolean;
  onClose: (...args: Array<any>) => any;
};
type State = {
  loading: boolean;
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
    this.setState({
      loading: true
    });

    try {
      await deletePost({
        userId,
        feedId
      });
    } finally {
      this.setState({
        loading: false
      });
      onClose({
        deleted: true
      });
    }
  };

  render() {
    const {
      user: {
        isLoading,
        error,
        data: { userId }
      },
      open,
      onClose
    } = this.props;
    const { loading } = this.state;

    if (isLoading) {
      return <CircularProgress size={12} />;
    }

    if (userId === '' || error) {
      return 'Oops, there was an error loading your data, please try again.';
    }

    return (
      <ErrorBoundary>
        <Dialog
          ariaDescribedBy="confirmation-dialog-description"
          disableActions={loading}
          okTitle="Delete"
          onCancel={onClose}
          onOk={this.handleSubmit}
          open={open}
          showActions
          showCancel
          title="Delete Post"
        >
          <Typography color="textPrimary" id="confirmation-dialog-description">
            Are you sure you want to delete this post?
          </Typography>
        </Dialog>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(withStyles(styles as any)(DeletePost));
