import { makeStyles } from '@material-ui/core/styles';

import { dialogStyle } from './Dialog';

export const useStyles = makeStyles(() => ({
  dialog: { ...dialogStyle, width: 600 }
}));
