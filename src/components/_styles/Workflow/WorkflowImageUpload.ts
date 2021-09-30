import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
  dropLabel: {
    width: '100%'
  },
  addIcon: {
    fontSize: theme.spacing(4)
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: 50,
    borderStyle: 'dashed',
    marginTop: theme.spacing(2),
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  uploadContainer: {
    padding: theme.spacing(2, 0)
  },
  image: {
    maxHeight: 150,
    position: 'absolute',
    left: '-50%'
  },
  imagesContainer: {
    overflow: 'auto'
  },
  buttonImage: {
    height: 150
  },
  imageContainer: {
    position: 'relative',
    marginRight: theme.spacing(),
    marginTop: theme.spacing(),
    overflow: 'hidden',
    height: 150,
    width: 100
  },
  iconButton: {
    zIndex: 1,
    position: 'absolute',
    right: 5,
    padding: 0,
    background: 'rgba(255, 255, 255, 0.5)'
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  }
}));
