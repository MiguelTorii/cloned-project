// @flow

import React from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DialogTitle from '../../components/DialogTitle';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { UserClass } from '../../types/models';
import {
  getUserClasses,
  getAvailableClasses,
  leaveUserClass,
  joinClass
} from '../../api/user';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';
import * as feedActions from '../../actions/feed';

const styles = (theme) => ({
  root: {
    // padding: theme.spacing(2)
  },
  list: {
    width: '100%',
    // minWidth: 360,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200
  },
  link: {
    margin: theme.spacing(),
    color: theme.palette.primary.main
  }
});

type Props = {
  classes: Object,
  user: UserState,
  open: boolean,
  onClose: Function,
  fetchFeed: Function,
  onOpenRequestClass: Function
};

type State = {
  userClasses: Array<UserClass>,
  availableClasses: Array<Object>,
  search: string,
  canAddClasses: boolean,
  loading: boolean,
  selectedClasses: Array<{ classId: number, sectionId: number }>,
  errorText: boolean
};

class ClassesManager extends React.PureComponent<Props, State> {
  state = {
    userClasses: [],
    canAddClasses: false,
    availableClasses: [],
    search: '',
    loading: false,
    selectedClasses: [],
    errorText: false
  };

  componentDidUpdate = (prevProps) => {
    const { open } = this.props;
    if (open !== prevProps.open && open === true) {
      this.handleLoadClasses();
      logEvent({ event: 'Join Class- Opened', props: {} });
    }
  };

  handleLoadClasses = async () => {
    const {
      user: {
        data: { userId, schoolId },
        userClasses: { classList, canAddClasses }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      const ac = await getAvailableClasses({ userId, schoolId });
      const availableClasses = [];
      const keys = Object.keys(ac);
      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys) {
        availableClasses.push({ name: key, classes: ac[key] });
      }

      this.setState({
        userClasses: classes,
        canAddClasses,
        availableClasses,
        loading: false
      });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleClassSelect = (classId) => (event) => {
    const newState = update(this.state, {
      selectedClasses: {
        $apply: (b) => {
          const index = b.findIndex((item) => item.classId === classId);

          if (index > -1 && !event.target.checked) {
            b.splice(index, 1);
          }

          if (event.target.checked) {
            b.push({ classId });
          }

          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleSectionSelect = (classId, sectionId) => async (event) => {
    const newState = update(this.state, {
      selectedClasses: {
        $apply: (b) => {
          const index = b.findIndex(
            (item) => item.classId === classId && item.sectionId === sectionId
          );
          if (index > -1 && !event.target.checked) b.splice(index, 1);
          if (event.target.checked) b.push({ classId, sectionId });
          return b;
        }
      }
    });
    this.setState(newState);

    if (event.target.checked) {
      try {
        const {
          user: {
            data: { userId },
            userClasses: { classList: classes }
          },
          fetchFeed
        } = this.props;
        // this.setState({ loading: true });
        await joinClass({ classId, sectionId, userId });
        this.setState({ userClasses: classes, loading: false });
        fetchFeed();
        // this.setState({ loading: false });
      } catch (err) {
        // this.setState({ loading: false });
      } finally {
        logEvent({
          event: 'Join Class- Joined Class',
          props: { 'Section ID': sectionId }
        });
      }
    }
  };

  handleRemoveClass =
    ({ classId }: { classId: number }) =>
    async () => {
      const {
        user: {
          data: { userId },
          userClasses: { classList: classes }
        },
        fetchFeed
      } = this.props;
      this.setState({ loading: true });
      try {
        await leaveUserClass({ classId, userId });
        this.setState({ userClasses: classes });
        fetchFeed();
      } finally {
        this.setState({ loading: false });
      }
    };

  handleRemoveSection =
    ({ classId, sectionId }: { classId: number, sectionId: number }) =>
    async () => {
      const {
        user: {
          data: { userId },
          userClasses: { classList: classes }
        },
        fetchFeed
      } = this.props;
      this.setState({ loading: true });
      try {
        await leaveUserClass({ classId, sectionId, userId });
        this.setState({ userClasses: classes });
        fetchFeed();
      } finally {
        this.setState({ loading: false });
      }
    };

  handleSubmit = async () => {
    const { selectedClasses } = this.state;
    if (selectedClasses.length === 0) {
      this.setState({ errorText: true });
      return;
    }
    this.setState({ errorText: false, loading: true });
    try {
      const {
        user: {
          data: { userId },
          userClasses: { classList: classes }
        },
        fetchFeed
      } = this.props;
      // eslint-disable-next-line no-restricted-syntax
      for (const userClass of selectedClasses) {
        const { classId, sectionId } = userClass;
        // eslint-disable-next-line no-await-in-loop
        await joinClass({ classId, sectionId, userId });
      }
      this.setState({ userClasses: classes, loading: false });
      fetchFeed();
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  renderUserClasses = () => {
    const {
      user: {
        data: { segment }
      }
    } = this.props;
    const { userClasses } = this.state;

    if (userClasses.length === 0) {
      return (
        <ListItem>
          <ListItemText primary={"You don't have classes yet"} />
        </ListItem>
      );
    }

    if (segment === 'K12') {
      return userClasses.map((item) => (
        <ListItem key={item.classId}>
          <ListItemText
            primary={item.className}
            primaryTypographyProps={{
              noWrap: true
            }}
          />
          {(item.permissions || {}).canLeave && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleRemoveClass({ classId: item.classId })}
            >
              Remove
            </Button>
          )}
          {/* {!canvasUser && (item.permissions || {}).canLeave && (
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.handleRemoveClass({ classId: item.classId })}
              >
                Remove
              </Button>
            </ListItemSecondaryAction>
          )} */}
        </ListItem>
      ));
    }

    if (segment === 'College') {
      return userClasses.map((item) =>
        item.section.map((section) => (
          <ListItem key={`${item.classId}-${section.sectionId}`}>
            <ListItemText
              primary={`${section.subject} ${item.className}: ${section.firstName} ${section.lastName} - ${section.section}`}
              primaryTypographyProps={{
                noWrap: true
              }}
            />
            {(item.permissions || {}).canLeave && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.handleRemoveSection({
                  classId: item.classId,
                  sectionId: section.sectionId
                })}
              >
                Remove
              </Button>
            )}
            {/* {false && !canvasUser && (item.permissions || {}).canLeave && (
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={this.handleRemoveSection({
                    classId: item.classId,
                    sectionId: section.sectionId
                  })}
                >
                  Remove
                </Button>
              </ListItemSecondaryAction>
            )} */}
          </ListItem>
        ))
      );
    }
    return null;
  };

  renderAvailableClasses = () => {
    const {
      user: {
        data: { segment }
      }
    } = this.props;
    if (segment === 'College') return this.renderCollegeClasses();
    if (segment === 'K12') return this.renderK12Classes();
    return null;
  };

  renderCollegeClasses = () => {
    const { userClasses, availableClasses, search } = this.state;
    // eslint-disable-next-line func-names
    const sortedClasses = availableClasses.sort(function (a, b) {
      // eslint-disable-next-line no-nested-ternary
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    const filteredClasses = sortedClasses.reduce((result, item) => {
      const items = item.classes.filter((o) =>
        o.class.toLowerCase().includes(search)
      );
      if (items.length > 0) result.push({ name: item.name, classes: items });
      return result;
    }, []);

    return (
      <div>
        {filteredClasses.map((item) => (
          <Accordion key={item.name}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {item.classes.map((o) => (
                  <Accordion key={o.classId}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{o.class}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {o.section.map((b) => (
                          <FormControlLabel
                            key={`${o.classId}-${b.sectionId}`}
                            disabled={
                              userClasses.find((c) => {
                                const section = c.section.find(
                                  (s) => s.sectionId === b.sectionId
                                );
                                return !!(section && c.classId === o.classId);
                              }) && true
                            }
                            control={
                              <Checkbox
                                checked={
                                  userClasses.find((c) => {
                                    const section = c.section.find(
                                      (s) => s.sectionId === b.sectionId
                                    );
                                    return !!(
                                      section && c.classId === o.classId
                                    );
                                  }) && true
                                }
                                onChange={this.handleSectionSelect(
                                  o.classId,
                                  b.sectionId
                                )}
                              />
                            }
                            label={`Section ${b.section}: ${b.firstName} ${b.lastName}`}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  };

  renderK12Classes = () => {
    const { userClasses } = this.state;
    const { availableClasses, search } = this.state;

    const sortedClasses = availableClasses.sort((a, b) => {
      // eslint-disable-next-line no-nested-ternary
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    const filteredClasses = sortedClasses.reduce((result, item) => {
      const items = item.classes.filter((o) =>
        o.class.toLowerCase().includes(search)
      );
      if (items.length > 0) result.push({ name: item.name, classes: items });
      return result;
    }, []);

    return (
      <div>
        {filteredClasses.map((item) => (
          <Accordion key={item.name}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {item.classes.map((o) => (
                  <FormControlLabel
                    key={o.classId}
                    disabled={
                      userClasses.find((b) => b.classId === o.classId) && true
                    }
                    control={
                      <Checkbox
                        checked={
                          userClasses.find((b) => b.classId === o.classId) &&
                          true
                        }
                        onChange={this.handleClassSelect(o.classId)}
                      />
                    }
                    label={o.class}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
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
      onClose,
      onOpenRequestClass
    } = this.props;
    const { canAddClasses, loading, errorText } = this.state;

    // eslint-disable-next-line no-script-url
    const dudUrl = '';
    if (!open) return null;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          fullWidth
          className={classes.root}
          onClose={onClose}
          aria-labelledby="manage-classes-dialog-title"
          aria-describedby="manage-classes-dialog-description"
        >
          <DialogTitle id="manage-classes-dialog-title" onClose={onClose}>
            Add/Remove Classes
          </DialogTitle>
          <DialogContent>
            {loading && <CircularProgress size={12} />}
            {!loading && (
              <List className={classes.list}>{this.renderUserClasses()}</List>
            )}
            {/* {lmsTypeId === -1 && canAddClasses && !loading && (
              <Typography>List of available classes</Typography>
            )} */}
            {canAddClasses && !loading && (
              <Typography>List of available classes</Typography>
            )}
            {canAddClasses && errorText && (
              <FormHelperText error>
                You have to select at least 1 class
              </FormHelperText>
            )}
            {canAddClasses && !loading && this.renderAvailableClasses()}
          </DialogContent>
          <DialogContent>
            <Typography>
              Can’t find your classes?{' '}
              <Link
                href={dudUrl}
                onClick={onOpenRequestClass}
                color="inherit"
                className={classes.link}
              >
                Click here
              </Link>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary" variant="contained">
              Close
            </Button>
            {canAddClasses && (
              <Button onClick={onClose} color="primary" variant="contained">
                Done
              </Button>
            )}
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
      fetchFeed: feedActions.fetchFeed
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ClassesManager));
