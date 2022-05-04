import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: theme.circleIn.palette.gray1,
    borderTopLeftRadius: '.5rem',
    borderTopRightRadius: '.5rem'
  },
  mainBar: {
    padding: '.4rem .6rem',
    justifyContent: 'space-between',
    height: '2.6rem',
    minHeight: 0
  },
  logo: {
    height: '1.6rem',
    marginRight: '.7rem'
  },
  channelBar: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    borderBottom: `1px solid ${theme.circleIn.palette.white}`,
    maxWidth: '100%',
    overflow: 'hidden',
    padding: '.5rem 0'
  },
  siteName: {
    fontSize: '1rem',
    display: 'inline-block'
  },
  channelTypeName: {
    fontSize: '.7rem'
  },
  channelName: {
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '1.1rem',
    width: '100%',
    padding: '0 1rem 0 0'
  },
  backButton: {
    border: '0',
    backgroundColor: 'transparent',
    height: '1.5rem',
    width: '.6rem',
    display: 'inline-block',
    marginRight: '1rem'
  },
  conversationHeader: {
    padding: '0 1rem',
    display: 'flex',
    width: '100%',
    alignItems: 'center'
  },
  badgesWrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '1rem',
    paddingBottom: '0.7rem',
    paddingLeft: '0.7rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    width: '100%'
  },
  channelTypesSeparator: {
    width: '1px',
    backgroundColor: theme.circleIn.palette.white
  },
  communityBadge: {
    margin: 0,
    padding: '1rem 0'
  },
  editIconLink: {
    border: '0',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editIcon: {
    height: '1.6rem',
    width: '1.6rem',
    fill: 'white'
  }
}));
