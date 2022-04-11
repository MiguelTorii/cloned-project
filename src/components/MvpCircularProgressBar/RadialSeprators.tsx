import React from 'react';

import range from 'lodash/range';

import Separator from './Separator';

interface RadialSeparatorsProps {
  count: number;
}

const RadialSeparators = ({ count }: RadialSeparatorsProps) => (
  <>
    {range(count).map((index) => (
      <Separator key={index} turns={index / count} />
    ))}
  </>
);

export default RadialSeparators;
