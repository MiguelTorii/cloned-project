// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Linkify from 'react-linkify'

const styles = theme => ({
  paper: {
    margin: theme.spacing(1, 0, 0, 1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(),
  },
  img: {
    width: '40%'
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFF',
    minHeight: theme.spacing(5),
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: theme.spacing(2, 0, 2, 0),
  },
  text: {
    padding: theme.spacing(2, 2, 0, 2),
    color: theme.circleIn.palette.primaryText2,
    '& a': {
      textDecoration: 'none',
      color: theme.circleIn.palette.brand
    },
    fontSize: 20,
    textAlign: 'center',
  },
  textContainer: {
    margin: theme.spacing(2, 2, 4, 2),
  }
});

type Props = {
  classes: Object,
  logo: string,
  body: string
};


const Empty = ({ classes, logo, body }: Props) => {
  return (
    <Paper className={classes.paper}>
      <Grid item>
        <div className={classes.imgContainer}>
          {logo && <img alt='logo' className={classes.img} src={logo} />}
        </div>
      </Grid>
      <Grid 
        container
        className={classes.textContainer}
        alignItems='center'
        justify='center'
        spacing={2}
      >
        {body.split('\n').map(b => <Typography key={b} className={classes.text}>
          <Linkify properties={{target: '_blank' }}>
            {b}
          </Linkify>
        </Typography>)}
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(Empty)
