// @flow

import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import { feedResources } from 'api/feed'
import Linkify from 'react-linkify'
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';

const styles = theme => ({
  paper: {
    margin: theme.spacing(1, 5, 0, 1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    justifyContent: 'center',
    borderRadius: theme.spacing(),
  },
  img: {
    width: '60%'
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
    padding: theme.spacing(0, 2, 5, 2),
    '& a': {
      textDecoration: 'none',
      color: theme.circleIn.palette.brand
    },
    fontSize: 14,
  }
});

type Props = {
  classes: Object,
  width: string,
  user: UserState
};


const FeedResources = ({ width, classes, user }: Props) => {
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

  if (!display || ['xs', 'sm'].includes(width)) return null

  return (
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
        <Linkify>{body}</Linkify>
      </Typography>
    </Paper>
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
)(withStyles(styles)(withWidth()(FeedResources)));
