import React, { memo, useState, useCallback } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import HideUntilLoaded from './HideUntilLoaded';

type Props = {
  url: string;
  loadingSize?: any;
  style?: any;
  fallback?: any;
  className?: string;
  alt?: any;
};

const LoadImg = ({ url, loadingSize, style, fallback, className, alt }: Props) => {
  const [fallbackComponent, setFallbackComponent] = useState(null);
  const onError = useCallback(() => {
    setFallbackComponent(fallback);
  }, [fallback]);
  const loading = useCallback(() => <CircularProgress size={loadingSize} />, [loadingSize]);
  return (
    <HideUntilLoaded animationIn="bounceIn" imageToLoad={url} Spinner={loading}>
      {fallbackComponent === null ? (
        <img onError={onError} alt={alt || 'alt'} src={url} style={style} className={className} />
      ) : (
        fallbackComponent
      )}
    </HideUntilLoaded>
  );
};

export default memo(LoadImg);
