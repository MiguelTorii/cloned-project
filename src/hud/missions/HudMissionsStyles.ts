import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  imageContainer: {
    width: 48,
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
    color: theme.circleIn.palette.gray3
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1)
  },
  highlightedButtonGroup: {
    boxShadow: `0 0 0 ${theme.spacing(1)}px ${theme.circleIn.palette.success}`
  }
}));
