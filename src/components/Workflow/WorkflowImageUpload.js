// @flow

import React, { useMemo, useContext, useState, useCallback } from 'react'
import Typography from '@material-ui/core/Typography'
import Dropzone from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import Lightbox from 'react-images'
import uuidv4 from 'uuid/v4'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddIcon from '@material-ui/icons/Add'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import update from 'immutability-helper'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import WorkflowContext from 'containers/Workflow/WorkflowContext'
import ButtonBase from '@material-ui/core/ButtonBase'
import { getPresignedURLs } from '../../api/media'
import { useStyles } from '../_styles/Workflow/WorkflowImageUpload'

const WorkflowImageUpload = React.forwardRef(({ imagesProps }, ref) => {
  const { userId, enqueueSnackbar } = useContext(WorkflowContext)
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([...imagesProps])
  const [disabled, setDisabled] = useState(false)

  const compressImage = useCallback(async file => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    return imageCompression(file, options)
  }, [])

  const getFileExtension = useCallback(filename => filename.split('.').pop(), [])

  const onDrop = useCallback(async acceptedFiles => {
    setLoading(true)
    const newImages = await Promise.all(acceptedFiles.map(async file => {
      const compressedFile =
        file.type === 'application/pdf' ? file : await compressImage(file)
      const url = URL.createObjectURL(compressedFile)
      const { path, type } = file
      const extension = getFileExtension(path)
      const res = await fetch(url)
      const blob = await res.blob()
      const newImage = window.URL.createObjectURL(blob)
      return {
        image: newImage,
        file,
        id: `${uuidv4()}.${extension}`,
        loaded: false,
        loading: false,
        error: false,
        type
      }
    }))
    setLoading(false)
    setImages(newImages)
  }, [compressImage, getFileExtension])

  const onDropRejected = useCallback(() => {
    setLoading(false)
    enqueueSnackbar({
      notification: {
        message: `Only PDF, PNG, JPG and JPEG of maximum 40 MB size files are supported at this time`,
        options: {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          autoHideDuration: 3000,
          ContentProps: {
            classes: {
              root: classes.stackbar
            }
          }
        }
      }
    })
  }, [enqueueSnackbar, classes])

  const setImagesUploading = useCallback(() => {
    const newImages = update(images, {
      $apply: b => {
        return b.map(item => ({
          ...item,
          loading: true,
          loaded: false,
          error: false
        }))
      }
    })
    setDisabled(true)
    setImages(newImages)
  }, [images])

  const setImagesUploaded = useCallback(() => {
    setDisabled(false)
    const newImages = update(images, {
      $apply: b => {
        return b.map(item => ({
          ...item,
          loading: false,
          loaded: true,
          error: false
        }))
      }
    })
    setImages(newImages)
  },[images])

  const uploadImageRequest = useCallback((url, image, type) => {
    return axios.put(url, image, {
      headers: {
        'Content-Type': type
      }
    })
  }, [])

  const handleUploadImages = useCallback(async () => {
    if (images.length === 0) throw new Error('no images')
    if (images.length === 0) return false
    setImagesUploading()
    const fileNames = images.map(image => image.id)
    const result = await getPresignedURLs({
      userId,
      type: 3,
      fileNames
    })

    return axios
      .all(
        images.map(async item => {
          const compress = item.file.type === "application/pdf" ? item.file :  await compressImage(item.file)
          uploadImageRequest(result[item.id].url, compress, item.type)
        })
      )
      .then(
        axios.spread(() => {
          setImagesUploaded()
          return images
        })
      )
      .catch(() => {
        throw new Error('error uploading')
      })
  }, [compressImage, images, setImagesUploaded, setImagesUploading, uploadImageRequest, userId])


  const handleImageDelete = useCallback((id: string) => {
    const newState = update(images, {
      $apply: b => {
        const index = b.findIndex(item => item.id === id)
        if (index > -1) {
          return update(b, {
            $splice: [[index, 1]]
          })
        }
        return b
      }
    })
    setImages(newState)
  }, [images])

  const [currentImage, setCurrentImage] = useState(null)
  const openImage = useCallback(idx => { setCurrentImage(idx) }, [])
  const handleImageClose = useCallback(() => setCurrentImage(null), [])
  const lightboxImages = useMemo(() => images.map(im => ({src: im.image})) ,[images])
  const next = useCallback(() => {
    setCurrentImage(currentImage === images.length ? currentImage: currentImage + 1)
  }, [currentImage, images])
  const prev = useCallback(() => {
    setCurrentImage(currentImage === 0 ? 0 : currentImage - 1)
  }, [currentImage])

  // eslint-disable-next-line
  ref.current = {
    handleUploadImages,
    images
  }

  return (
    <div>
      <Dropzone
        accept={['image/*', 'application/pdf']}
        multiple
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        disabled={disabled}
        maxSize={4 * 10000000}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={classes.dropZone}>
                <div className={classes.dropLabel} align="center">
                  { loading ?
                    <CircularProgress size={50} /> :
                    <Grid
                      container
                      alignItems='center'
                      justify='center'
                      spacing={2}
                      className={classes.uploadContainer}
                    >
                      <Grid item>
                        <AddIcon className={classes.addIcon} color='primary' />
                      </Grid>
                      <Grid item>
                        <Typography>
                          Drag files here to attach them or tap here to browse
                        </Typography>
                        <Typography>
                            (Currently support JPEG, JPG, PNG and PDFs)
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                </div>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      <Grid container className={classes.imagesContainer}>
        {images.map((im, idx) => (
          <Grid item key={im.image} className={classes.imageContainer}>
            <IconButton className={classes.iconButton} onClick={() => handleImageDelete(im.id)}>
              <CloseIcon className={classes.icon} />
            </IconButton>
            <ButtonBase onClick={() => openImage(idx)} className={classes.buttonImage}>
              <img alt='uploadimage' src={im.image} className={classes.image} />
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
      <Lightbox
        images={lightboxImages}
        currentImage={currentImage}
        isOpen={currentImage !== null}
        onClose={handleImageClose}
        onClickPrev={prev}
        onClickNext={next}
        backdropClosesModal
      />
    </div>

  )
})

export default WorkflowImageUpload
