import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';

const TransparentIconButton = withStyles((theme) => ({
  root: {
    border: 'solid 1px white',
    width: 30,
    height: 30,
    '&:hover': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
    }
  },
  disabled: {
    '& svg': {
      color: '#5F6165'
    },
    borderColor: '#5F6165'
  }
}))(IconButton);

export default TransparentIconButton;
