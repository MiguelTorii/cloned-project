import React from 'react';
import withRoot from 'withRoot';
import { Paper, Grid, IconButton } from '@material-ui/core';
import { ZoomIn, ZoomOut, RotateRight, RotateLeft } from '@material-ui/icons';
import { useStyles } from '../_styles/AvatarEditor/Toolbar';
import _ from 'lodash';

type Props = {
  onAction: Function,
  disabledActions: array
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
  },
  // {
  //   id: 'crop',
  //   icon: <Crop />
  // }
]

const Toolbar = ({ onAction, disabledActions }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Grid container justify="space-around">
        {
          Actions.map((action) => (
            <Grid key={action.id} item>
              <IconButton
                onClick={() => onAction(action.id)}
                disabled={_.includes(disabledActions, action.id)}
              >
                { action.icon }
              </IconButton>
            </Grid>
          ))
        }
      </Grid>
    </Paper>
  );
};

export default withRoot(Toolbar);
