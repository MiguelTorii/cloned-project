import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
const StyledBadge = withStyles(theme => ({
  badge: {
    right: 5,
    top: '100%',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    minWidth: 25
  }
}))(Badge);
export default StyledBadge;