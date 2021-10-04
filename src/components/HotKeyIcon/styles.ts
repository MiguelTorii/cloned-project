import { makeStyles } from "@material-ui/core";
export default makeStyles(theme => ({
  root: {
    position: 'relative',
    cursor: 'pointer',
    width: 56,
    height: 56,
    borderRadius: '100%',
    '&:hover': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
    }
  },
  icon: {
    fontSize: 45,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));