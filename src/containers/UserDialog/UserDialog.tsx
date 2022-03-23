import React from 'react';

import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import type { State as StoreState } from 'types/state';

const useStyles = makeStyles((theme) => ({
  background: {
    position: 'fixed',
    overflow: 'hidden',
    height: `100%`,
    margin: -theme.spacing(),
    width: `100%`,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre',
    textAlign: 'center',
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
    backdropFilter: 'blur(5px)'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 24
  }
}));

type Props = {
  user?: any;
};

const UserDialog = ({ user }: Props) => {
  const {
    dialogMessage: { title }
  } = user;
  const classes: any = useStyles();

  if (!title) {
    return null;
  }

  return (
    <div className={classes.background}>
      <Typography className={classes.text}>{title}</Typography>
    </div>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(UserDialog);
