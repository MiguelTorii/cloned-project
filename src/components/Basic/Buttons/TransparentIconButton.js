import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';

const TransparentIconButton = withStyles((theme) => ({
  disabled: {
    '& svg': {
      color: '#5F6165'
    }
  }
}))(IconButton);

export default TransparentIconButton;
