import { makeStyles } from '@material-ui/core/styles';
import { dialogStyle } from '../../../components/Dialog/Dialog';

const useStyles = makeStyles((theme: any) => ({
  dialog: { ...dialogStyle, width: 500, zIndex: 2100 },
  blockLabel: {
    color: theme.circleIn.palette.textNormalButton,
    fontWeight: 700
  },
  blockButton: {
    minWidth: 164,
    background: theme.circleIn.palette.danger,
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
    borderRadius: 100
  },
  removeChannel: {
    marginTop: theme.spacing()
  }
}));
export default useStyles;
