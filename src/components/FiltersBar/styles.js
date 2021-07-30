import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  separator: {
    color: '#5F6165'
  },
  item: {
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1,
    '&:hover, &:focus, &:active': {
      backgroundColor: theme.circleIn.palette.modalBackground
    }
  },
  itemActive: {
    backgroundColor: theme.circleIn.palette.modalBackground
  }
}));
