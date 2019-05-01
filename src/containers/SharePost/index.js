// @flow

import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { createShareURL } from '../../api/posts';
import ShareDialog from '../../components/ShareDialog';

type Props = {
  user: UserState,
  feedId: number,
  open: boolean,
  onClose: Function
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

  componentDidUpdate = async prevProps => {
    const {
      open,
      feedId,
      user: {
        data: { userId }
      }
    } = this.props;
    const { link } = this.state;

    if (open !== prevProps.open && link === '') {
      try {
        this.setState({ loading: true });
        const url = await createShareURL({ userId, feedId });
        this.setState({ link: url });
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  handleLinkCopied = () => {
    console.log('link copied to clipboard');
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
      <ShareDialog
        open={open}
        link={link}
        isLoading={loading}
        onLinkCopied={this.handleLinkCopied}
        onClose={onClose}
      />
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(SharePost);
