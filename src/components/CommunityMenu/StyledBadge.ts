import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 10,
    top: '90%',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    minWidth: 25
  }
}))(Badge);
export default StyledBadge;
