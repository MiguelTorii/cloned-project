import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: any) => ({
  messageLoadingRoot: {
    height: 'calc(100% - 24px)',
    flexGrow: 1,
    display: 'flex',
    margin: theme.spacing(3, 3, 0, 3),
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      margin: 0
    }
  },
  messageLoadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    paddingBottom: theme.spacing(10)
  },
  expertTitle: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center'
  },
  emptyChatImg: {
    width: 255
  }
}));
