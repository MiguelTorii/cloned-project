import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  root: {
    width: 245,
    marginTop: theme.spacing(),
    borderRadius: theme.spacing(),
    padding: theme.spacing(2),
    cursor: 'grab',
    backgroundColor: '#FFF',
    '-webkit-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    'box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)'
  },
  container: {},
  chip: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold'
  },
  ellipsis: {
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  title: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.normalButtonText1,
    overflow: 'hidden',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    maxHeight: '4.5em',
    marginBottom: theme.spacing(),
    lineHeight: '1.5em'
  },
  date: {
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 'bold'
  },
  detailsButton: {
    minWidth: 45,
    padding: 0,
    color: theme.circleIn.palette.darkActionBlue
  },
  iconButton: {
    padding: 0
  },
  hover: {
    position: 'relative',
    bottom: 4
  },
  bottom: {
    minHeight: theme.spacing(3)
  },
  newButton: {
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 'bold'
  },
  oneLine: {
    height: '1.5rem'
  },
  twoLines: {
    height: '3rem'
  },
  threeLines: {
    height: '4.5rem',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical'
  },
  buttons: {
    height: theme.spacing(5)
  },
  bell: {
    color: theme.circleIn.palette.normalButtonText1,
    position: 'absolute',
    top: theme.spacing(),
    right: theme.spacing(),
    opacity: 0.5
  }
}));