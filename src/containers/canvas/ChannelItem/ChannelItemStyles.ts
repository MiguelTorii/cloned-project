import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  iconProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    color: 'white'
  },
  avatarProfile: {
    backgroundColor: theme.circleIn.palette.profilebgColor
  },
  channelItemSecondary: {
    color: theme.circleIn.palette.primaryText1
  },
  primary: {
    fontSize: '0.9rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  secondary: {
    fontSize: '0.7rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '& *': {
      margin: 0
    }
  },
  time: {
    fontSize: '0.6rem',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    paddingLeft: '.6rem'
  }
}));
