// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import type { HomeCard } from '../../types/models';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'left'
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
  referal: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  card: HomeCard
};

type State = {};

class Referral extends React.PureComponent<Props, State> {
  render() {
    const { classes, card } = this.props;
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
            variant="h3"
            className={classes.title}
            align="left"
            paragraph
          >
            {title}
          </Typography>
          <Typography variant="h6" align="left">
            {text}
          </Typography>
          <div className={classes.referal}>
            <img alt={title} src={imageUrl} className={classes.img} />
            <Fab
              variant="extended"
              color="primary"
              size="small"
              className={classes.button}
            >
              Get Referral Code
            </Fab>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Referral);
