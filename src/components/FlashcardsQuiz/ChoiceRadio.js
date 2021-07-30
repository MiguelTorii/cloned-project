import React from 'react';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    padding: '4px 12px 4px 4px'
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: 'solid 2px white'
  },
  checkIcon: {
    '&:before': {
      display: 'block',
      marginLeft: 2,
      marginTop: 2,
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundImage:
        'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
      content: '""'
    }
  }
});

const ChoiceRadio = (props) => {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      icon={<span className={classes.icon} />}
      checkedIcon={<span className={clsx(classes.icon, classes.checkIcon)} />}
      {...props}
    />
  );
};

export default ChoiceRadio;
