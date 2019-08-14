// @flow
import React from 'react';
import uuidv4 from 'uuid/v4';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LanguageIcon from '@material-ui/icons/Language';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EventIcon from '@material-ui/icons/Event';
import DuoIcon from '@material-ui/icons/Duo';
import LaunchIcon from '@material-ui/icons/Launch';
import DialogTitle from '../DialogTitle';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const options = [
  {
    id: uuidv4(),
    title: 'Uploading Class Notes',
    subtitle: '500 points',
    icon: <NoteAddIcon />,
    href: '/create/notes'
  },
  {
    id: uuidv4(),
    title: 'Asking a Question',
    subtitle: '1000  for a Best Answer',
    icon: <ContactSupportIcon />,
    href: '/create/question'
  },
  {
    id: uuidv4(),
    title: 'Sharing a Link ',
    subtitle: '200 points for Accepted Links, 500 for Google Docs',
    icon: <LanguageIcon />,
    href: '/create/sharelink'
  },
  {
    id: uuidv4(),
    title: 'Creating Flashcards',
    subtitle: '500 points',
    icon: <DashboardIcon />,
    href: '/create/flashcards'
  },
  {
    id: uuidv4(),
    title: 'Creating Reminders',
    subtitle: '20 points',
    icon: <EventIcon />,
    href: '/reminders'
  },
  {
    id: uuidv4(),
    title: 'Video Meet Up',
    subtitle: '800 points for a 5-minute meet up (once per day)',
    icon: <DuoIcon />,
    href: '/video-call'
  }
];

const styles = () => ({
  root: {
    width: '100%'
    // maxWidth: 360
    // minWidth: 300
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

class HowDoIEarnPoints extends React.PureComponent<Props> {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="how-earn-points-dialog-title"
        aria-describedby="how-earn-points-dialog-description"
      >
        <DialogTitle id="how-earn-points-dialog-title" onClose={onClose}>
          {'How do I earn points?'}
        </DialogTitle>
        <DialogContent>
          <List className={classes.root}>
            {options.map(item => (
              <ListItem key={item.id} dense>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  secondaryTypographyProps={{
                    color: 'textPrimary'
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Launch"
                    component={MyLink}
                    href={item.href}
                  >
                    <LaunchIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            autoFocus
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HowDoIEarnPoints);
