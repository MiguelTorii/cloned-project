// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ShareDialog from '../../components/share-dialog';
import type { State as StoreState } from '../../types/state';
import type { ShareState } from '../../reducers/share';
import * as shareActions from '../../actions/share';

const styles = () => ({});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  share: ShareState,
  closeShareDialog: Function
};

type State = {};

class Share extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const { classes, share, closeShareDialog } = this.props;
    const { open } = share;
    return (
      <div className={classes.root}>
        <ShareDialog open={open} handleClose={closeShareDialog} />
      </div>
    );
  }
}

const mapStateToProps = ({ share }: StoreState): {} => ({
  share
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      closeShareDialog: shareActions.closeShareDialog
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Share));
