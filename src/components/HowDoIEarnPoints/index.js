// @flow
import React from 'react';
import uuidv4 from 'uuid/v4';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const options = [
  { id: uuidv4(), title: 'Uploading Class Notes', subtitle: '500 points' },
  {
    id: uuidv4(),
    title: 'Asking a Question',
    subtitle: '1000  for a Best Answer'
  },
  {
    id: uuidv4(),
    title: 'Sharing a Link ',
    subtitle: '200 points for Accepted Links, 500 for Google Docs'
  },
  { id: uuidv4(), title: 'Creating Flashcards', subtitle: '500 points' },
  { id: uuidv4(), title: 'Creating Reminders', subtitle: '20 points' },
  {
    id: uuidv4(),
    title: 'Video Meet Up',
    subtitle: '250 points for initiating a meet up (once per day)'
  },
  {
    id: uuidv4(),
    title: 'Video Meet Up',
    subtitle: '800 points for a 5 minutes meet up (once per day)'
  }
];

const styles = () => ({
  root: {
    width: '100%',
    maxWidth: 360,
    minWidth: 300
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
        aria-labelledby="how-earn-points-dialog-title"
        aria-describedby="how-earn-points-dialog-description"
      >
        <DialogTitle id="how-earn-points-dialog-title">
          {'How do I earn points?'}
        </DialogTitle>
        <DialogContent>
          <List className={classes.root}>
            {options.map(item => (
              <ListItem key={item.id} dense>
                <ListItemIcon>
                  <CheckCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
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
