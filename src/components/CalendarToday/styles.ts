import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: any) => ({
  root: {},
  monthBox: {
    width: 135,
    height: 32,
    paddingTop: theme.spacing(1 / 2),
    borderRadius: '10px 10px 0 0',
    background: theme.circleIn.palette.primaryii222
  },
  monthText: {
    color: 'white',
    fontWeight: 700,
    textAlign: 'center'
  },
  dayBox: {
    backgroundColor: 'white',
    width: 135,
    height: 103,
    borderRadius: '0 0 10px 10px',
    padding: theme.spacing(1),
    color: theme.circleIn.palette.modalBackground
  },
  dayText: {
    textAlign: 'center',
    fontSize: '60px',
    lineHeight: '60px',
    fontWeight: 700
  },
  weekDayText: {
    textAlign: 'center',
    fontSize: '14px',
    color: theme.circleIn.palette.gray3
  }
}));
