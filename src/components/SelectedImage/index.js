import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import Button from '@material-ui/core/Button'
import LoadImg from 'components/LoadImg'
import Lightbox from 'react-images';
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  imgContainer: {
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    top: theme.spacing(),
    left: theme.spacing(),
    borderRadius: theme.spacing(),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    minWidth: 0,
  },
  hidden: {
    display: 'none'
  }
}))

const SelectedImage = ({
  handleRemoveImg,
  image,
  imageStyle,
}) => {
  const classes = useStyles()
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)

  const onHoverEnter = useCallback(() => setHover(true), [])
  const onHoverLeave= useCallback(() => setHover(false), [])

  const onOpenImage = useCallback(() => setOpen(true), [])
  const onCloseImage = useCallback(() => setOpen(false), [])

  return (
    <div
      className={classes.imgContainer}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      <LoadImg url={image} style={imageStyle} />
      <div
        className={clsx(classes.buttonGroup, !hover && classes.hidden)}
      >
        <Button
          className={classes.button}
          onClick={onOpenImage}
        >
          <SearchIcon fontSize="small" />
        </Button>
        {handleRemoveImg &&<Button
          className={classes.button}
          onClick={handleRemoveImg}
        >
          <ClearIcon fontSize="small" />
        </Button>}
      </div>
      {open && <Lightbox
        backdropClosesModal
        images={[{src: image}]}
        isOpen
        onClose={onCloseImage}
      />}
    </div>
  )
}

export default SelectedImage
