// @flow

import React from 'react';
import store from 'store';
import { withSnackbar } from 'notistack';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '../../components/Dialog/Dialog';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
// $FlowIgnore
import { ReactComponent as Frame } from '../../assets/svg/two_week_notes_contest.svg';

const styles = (theme) => ({
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  user: UserState,
  pushTo: Function
};

type State = {
  open: boolean
};

class TwoWeekNotesContest extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  componentDidMount = () => {
    const open = !store.get('TWO_WEEK_NOTES_CONTEST');
    this.setState({ open });
  };

  componentDidUpdate = () => {};

  handleClose = () => {
    this.setState({ open: false });
    store.set('TWO_WEEK_NOTES_CONTEST', true);
  };

  handleClick = () => {
    this.setState({ open: false });
    store.set('TWO_WEEK_NOTES_CONTEST', true);
    const { pushTo } = this.props;
    pushTo('/store');
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;

    if (userId === '') {
      return null;
    }

    const { open } = this.state;

    return (
      <ErrorBoundary>
        <Dialog
          okTitle="Head to Reward Store"
          onCancel={this.handleClose}
          onOk={this.handleClick}
          open={open}
          showActions
          title="TWO-WEEK NOTES CONTEST"
        >
          <Typography color="textPrimary" paragraph>
            Everyone who shares 5 pages of notes over the next 2 weeks will earn an MVP certificate
            that goes towards the Season 1 Grand Prize raffle for Beats Headphones.
          </Typography>
          <Typography color="textPrimary" paragraph>
            We’re also going to select a special student who shares 5 pages of notes, and send them
            $100 towards one of their top three rewards selected!
          </Typography>
          <Typography color="textPrimary" paragraph>
            These are the rules:
            <br />
            A minimum of 5 pages of notes by September 25th
            <br />
            Your posts cannot be reported as spam
            <br />
            Do not repost the same page of notes
          </Typography>
          <Typography color="textPrimary" style={{ fontWeight: 'bold' }} align="center">
            Choose your top three rewards to begin!
          </Typography>
          <div className={classes.frame}>
            <Frame />
          </div>
        </Dialog>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withSnackbar(withStyles(styles)(TwoWeekNotesContest))));
