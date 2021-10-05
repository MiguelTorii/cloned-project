import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { InviteCard } from '../../types/models';
import { styles } from '../_styles/InviteYourFriendsCard';

type Props = {
  classes?: Record<string, any>;
  data?: InviteCard;
  isLoading?: boolean;
  onCopy?: (...args: Array<any>) => any;
};
type State = {};

class InviteYourFriendsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, data, onCopy, isLoading } = this.props;

    if (isLoading) {
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          {data.title}
        </Typography>
        <div className={classes.referral}>
          <img alt={data.title} src={data.imageUrl} className={classes.img} />
          <div className={classes.link}>
            <Typography variant="h6" align="center">
              {data.referralCode}
            </Typography>
          </div>
          <CopyToClipboard text={data.referralCode} onCopy={onCopy}>
            <Button variant="contained" color="primary" autoFocus className={classes.button}>
              Share
            </Button>
          </CopyToClipboard>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles as any)(InviteYourFriendsCard);
