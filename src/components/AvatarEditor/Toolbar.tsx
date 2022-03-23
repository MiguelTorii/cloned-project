import React from 'react';

import _ from 'lodash';

import { Paper, Grid, IconButton } from '@material-ui/core';
import { ZoomIn, ZoomOut, RotateRight, RotateLeft } from '@material-ui/icons';

import withRoot from 'withRoot';

import { useStyles } from '../_styles/AvatarEditor/Toolbar';

type Props = {
  onAction?: (...args: Array<any>) => any;
  disabledActions?: any[];
};

const Actions = [
  {
    id: 'zoom_in',
    icon: <ZoomIn />
  },
  {
    id: 'zoom_out',
    icon: <ZoomOut />
  },
  {
    id: 'rotate_right',
    icon: <RotateRight />
  },
  {
    id: 'rotate_left',
    icon: <RotateLeft />
  }
];

const Toolbar = ({ onAction, disabledActions }: Props) => {
  const classes: any = useStyles();
  return (
    <Paper className={classes.root}>
      <Grid container justifyContent="space-around">
        {Actions.map((action) => (
          <Grid key={action.id} item>
            <IconButton
              onClick={() => onAction(action.id)}
              disabled={_.includes(disabledActions, action.id)}
            >
              {action.icon}
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default withRoot(Toolbar);
