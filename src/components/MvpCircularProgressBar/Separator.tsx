import React from 'react';

import useStyles from './SeparatorStyles';

interface SeparatorProps {
  turns: number;
}

const Separator = ({ turns }: SeparatorProps) => {
  const classes = useStyles();

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        transform: `rotate(${turns}turn)`
      }}
    >
      <div className={classes.bar} />
    </div>
  );
};

export default Separator;
