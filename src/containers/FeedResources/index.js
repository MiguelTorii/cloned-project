// @flow

import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { feedResources } from 'api/feed'
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';

const styles = theme => ({
  paper: {
    margin: theme.spacing(1, 2, 0, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    justifyContent: 'center',
    borderRadius: theme.spacing(),
  },
  img: {
    width: '100%'
  },
  imgContainer: {
    background: '#FFF',
    minHeight: theme.spacing(5),
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  title: {
    fontWeight: 'bold',
    padding: theme.spacing(2, 0, 2, 0),
  },
  text: {
    padding: theme.spacing(0, 2, 5, 2),
    fontSize: 12,
  }
});

type Props = {
  classes: Object,
  user: UserState
};


const FeedResources = ({ classes, user }: Props) => {
  const {
    data: {
      userId
    }
  } = user

  const [logo, setLogo] = useState(null)
  const [title, setTitle] = useState(null)
  const [body, setBody] = useState(null)
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    const init = async () => {
      const res = await feedResources({ userId })
      if (res) {
        setLogo(res.smallLogo)
        setTitle(res.resourcesTitle)
        setBody(res.resourcesBody)
        setDisplay(res.display)
      }
    }

    if (userId) init()
  }, [userId])

  if (!display) return null

  return (
    <Grid 
      item
      xs={12}
      md={3}
    >
      <Paper className={classes.paper}>
        <Grid item>
          <div className={classes.imgContainer}>
            {logo && <img alt='logo' className={classes.img} src={logo} />}
          </div>
        </Grid>
        <Typography className={classes.title}>
          {title}
        </Typography>
        <Typography className={classes.text}>
          {body}
        </Typography>
      </Paper>
    </Grid>
  );
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user,
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FeedResources));
