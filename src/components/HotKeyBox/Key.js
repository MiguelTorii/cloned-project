import React from 'react';
import PropTypes from 'prop-types';

import useStyles from './styles';

const Key = ({ keyText }) => {
  const classes = useStyles();

  return (
    <span className={classes.key}>
      {keyText}
    </span>
  );
};

Key.propTypes = {
  keyText: PropTypes.string.isRequired
};

export default Key;
