import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  imageContainer: {
    width: 48,
    minWidth: 48,
    maxWidth: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  missionText: {
    fontSize: 14,
    marginBottom: theme.spacing(1 / 2)
  },
  missionInfoIcon: {
    fontSize: 16,
    verticalAlign: 'middle',
    marginLeft: theme.spacing(1 / 2),
    color: theme.circleIn.palette.gray3,
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1)
  }
}));
