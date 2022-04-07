import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 145,
    right: 60,
    width: 420,
    height: 600,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    borderRadius: 20,
    border: '1px solid #FFFFFF',
    zIndex: 1500
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(),
    fontSize: 24,
    fontWeight: 700
  },
  member: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing()
  },
  memberTitle: {
    fontSize: 16,
    marginBottom: theme.spacing(1),
    fontWeight: 700
  },
  memberContainer: {
    margin: theme.spacing(2, 4)
  },
  fullname: {
    fontSize: 14,
    marginLeft: theme.spacing(),
    fontWeight: 700
  },
  closeIcon: {
    color: '#979797',
    cursor: 'pointer',
    position: 'absolute',
    right: 13,
    top: 5
  },
  messageScroll: {
    flex: 1
  },
  messageContainer: {
    margin: theme.spacing(0, 1),
    flex: 1,
    overflowY: 'auto',
    position: 'relative'
  },
  messageContainerNoImg: {
    height: 405
  },
  messageContainerImg: {
    height: 300
  },
  typing: {
    minHeight: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  typingText: {
    marginLeft: theme.spacing()
  },
  uploadButton: {
    marginRight: theme.spacing(),
    backgroundColor: theme.circleIn.palette.appBar,
    border: `1px solid ${theme.circleIn.palette.helperText}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: theme.spacing()
  },
  input: {
    display: 'none'
  },
  files: {
    width: '100%',
    padding: theme.spacing(1),
    background: theme.circleIn.palette.hoverMenu,
    borderRadius: theme.spacing(0, 0, 2.5, 2.5),
    display: 'flex',
    flexWrap: 'wrap'
  },
  tooltip: {
    fontSize: 14,
    backgroundColor: theme.circleIn.palette.tooltipBackground
  },
  tooltipArrow: {
    '&::before': {
      backgroundColor: theme.circleIn.palette.tooltipBackground
    }
  },
  popper: {
    zIndex: 1500,
    width: 123,
    textAlign: 'center'
  }
}));
