import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
  ellipse: {
    width: 12,
    height: 12,
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    borderRadius: '100%',
    margin: 'auto 6px',
    padding: 1
  },
  whiteEllipse: {
    width: '100%',
    height: '100%',
    borderRadius: '100%',
    backgroundColor: 'white'
  }
});
type Props = {
  step: number;
  totalSteps: number;
};

const Ellipses = ({ step, totalSteps }: Props) => {
  const classes: any = useStyles();
  return (
    <div className={classes.root}>
      {[...(Array(totalSteps) as any).keys()].map((index) => (
        <div key={index} className={classes.ellipse}>
          {index >= step && <div className={classes.whiteEllipse} />}
        </div>
      ))}
    </div>
  );
};

export default Ellipses;
