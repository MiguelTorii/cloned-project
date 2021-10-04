import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  flashCardPreview: {
    position: 'relative',
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    borderRadius: theme.spacing(),
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
    color: '#ffffff',
    fontSize: 11,
    height: 110,
    marginBottom: 15,
    marginRight: 15,
    minWidth: 199,
    padding: '10px 20px 10px 20px',
    width: 199
  },
  markdownContainer: {
    maxHeight: 35,
    marginLeft: 8,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  image: {
    textAlign: 'center'
  },
  count: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.75)',
    borderRadius: theme.spacing(),
    zIndex: 2,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  }
}));