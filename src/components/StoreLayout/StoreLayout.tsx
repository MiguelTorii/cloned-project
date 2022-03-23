import React from 'react';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { styles } from '../_styles/StoreLayout';

type Props = {
  classes: Record<string, any>;
  children: React.ReactNode;
};

const StoreLayout = ({ classes, children }: Props) => (
  <Paper className={classes.hudRoot} elevation={0}>
    <Typography variant="subtitle1" paragraph>
      As your points add up each month, you’ll have a chance to win an e-giftcard for one of your
      top three choices below!
    </Typography>
    {children}
  </Paper>
);

export default withStyles(styles as any)(StoreLayout);
