import React from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../withRoot';
import useStyles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { LinearProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const GradientProgress = withStyles((theme) => ({
  root: {
    height: 28,
    borderRadius: 40
  },
  colorPrimary: {
    backgroundColor: theme.circleIn.palette.modalBackground
  },
  bar: {
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
  }
}))(LinearProgress);

const LinearProgressBar = ({ value, totalValue }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <GradientProgress
        value={value * 100 / totalValue}
        variant="determinate"
      />
      <Typography className={classes.text}>
        { `${value} / ${totalValue}` }
      </Typography>
    </div>
  );
};

LinearProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  totalValue: PropTypes.number.isRequired
};

export default withRoot(LinearProgressBar);
