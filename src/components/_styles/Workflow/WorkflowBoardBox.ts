import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      overflowY: 'hidden'
    }
  },
  container: {
    height: 'calc(100vh - 160px)',
    borderRadius: theme.spacing(1, 1, 0, 0),
    marginRight: theme.spacing(2),
    padding: theme.spacing(1, 0),
    width: theme.spacing(34)
  },
  headerItem: {
    width: 250
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  button: {
    '-webkit-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    '-moz-box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    'box-shadow': '10px 10px 25px -15px rgba(0,0,0,0.75)',
    textAlign: 'center',
    backgroundColor: theme.circleIn.palette.deepSeaOcean,
    fontSize: 16,
    width: theme.spacing(31),
    borderRadius: theme.spacing(),
    '& span': {
      textTransform: 'none'
    },
    margin: theme.spacing(1, 0),
    padding: 0,
    '& hover': {
      backgroundColor: theme.circleIn.palette.brand
    }
  },
  newContainer: {
    marginBottom: theme.spacing()
  },
  listContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'start',
    height: 'calc(100vh - 265px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0,0,0,0)'
    }
  },
  containerAnnouncement: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'start',
    height: 'calc(100vh - 320px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0,0,0,0)'
    }
  },
  inputContainer: {
    position: 'relative'
  },
  placeholder: {
    position: 'absolute',
    color: theme.circleIn.palette.primaryText2,
    top: 4,
    left: 4
  },
  textField: {
    '& .MuiInputBase-root': {
      color: `${theme.circleIn.palette.normalButtonText1} !important`
    }
  },
  multilineColor: {
    color: `${theme.circleIn.palette.normalButtonText1} !important`
  }
}));