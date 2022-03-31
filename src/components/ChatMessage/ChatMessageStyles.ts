import { makeStyles } from '@material-ui/core/styles';

import { gutterStyle } from 'components/_styles/Gutter';

const useStyles = makeStyles((theme) => ({
  paper: { ...gutterStyle(theme), paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(),
    marginBottom: theme.spacing(),
    alignItems: 'flex-start',
    width: '70%'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  name: {
    color: 'white',
    paddingLeft: 0
  },
  message: {
    maxWidth: '100%',
    marginBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column'
  },
  reverse: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing(),
    maxWidth: 120
  },
  createdAt: {
    paddingLeft: 0,
    color: theme.circleIn.palette.primaryText1
  },
  videoSpace: {
    height: 70,
    width: '100%'
  },
  video: {
    flex: 1,
    position: 'absolute',
    maxWidth: 250,
    width: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  videoTitle: {
    color: 'white'
  },
  videoSubTitle: {
    textAlign: 'center',
    color: 'white'
  },
  body: {
    flex: 1,
    borderRadius: 20,
    padding: '5px 20px 5px 20px',
    textAlign: 'left',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    color: theme.circleIn.palette.secondaryText,
    wordWrap: 'break-word',
    width: '100%',
    '& a': {
      color: theme.circleIn.palette.brand
    }
  },
  right: {
    textAlign: 'right',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    color: theme.circleIn.palette.secondaryText
  },
  avatarLink: {
    textDecoration: 'none',
    marginTop: 3
  },
  link: {
    color: theme.palette.primary.main
  }
}));

export default useStyles;
