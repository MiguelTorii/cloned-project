import React from 'react';
import useStyles from './styles';
import withRoot from '../../withRoot';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const MarkCard = ({ title, mark, markColor, active, ...props }) => {
  const classes = useStyles({ markColor });

  return (
    <div
      className={clsx(classes.markCardContainer, active && 'active')}
      {...props}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.markTitle}>
            { title }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.markText}>
            { mark }
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

MarkCard.propTypes = {
  title: PropTypes.string.isRequired,
  mark: PropTypes.number.isRequired,
  markColor: PropTypes.string,
  active: PropTypes.bool
};

MarkCard.defaultProps = {
  markColor: 'primary',
  active: false
};

export default withRoot(MarkCard);
