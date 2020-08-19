import React, { useState, useCallback } from 'react'
import { HideUntilLoaded } from 'react-animation'
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadImg = ({ url, loadingSize, style, fallback, className, alt }) => {
  const [fallbackComponent, setFallbackComponent] = useState(null)

  const onError = useCallback(() => {
    setFallbackComponent(fallback)
  }, [fallback])

  const loading = useCallback(() => <CircularProgress size={loadingSize} />, [loadingSize])

  return (
    <HideUntilLoaded
      animationIn="bounceIn"
      imageToLoad={url}
      Spinner={loading}
    >
      {fallbackComponent === null ?
        <img onError={onError} alt={alt || 'alt'} src={url} style={style} className={className} /> :
        fallbackComponent}
    </HideUntilLoaded>
  )
}

export default LoadImg
