/* eslint-disable no-restricted-syntax */
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import type { About } from '../../types/models';
import Dialog from '../Dialog/Dialog';
import { styles } from '../_styles/ProfileEdit';

type Props = {
  classes?: Record<string, any>;
  about?: Array<About>;
  open?: boolean;
  userProfileUrl?: string;
  firstName?: string;
  lastName?: string;
  onClose?: (...args: Array<any>) => any;
  onSubmit?: (...args: Array<any>) => any;
  onUpdateProfileImage?: (...args: Array<any>) => any;
};

type State = {
  studyGroupPreference: string;
  studyLocationPreference: string;
  subjectsPreference: string;
  clubsOrOrganizations: string;
  major: string;
};

class ProfileEdit extends React.PureComponent<Props, State> {
  state = {
    studyGroupPreference: '',
    studyLocationPreference: '',
    subjectsPreference: '',
    clubsOrOrganizations: '',
    major: ''
  };

  // eslint-disable-next-line no-undef
  fileInput: HTMLInputElement | null | undefined;

  componentDidMount = () => {
    const { about } = this.props;

    for (const field of about) {
      switch (field.id) {
        case 1:
          this.setState({
            studyGroupPreference: field.answer
          });
          break;

        case 2:
          this.setState({
            studyLocationPreference: field.answer
          });
          break;

        case 3:
          this.setState({
            subjectsPreference: field.answer
          });
          break;

        case 4:
          this.setState({
            major: field.answer
          });
          break;

        case 5:
          this.setState({
            clubsOrOrganizations: field.answer
          });
          break;

        default:
          break;
      }
    }
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const {
      studyGroupPreference,
      studyLocationPreference,
      subjectsPreference,
      clubsOrOrganizations,
      major
    } = this.state;
    const items = [
      {
        field: 'study_group_preference',
        updated_value: studyGroupPreference
      },
      {
        field: 'study_location_preference',
        updated_value: studyLocationPreference
      },
      {
        field: 'subjects_preference',
        updated_value: subjectsPreference
      },
      {
        field: 'clubs_or_organizations',
        updated_value: clubsOrOrganizations
      },
      {
        field: 'major',
        updated_value: major
      }
    ];
    onSubmit(items);
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    } as any);
  };

  render() {
    const { classes, open, onClose } = this.props;
    const {
      studyGroupPreference,
      studyLocationPreference,
      subjectsPreference,
      clubsOrOrganizations,
      major
    } = this.state;
    return (
      <Dialog
        className={classes.dialog}
        okTitle="Save"
        onCancel={onClose}
        onOk={this.handleSubmit}
        open={open}
        showActions
        showCancel
        title="About Me"
      >
        <div className={classes.form}>
          <FormControl fullWidth margin="normal">
            <InputLabel
              htmlFor="studyGroupPreference"
              classes={{
                shrink: classes.shrink
              }}
            >
              Do you prefer to study in groups or individually?
            </InputLabel>
            <Select
              value={studyGroupPreference}
              inputProps={{
                id: 'studyGroupPreference',
                name: 'studyGroupPreference'
              }}
              onChange={this.handleChange('studyGroupPreference')}
            >
              <MenuItem value="" />
              <MenuItem value="Groups">Groups</MenuItem>
              <MenuItem value="Individually">Individually</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              htmlFor="studyLocationPreference"
              classes={{
                shrink: classes.shrink
              }}
            >
              Do you prefer to study in person or virtually?
            </InputLabel>
            <Select
              value={studyLocationPreference}
              onChange={this.handleChange('studyLocationPreference')}
              inputProps={{
                id: 'studyLocationPreference',
                name: 'studyLocationPreference'
              }}
            >
              <MenuItem value="" />
              <MenuItem value="In Person">In Person</MenuItem>
              <MenuItem value="Virtually">Virtually</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              htmlFor="subjectsPreference"
              classes={{
                shrink: classes.shrink
              }}
            >
              Do you enjoy getting involved in helping classmates?
            </InputLabel>
            <Select
              value={subjectsPreference}
              onChange={this.handleChange('subjectsPreference')}
              inputProps={{
                id: 'subjectsPreference',
                name: 'subjectsPreference'
              }}
            >
              <MenuItem value="" />
              <MenuItem value="Always">Always</MenuItem>
              <MenuItem value="Most of the Time">Most of the Time</MenuItem>
              <MenuItem value="Sometimes">Sometimes</MenuItem>
              <MenuItem value="When I Can">When I Can</MenuItem>
              <MenuItem value="It’s Not My Thing">It’s Not My Thing</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="What is your major/concentration of study?"
            placeholder="Answer"
            InputLabelProps={{
              shrink: true,
              classes: {
                shrink: classes.shrink
              }
            }}
            onChange={this.handleChange('major')}
            name="major"
            value={major}
          />
          <TextField
            margin="normal"
            fullWidth
            label="List any clubs or organizations that you're a part of"
            placeholder="Answer"
            InputLabelProps={{
              shrink: true,
              classes: {
                shrink: classes.shrink
              }
            }}
            onChange={this.handleChange('clubsOrOrganizations')}
            name="clubsOrOrganizations"
            value={clubsOrOrganizations}
          />
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles as any)(ProfileEdit);
