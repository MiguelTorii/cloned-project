import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  separator: {
    color: theme.circleIn.palette.gray3
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
