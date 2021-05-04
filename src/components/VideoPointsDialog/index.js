// @flow

import React from 'react';
import moment from 'moment';
import {
  ValidatorForm,
  SelectValidator
} from 'react-material-ui-form-validator';
import { DateTimePicker } from 'material-ui-pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '../Dialog';
import ClassesSelector from '../../containers/ClassesSelector';
import OutlinedTextValidator from '../OutlinedTextValidator';
import { styles } from '../_styles/VideoPointsDialog';

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
        ariaDescribedBy="video-points-description"
        className={classes.dialog}
        disableBackdropClick={loading}
        disableActions={loading}
        disableEscapeKeyDown={loading}
        okTitle="Submit"
        onCancel={onClose}
        onOk={this.handleSubmit}
        open={open}
        showActions
        showCancel
        title="Congratulations!"
      >
        <div className={classes.content}>
          {loading && (
            <CircularProgress
              size={24}
              className={classes.buttonProgress}
            />
          )}
          <Typography id="video-points-description" color="textPrimary">
            Nice Job! You've unlocked points for today's video study session. Fill out the fields below to receive your points
          </Typography>
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
            <Typography color="textPrimary">
              Do you want to schedule another meeting for the next 7 days?
            </Typography>
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
            <Typography
              color="textPrimary">
              {`${this.getLeftCharts()} characters left to earn points`}
            </Typography>
          </ValidatorForm>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(VideoPointsDialog);
