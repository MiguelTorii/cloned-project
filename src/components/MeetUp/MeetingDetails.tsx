import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '../../containers/Tooltip/Tooltip';
import { ReactComponent as AddUser } from '../../assets/svg/add-user.svg';
import { ReactComponent as ClipIcon } from '../../assets/svg/clip.svg';
import { styles } from '../_styles/MeetUp/MeetingDetails';

type Props = {
  classes?: any;
  onClose?: any;
  onCopy?: any;
  meetingUri?: any;
  setRef?: any;
  openClassmatesDialog?: any;
  meetingUriRef?: any;
};

const MeetingDetails = ({
  classes,
  onClose,
  onCopy,
  meetingUri,
  setRef,
  openClassmatesDialog,
  meetingUriRef
}: Props) => (
  <ClickAwayListener onClickAway={onClose}>
    <Paper elevation={3} className={classes.meetingDetails}>
      <Tooltip
        id={9061}
        placement="right"
        text="Invite friends and classmates to your Study Room here! Collaboration made easy! ⚡️"
        totalSteps={4}
        completedSteps={1}
      >
        <Box className={classes.detailContent}>
          <Box display="flex" justifyContent="space-between">
            <Typography component="p" variant="h6" className={classes.header}>
              Study Room Details
            </Typography>
            <IconButton aria-label="delete" onClick={onClose} size="small">
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Box marginTop={1}>
            <Button
              variant="contained"
              color="primary"
              className={classes.inviteMembers}
              onClick={openClassmatesDialog}
              endIcon={<AddUser />}
            >
              Invite others
            </Button>
          </Box>
          <Typography component="p" variant="body2" className={classes.description}>
            You can invite more to your study room, or share the link below!{' '}
            <span role="img" aria-label="rocket">
              🎉
            </span>
          </Typography>

          <OutlinedInput
            id="meeting-url"
            inputRef={(textarea) => setRef(textarea)}
            type="text"
            fullWidth
            className={classes.meetingUri}
            value={meetingUri}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={onCopy} edge="end">
                  <ClipIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </Tooltip>
    </Paper>
  </ClickAwayListener>
);

export default withStyles(styles as any)(MeetingDetails);
