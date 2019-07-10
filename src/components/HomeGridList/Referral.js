// @flow
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import type { HomeCard } from '../../types/models';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'left',
    height: '100%'
  },
  title: {
    fontWeight: 'bold'
  },
  img: {
    width: 90,
    margin: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit
  },
  referral: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  referralCode: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    padding: theme.spacing.unit,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    borderRadius: 4,
    marginRight: theme.spacing.unit * 2
  },
  icon: {
    marginRight: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  referralCode: string,
  card: HomeCard,
  onCopy: Function
};

type State = {};

class Referral extends React.PureComponent<Props, State> {
  render() {
    const { classes, referralCode, card, onCopy } = this.props;
    const {
      title,
      data: {
        message: { text },
        imageUrl
      }
    } = card;

    return (
      <Grid item xs={6}>
        <Paper className={classes.paper} elevation={0}>
          <Typography
            variant="h4"
            className={classes.title}
            align="left"
            paragraph
          >
            {title}
          </Typography>
          <Typography variant="h6" align="left">
            {text}
          </Typography>
          <div className={classes.referral}>
            <img alt={title} src={imageUrl} className={classes.img} />
            <div className={classes.referralCode}>
              <div className={classes.link}>
                <Typography variant="subtitle1">{referralCode}</Typography>
              </div>
              <CopyToClipboard text={referralCode} onCopy={onCopy}>
                <Button variant="contained" color="primary" autoFocus>
                  <FileCopyIcon className={classes.icon} />
                  Copy
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Referral);
