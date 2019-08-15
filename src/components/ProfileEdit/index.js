/* eslint-disable no-restricted-syntax */
// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import ButtonBase from '@material-ui/core/ButtonBase';
// import Avatar from '@material-ui/core/Avatar';
// import CircularProgress from '@material-ui/core/CircularProgress';
import type { About } from '../../types/models';
import DialogTitle from '../DialogTitle';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarButton: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    position: 'relative'
  },
  avatar: {
    width: 80,
    height: 80
  },
  upload: {
    margin: theme.spacing.unit * 2
  },
  input: {
    display: 'none'
  },
  progress: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: '50%',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  shrink: {
    fontSize: 20
  }
});

type Props = {
  classes: Object,
  about: Array<About>,
  open: boolean,
  // userProfileUrl: string,
  // firstName: string,
  // lastName: string,
  onClose: Function,
  onSubmit: Function,
  onUpdateProfileImage: Function,
  uploading: boolean
};

type State = {
  studyGroupPreference: string,
  studyLocationPreference: string,
  subjectsPreference: string,
  clubsOrOrganizations: string,
  major: string
};

class ProfileEdit extends React.PureComponent<Props, State> {
  state = {
    studyGroupPreference: '',
    studyLocationPreference: '',
    subjectsPreference: '',
    clubsOrOrganizations: '',
    major: ''
  };

  componentDidMount = () => {
    const { about } = this.props;
    for (const field of about) {
      switch (field.id) {
        case 1:
          this.setState({ studyGroupPreference: field.answer });
          break;
        case 2:
          this.setState({ studyLocationPreference: field.answer });
          break;
        case 3:
          this.setState({ subjectsPreference: field.answer });
          break;
        case 4:
          this.setState({ major: field.answer });
          break;
        case 5:
          this.setState({ clubsOrOrganizations: field.answer });
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleOpenInputFile = () => {
    if (this.fileInput) this.fileInput.click();
  };

  handleInputChange = () => {
    const { onUpdateProfileImage } = this.props;
    if (
      this.fileInput &&
      this.fileInput.files &&
      this.fileInput.files.length > 0
    )
      onUpdateProfileImage(this.fileInput.files[0]);
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const {
      classes,
      open,
      // userProfileUrl,
      // firstName,
      // lastName,
      uploading,
      onClose
    } = this.props;
    const {
      studyGroupPreference,
      studyLocationPreference,
      subjectsPreference,
      clubsOrOrganizations,
      major
    } = this.state;
    // const name = `${firstName} ${lastName}`;
    // const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="profile-edit-dialog-title"
        aria-describedby="profile-edit-dialog-description"
      >
        <DialogTitle id="profile-edit-dialog-title" onClose={onClose}>
          About Me
        </DialogTitle>
        {/* <div className={classes.header}>
          <ButtonBase
            disabled={uploading}
            className={classes.avatarButton}
            onClick={this.handleOpenInputFile}
          >
            <Avatar
              className={classes.avatar}
              alt={initials}
              src={userProfileUrl}
            >
              {initials}
            </Avatar>
            {uploading && (
              <div className={classes.progress}>
                <CircularProgress />
              </div>
            )}
          </ButtonBase>
          <input
            accept="image/*"
            className={classes.input}
            ref={fileInput => {
              this.fileInput = fileInput;
            }}
            onChange={this.handleInputChange}
            type="file"
          />
          <Button
            disabled={uploading}
            onClick={this.handleOpenInputFile}
            className={classes.upload}
            color="primary"
            variant="contained"
          >
            Upload Profile Photo
          </Button>
        </div> */}
        <DialogContent>
          <div className={classes.form}>
            <FormControl fullWidth margin="normal">
              <InputLabel
                htmlFor="studyGroupPreference"
                classes={{ shrink: classes.shrink }}
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
                classes={{ shrink: classes.shrink }}
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
                classes={{ shrink: classes.shrink }}
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
                classes: { shrink: classes.shrink }
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
                classes: { shrink: classes.shrink }
              }}
              onChange={this.handleChange('clubsOrOrganizations')}
              name="clubsOrOrganizations"
              value={clubsOrOrganizations}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={uploading}
            variant="contained"
            onClick={onClose}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={uploading}
            onClick={this.handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ProfileEdit);
