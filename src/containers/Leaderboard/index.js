// @flow

import React, { Fragment } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type {
  Leaderboard as LeaderboardType,
  UserClass
} from '../../types/models';
import { getLeaderboard, getUserClasses } from '../../api/user';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  menu: {
    flex: 1,
    width: '100%',
    padding: theme.spacing.unit * 2
  },
  button: {
    marginBottom: theme.spacing.unit * 2,
    fontWeight: 'bold'
  },
  buttonDisabled: {
    '&:disabled': {
      backgroundColor: '#49afd9',
      color: 'rgba(0,0,0,0.7)',
      marginBottom: theme.spacing.unit * 2,
      borderStyle: 'solid',
      borderWidth: 3,
      borderColor: 'white'
    }
  },
  leaderboard: {
    width: 490,
    height: 400,
    overflowY: 'auto'
  },
  formControl: {
    margin: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  list: {
    width: '100%',
    position: 'relative',
    overflow: 'auto'
  },
  avatar: {
    width: 30,
    height: 30
  },
  avatarSelected: {
    backgroundColor: theme.palette.primary.main
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  select: {
    width: 120,
    borderBottom: '1px solid rgba(255, 255, 255, 0.42)'
  },
  input: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing.unit * 2
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2
  },
  selected: {
    backgroundColor: theme.circleIn.palette.action
  },
  top: {
    backgroundColor: '#29414e'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  open: boolean,
  onClose: Function
};

type State = {
  loading: boolean,
  leaderboard: LeaderboardType,
  sectionId: number,
  userClasses: Array<UserClass>
};

class Leaderboard extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    leaderboard: [],
    sectionId: -1,
    userClasses: []
  };

  componentDidUpdate = async prevProps => {
    const { open } = this.props;
    if (open !== prevProps.open && open === true) {
      await this.handleGetClasses();
      this.handleGetLeaderboard();
      logEvent({
        event: 'Leaderboard- Opened',
        props: {}
      });
    }
  };

  handleGetLeaderboard = async () => {
    this.setState({ loading: true });
    const { sectionId } = this.state;
    try {
      const leaderboard = await getLeaderboard({
        sectionId,
        index: 0,
        limit: 50
      });
      this.setState({ leaderboard, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleGetClasses = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const { classes } = await getUserClasses({ userId });

    this.setState({ userClasses: classes.filter(o => o.classId !== 0) });
  };

  handleClose = () => {
    const { onClose } = this.props;
    try {
      logEvent({
        event: 'Leaderboard- Closed',
        props: {}
      });
    } finally {
      onClose();
    }
  };

  handleChangeSection = sectionId => async () => {
    await this.setState({ sectionId });
    this.handleGetLeaderboard();
  };

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      open
    } = this.props;
    const { loading, leaderboard, userClasses, sectionId } = this.state;
    if (!open) return null;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          // fullWidth
          maxWidth="md"
          // className={classes.root}
          onClose={this.handleClose}
          aria-labelledby="leaderboard-dialog-title"
          aria-describedby="leaderboard-dialog-description"
        >
          <DialogContent className={classes.root}>
            <div className={classes.menu}>
              <Typography variant="h5" align="center" paragraph>
                Leaderboards
              </Typography>
              {userClasses.map(item =>
                item.section.map(section => (
                  <Button
                    key={section.sectionId}
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={sectionId === section.sectionId}
                    fullWidth
                    classes={{ disabled: classes.buttonDisabled }}
                    onClick={this.handleChangeSection(section.sectionId)}
                  >
                    {`${section.subject} - ${item.className}`}
                  </Button>
                ))
              )}
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                disabled={sectionId === -1}
                fullWidth
                classes={{ disabled: classes.buttonDisabled }}
                onClick={this.handleChangeSection(-1)}
              >
                Entire School
              </Button>
            </div>
            <div className={classes.leaderboard}>
              {loading && <CircularProgress size={12} />}
              {!loading && (
                <Fragment>
                  <List className={classes.list}>
                    {leaderboard.map((user, index) => (
                      <ListItem
                        key={user.userId}
                        style={{ display: 'flex' }}
                        className={cx(
                          index < 10 && user.userId !== userId && classes.top,
                          user.userId === userId && classes.selected
                        )}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            variant: 'h6',
                            color: 'textPrimary',
                            style: {
                              color: user.userId === userId && 'black',
                              fontWeight: 'bold'
                            }
                          }}
                          primary={index + 1}
                        />
                        <ListItemText
                          primaryTypographyProps={{
                            variant: 'h6',
                            style: {
                              color: user.userId === userId && 'black',
                              fontWeight: 'bold'
                            }
                          }}
                          primary={
                            user.userId === userId ? 'You' : user.username
                          }
                          style={{
                            flex: 1,
                            minWidth: 300,
                            fontWeight: 'bold'
                          }}
                        />
                        <ListItemText
                          primaryTypographyProps={{
                            variant: 'h6',
                            style: {
                              color: user.userId === userId && 'black',
                              fontWeight: 'bold'
                            }
                          }}
                          primary={user.points.toLocaleString()}
                          style={{
                            fontWeight: 'bold'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {leaderboard.length === 0 && (
                    <div className={classes.empty}>
                      <Typography variant="h5" align="center">
                        {
                          "There aren't any students here yet, be the first one!"
                        }
                      </Typography>
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              variant="contained"
            >
              Great!
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

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Leaderboard));
