import { makeStyles } from '@material-ui/core/styles';

import { dialogStyle } from 'components/Dialog/Dialog';

const useStyles = makeStyles((theme) => ({
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  },
  blockLabel: {
    color: theme.circleIn.palette.danger,
    fontWeight: 700
  },
  blockButton: {
    minWidth: 164,
    background: '#FFFFFF',
    marginBottom: theme.spacing(1 / 2),
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
    borderRadius: 100
  }
}));

export default useStyles;
