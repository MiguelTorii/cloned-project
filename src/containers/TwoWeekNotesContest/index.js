// @flow

import React from 'react';
import store from 'store';
import { withSnackbar } from 'notistack';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { DialogContentText } from '@material-ui/core';
import DialogTitle from '../../components/DialogTitle';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import ErrorBoundary from '../ErrorBoundary';
// $FlowIgnore
import { ReactComponent as Frame } from '../../assets/svg/two_week_notes_contest.svg';

const styles = theme => ({
  frame: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing.unit * 2
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

    if (userId === '') return null;

    const { open } = this.state;

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          fullWidth
          maxWidth="md"
          className={classes.root}
          onClose={this.handleClose}
          aria-labelledby="two-week-notes-contest-dialog-title"
          aria-describedby="two-week-notes-contest-dialog-description"
        >
          <DialogTitle
            id="two-week-notes-contest-dialog-title"
            onClose={this.handleClose}
          >
            TWO-WEEK NOTES CONTEST
          </DialogTitle>
          <DialogContent>
            <DialogContentText color="textPrimary" paragraph>
              Everyone who shares 5 pages of notes over the next 2 weeks will
              earn an MVP certificate that goes towards the Season 1 Grand Prize
              raffle for Beats Headphones.
            </DialogContentText>
            <DialogContentText color="textPrimary" paragraph>
              We’re also going to select a special student who shares 5 pages of
              notes, and send them $100 towards one of their top three rewards
              selected!
            </DialogContentText>
            <DialogContentText color="textPrimary" paragraph>
              These are the rules:
              <br />
              A minimum of 5 pages of notes by September 25th
              <br />
              Your posts cannot be reported as spam
              <br />
              Do not repost the same page of notes
            </DialogContentText>
            <DialogContentText
              color="textPrimary"
              style={{ fontWeight: 'bold' }}
              align="center"
            >
              Choose your top three rewards to begin!
            </DialogContentText>
            <div className={classes.frame}>
              <Frame />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClick}
              variant="contained"
              color="primary"
              autoFocus
            >
              Head to Reward Store
            </Button>
          </DialogActions>
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
