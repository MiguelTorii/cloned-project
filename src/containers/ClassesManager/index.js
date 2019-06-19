// @flow

import React from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { UserClass, Permissions } from '../../types/models';
import {
  getUserClasses,
  getAvailableClasses,
  leaveUserClass,
  joinClass
} from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({
  root: {
    // padding: theme.spacing.unit * 2
  },
  list: {
    width: '100%',
    // minWidth: 360,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200
  }
});

type Props = {
  classes: Object,
  user: UserState,
  open: boolean,
  onClose: Function
};

type State = {
  userClasses: Array<UserClass>,
  permissions: Permissions,
  availableClasses: Array<Object>,
  search: string,
  loading: boolean,
  selectedClasses: Array<{ classId: number, sectionId: number }>,
  errorText: boolean
};

class ClassesManager extends React.PureComponent<Props, State> {
  state = {
    userClasses: [],
    permissions: {
      canAddClasses: false
    },
    availableClasses: [],
    search: '',
    loading: false,
    selectedClasses: [],
    errorText: false
  };

  componentDidUpdate = prevProps => {
    const { open } = this.props;
    if (open !== prevProps.open && open === true) {
      this.handleLoadClasses();
    }
  };

  handleLoadClasses = async () => {
    const {
      user: {
        data: { userId, schoolId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      Promise.all([
        getUserClasses({ userId }),
        getAvailableClasses({ userId, schoolId })
      ]).then(result => {
        const availableClasses = [];
        const keys = Object.keys(result[1]);
        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
          availableClasses.push({ name: key, classes: result[1][key] });
        }
        const { classes = [], permissions } = result[0] || {};

        this.setState({
          userClasses: classes,
          permissions,
          availableClasses,
          loading: false
        });
      });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleClassSelect = classId => event => {
    const newState = update(this.state, {
      selectedClasses: {
        $apply: b => {
          const index = b.findIndex(item => item.classId === classId);

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

  handleSectionSelect = (classId, sectionId) => event => {
    const newState = update(this.state, {
      selectedClasses: {
        $apply: b => {
          const index = b.findIndex(
            item => item.classId === classId && item.sectionId === sectionId
          );
          if (index > -1 && !event.target.checked) b.splice(index, 1);
          if (event.target.checked) b.push({ classId, sectionId });
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleRemoveClass = ({ classId }: { classId: number }) => async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      await leaveUserClass({ classId, userId });
      const { classes } = await getUserClasses({ userId });
      this.setState({ userClasses: classes });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleRemoveSection = ({
    classId,
    sectionId
  }: {
    classId: number,
    sectionId: number
  }) => async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      await leaveUserClass({ classId, sectionId, userId });
      const { classes } = await getUserClasses({ userId });
      this.setState({ userClasses: classes });
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
          data: { userId }
        }
      } = this.props;
      // eslint-disable-next-line no-restricted-syntax
      for (const userClass of selectedClasses) {
        const { classId, sectionId } = userClass;
        // eslint-disable-next-line no-await-in-loop
        await joinClass({ classId, sectionId, userId });
      }
      const { classes } = await getUserClasses({ userId });
      this.setState({ userClasses: classes, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  renderUserClasses = () => {
    const {
      user: {
        data: { segment, canvasUser }
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
      return userClasses.map(item => (
        <ListItem key={item.classId}>
          <ListItemText
            primary={item.className}
            primaryTypographyProps={{
              noWrap: true
            }}
          />
          {!canvasUser && (item.permissions || {}).canLeave && (
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
      return userClasses.map(item =>
        item.section.map(section => (
          <ListItem key={`${item.classId}-${section.sectionId}`}>
            <ListItemText
              primary={`${section.subject} ${item.className}: ${
                section.firstName
              } ${section.lastName} - ${section.section}`}
              primaryTypographyProps={{
                noWrap: true
              }}
            />
            {!canvasUser && (item.permissions || {}).canLeave && (
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
    const sortedClasses = availableClasses.sort(function(a, b) {
      // eslint-disable-next-line no-nested-ternary
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    });
    const filteredClasses = sortedClasses.reduce((result, item) => {
      const items = item.classes.filter(o =>
        o.class.toLowerCase().includes(search)
      );
      if (items.length > 0) result.push({ name: item.name, classes: items });
      return result;
    }, []);
    return (
      <div>
        {filteredClasses.map(item => (
          <ExpansionPanel key={item.name}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                {item.classes.map(o => (
                  <ExpansionPanel key={o.classId}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{o.class}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <FormGroup>
                        {o.section.map(b => (
                          <FormControlLabel
                            key={`${o.classId}-${b.sectionId}`}
                            disabled={
                              userClasses.find(c => {
                                const section = c.section.find(
                                  s => s.sectionId === b.sectionId
                                );
                                return !!(section && c.classId === o.classId);
                              }) && true
                            }
                            control={
                              <Checkbox
                                checked={
                                  userClasses.find(c => {
                                    const section = c.section.find(
                                      s => s.sectionId === b.sectionId
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
                            label={`${b.firstName} ${b.lastName} - Section ${
                              b.section
                            }`}
                          />
                        ))}
                      </FormGroup>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ))}
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
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
      const items = item.classes.filter(o =>
        o.class.toLowerCase().includes(search)
      );
      if (items.length > 0) result.push({ name: item.name, classes: items });
      return result;
    }, []);

    return (
      <div>
        {filteredClasses.map(item => (
          <ExpansionPanel key={item.name}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{item.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormGroup>
                {item.classes.map(o => (
                  <FormControlLabel
                    key={o.classId}
                    disabled={
                      userClasses.find(b => b.classId === o.classId) && true
                    }
                    control={
                      <Checkbox
                        checked={
                          userClasses.find(b => b.classId === o.classId) && true
                        }
                        onChange={this.handleClassSelect(o.classId)}
                      />
                    }
                    label={o.class}
                  />
                ))}
              </FormGroup>
            </ExpansionPanelDetails>
          </ExpansionPanel>
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
        data: { userId, canvasUser }
      },
      open,
      onClose
    } = this.props;
    const {
      permissions: { canAddClasses },
      loading,
      errorText
    } = this.state;
    if (!open) return null;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          className={classes.root}
          onClose={onClose}
          aria-labelledby="manage-classes-dialog-title"
          aria-describedby="manage-classes-dialog-description"
        >
          <DialogTitle id="manage-classes-dialog-title">
            Add/Remove Classes
          </DialogTitle>
          <DialogContent>
            {loading && <CircularProgress size={12} />}
            {!loading && (
              <List className={classes.list}>{this.renderUserClasses()}</List>
            )}
            {!canvasUser && canAddClasses && !loading && (
              <Typography>List of available classes</Typography>
            )}
            {!canvasUser && canAddClasses && errorText && (
              <FormHelperText error>
                You have to select at least 1 class
              </FormHelperText>
            )}
            {!canvasUser &&
              canAddClasses &&
              !loading &&
              this.renderAvailableClasses()}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" variant="outlined">
              Close
            </Button>
            {canAddClasses && (
              <Button
                onClick={this.handleSubmit}
                color="primary"
                variant="contained"
              >
                Join
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

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ClassesManager));
