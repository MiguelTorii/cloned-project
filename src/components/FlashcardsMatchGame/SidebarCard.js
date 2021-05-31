import React from 'react';
import useStyles from './styles';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const SidebarCard = ({ title, text }) => {
  const classes = useStyles();

  return (
    <Box className={classes.sidebarCard}>
      <Typography variant="h6" className={classes.cardTitle}>
        {title}
      </Typography>
      {text}
    </Box>
  );
};

SidebarCard.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.element.isRequired
};

export default SidebarCard;
