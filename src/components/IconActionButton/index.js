import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledIconButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.circleIn.palette.gray1,
    '&:hover, &.active': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
    }
  }
}))(IconButton);

const IconActionButton = ({ loading, children, ...rest }) => (
  <StyledIconButton {...rest}>
    { loading ? (
      <CircularProgress size={20} />
      ) : children
    }
  </StyledIconButton>
);

export default IconActionButton;
