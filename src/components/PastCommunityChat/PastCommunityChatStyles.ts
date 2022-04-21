import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  tooltip: {
    fontSize: 14
  },
  pastClassImg: {
    height: 50,
    width: 50,
    cursor: 'pointer',
    position: 'absolute',
    bottom: 8,
    left: 10,
    zIndex: '1400'
  },
  pastClassesContainer: {
    height: 60,
    width: 350,
    backgroundColor: theme.circleIn.palette.gray1,
    border: `solid 1px ${theme.circleIn.palette.navbarBorderColor}`,
    paddingTop: theme.spacing(),
    overflow: 'hidden',
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    left: 70,
    zIndex: '5000'
  },
  pastClassesInsert: {
    display: 'flex',
    maxWidth: 350,
    overflowX: 'auto'
  },
  selected: {
    outline: `solid 2px ${theme.circleIn.palette.white}`,
    borderRadius: '50%'
  },
  pastClassText: {
    paddingLeft: theme.spacing()
  }
}));
