import React from 'react';

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';

import { useTheme } from '@material-ui/core/styles';

import 'react-circular-progressbar/dist/styles.css';

import RadialSeparators from './RadialSeprators';

interface MvpCircularProgressBarProps {
  count: number;
  total: number;
}

const MvpCircularProgressBar = ({ count, total }: MvpCircularProgressBarProps) => {
  const theme = useTheme();

  return (
    <CircularProgressbarWithChildren
      value={(count * 100) / total}
      strokeWidth={14}
      text={count.toString()}
      styles={buildStyles({
        strokeLinecap: 'butt',
        textSize: 40,
        pathColor: theme.circleIn.palette.brand
      })}
    >
      <RadialSeparators count={total} />
    </CircularProgressbarWithChildren>
  );
};

export default MvpCircularProgressBar;
