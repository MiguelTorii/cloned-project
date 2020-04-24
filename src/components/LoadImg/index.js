import React, { useState } from 'react'
import { HideUntilLoaded } from 'react-animation'
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadImg = ({ url, loadingSize, style, fallback }) => {
  const [fallbackComponent, setFallbackComponent] = useState(null)
  const onError = () => {
    setFallbackComponent(fallback)
  }

  return (
    <HideUntilLoaded
      animationIn="bounceIn"
      imageToLoad={url}
      Spinner={() => <CircularProgress size={loadingSize} />}
    >
      {fallbackComponent === null ?
        <img onError={onError} alt='alt' src={url} style={style} /> :
        fallbackComponent}
    </HideUntilLoaded>
  )
}

export default LoadImg
