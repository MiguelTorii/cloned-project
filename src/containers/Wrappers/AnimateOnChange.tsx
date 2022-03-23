import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import clsx from 'clsx';

import type { ClassValue } from 'clsx';

const AnimateOnChange = ({
  current,
  previous,
  animationStyles,
  className,
  handleAnimationStart,
  children
}: {
  current: number;
  previous?: number;
  className?: ClassValue;
  animationStyles: string;
  handleAnimationStart?: () => void;
  children: ReactNode;
}) => {
  const difference = previous ? current - previous : 0;

  const { hasAnimated, setHasAnimated } = useResetOnDifference(current, previous);

  if (!difference || hasAnimated) {
    return null;
  }

  return (
    <div
      role="log"
      className={clsx(animationStyles, className)}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={() => setHasAnimated(true)}
    >
      {children}
    </div>
  );
};

const useResetOnDifference = (current, previous) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (previous && previous !== current) {
      setHasAnimated(false);
    }
  }, [current, previous]);

  return { hasAnimated, setHasAnimated };
};

export default AnimateOnChange;
