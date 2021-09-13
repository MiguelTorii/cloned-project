// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { createShareURL } from '../../api/posts';
import { logEvent } from '../../api/analytics';
import ShareDialog from '../../components/ShareDialog/ShareDialog';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  feedId: number,
  open: boolean,
  onClose: Function,
  enqueueSnackbar: Function
};

type State = {
  link: string,
  loading: boolean
};

class SharePost extends React.PureComponent<Props, State> {
  state = {
    link: '',
    loading: false
  };

  componentDidUpdate = async (prevProps) => {
    const {
      open,
      feedId,
      user: {
        data: { userId }
      }
    } = this.props;
    const { link } = this.state;

    if (
      (open !== prevProps.open && link === '' && open === true) ||
      (open !== prevProps.open && feedId !== prevProps.feedId && open === true)
    ) {
      try {
        this.setState({ loading: true });
        const url = await createShareURL({ userId, feedId });
        this.setState({ link: url });
      } finally {
        this.setState({ loading: false });
        logEvent({
          event: 'User- Generated Link',
          props: { 'Internal ID': feedId }
        });
      }
    }
  };

  handleLinkCopied = () => {
    const { enqueueSnackbar, classes } = this.props;
    enqueueSnackbar('Shareable Link has been copied.', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      autoHideDuration: 3000,
      ContentProps: {
        classes: {
          root: classes.stackbar
        }
      }
    });
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

    const { link, loading } = this.state;

    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <ShareDialog
          open={open}
          link={link}
          isLoading={loading}
          onLinkCopied={this.handleLinkCopied}
          onClose={onClose}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withSnackbar(withStyles(styles)(SharePost)));
