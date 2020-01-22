// @flow

import React from 'react';
import moment from 'moment';
import {
  ValidatorForm,
  SelectValidator
} from 'react-material-ui-form-validator';
import { DateTimePicker } from 'material-ui-pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '../DialogTitle';
import ClassesSelector from '../../containers/ClassesSelector';
import OutlinedTextValidator from '../OutlinedTextValidator';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    padding: theme.spacing(2)
  },
  picker: {
    padding: theme.spacing(2)
  },
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
  classes: Object,
  open: boolean,
  loading: boolean,
  onClose: Function,
  onSubmit: Function
};

type State = {
  purpose: string,
  classId: number,
  sectionId: ?number,
  meeting: boolean,
  selectedDate: Object,
  help: string
};

class VideoPointsDialog extends React.PureComponent<Props, State> {
  state = {
    purpose: '',
    classId: 0,
    sectionId: null,
    meeting: false,
    selectedDate: moment(),
    help: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClassesChange = ({ classId, sectionId }) => {
    this.setState({ classId, sectionId });
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleDateChange = selectedDate => {
    this.setState({ selectedDate });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const {
      purpose,
      classId,
      sectionId,
      meeting,
      selectedDate,
      help
    } = this.state;
    onSubmit({ purpose, classId, sectionId, meeting, selectedDate, help });
  };

  getLeftCharts = () => {
    const { help = '' } = this.state;
    // help ? 50 - help.length : 50;
    return 50 - help.length >= 0 ? 50 - help.length : 0;
  };

  render() {
    const { classes, open, loading, onClose } = this.props;
    const { purpose, meeting, selectedDate, help } = this.state;
    return (
      <Dialog
        open={open}
        disableBackdropClick={loading}
        disableEscapeKeyDown={loading}
        onClose={onClose}
        aria-labelledby="video-points-title"
        aria-describedby="video-points-description"
      >
        <DialogTitle id="video-points-title" onClose={onClose}>
          Congratulations!
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText id="video-points-description" color="textPrimary">
            {
              "Nice Job! You've unlocked points for today's video study session. Fill out the fields below to receive your points"
            }
          </DialogContentText>
          <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.formControl}
            >
              <SelectValidator
                disabled={loading}
                value={purpose}
                name="purpose"
                label="Purpose of the Meetup"
                onChange={this.handleChange('purpose')}
                variant="outlined"
                validators={['required']}
                errorMessages={['This field is required']}
              >
                <MenuItem value="" />
                <MenuItem value="1">Homework Help</MenuItem>
                <MenuItem value="2">Studying for test</MenuItem>
                <MenuItem value="3">Working on a Project</MenuItem>
                <MenuItem value="4">School Group/Club/Sport</MenuItem>
                <MenuItem value="5">Fun</MenuItem>
              </SelectValidator>
            </FormControl>
            {(Number(purpose) === 1 ||
              Number(purpose) === 2 ||
              Number(purpose) === 3) && (
              <ClassesSelector
                disabled={loading}
                onChange={this.handleClassesChange}
              />
            )}
            <DialogContentText color="textPrimary">
              Do you want to schedule another meeting for the next 7 days?
            </DialogContentText>
            <FormControlLabel
              control={
                <Switch
                  disabled={loading}
                  checked={meeting}
                  onChange={this.handleSwitchChange('meeting')}
                  value="meeting"
                  color="primary"
                />
              }
              label="Yes"
            />
            {meeting && (
              <DateTimePicker
                disabled={loading}
                value={selectedDate}
                onChange={this.handleDateChange}
                variant="outlined"
                label=""
                className={classes.picker}
              />
            )}
            <OutlinedTextValidator
              label="What did you learn or how did the video meet up help?"
              onChange={this.handleChange}
              name="help"
              multiline
              disabled={loading}
              rows={4}
              value={help}
              validators={['required']}
              errorMessages={['This field is required']}
            />
            <DialogContentText color="textPrimary">{`${this.getLeftCharts()} characters left to earn points`}</DialogContentText>
            <DialogActions>
              <Button onClick={onClose} disabled={loading} color="primary">
                Cancel
              </Button>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  disabled={loading}
                  type="submit"
                  color="primary"
                >
                  Submit
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </DialogActions>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(VideoPointsDialog);
