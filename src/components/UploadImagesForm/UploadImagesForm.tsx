import React from "react";
import Dropzone from "react-dropzone";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import { Box } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import TransparentButton from "components/Basic/Buttons/TransparentButton";
import EditPhotoThumbnail from "../EditPhotoThumbnail/EditPhotoThumbnail";
import { styles } from "../_styles/UploadImagesForm";

const UploadImagesForm = ({
  classes,
  images,
  isDropzoneDisabled,
  onImageDelete,
  onImageSave,
  onDrop,
  loading,
  onDropRejected,
  onImageRetry,
  onSortEnd
}) => {
  const DragHandle = sortableHandle(({
    children
  }) => children);
  const SortableItem = sortableElement(({
    children
  }) => children);
  const SortableContainer = sortableContainer(({
    children
  }) => children);
  return <div className={classes.dropzoneWrapper}>
      <Dropzone accept={['image/*', 'application/pdf']} onDrop={onDrop} onDropRejected={onDropRejected} maxSize={4 * 10000000} disabled={isDropzoneDisabled}>
        {({
        getRootProps,
        getInputProps
      }) => <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={classes.dropZone}>
                <div className={classes.dropLabel} align="center">
                  {loading && <CircularProgress size={50} />}
                  {!loading && <>
                      <Box mr={2}>Drag and drop images here or</Box>
                      <TransparentButton onClick={() => {}}>Upload Notes</TransparentButton>
                    </>}
                </div>
              </div>
            </div>
          </section>}
      </Dropzone>
      <SortableContainer axis="xy" useDragHandle onSortEnd={onSortEnd}>
        <div className={classes.thumbnails}>
          {images.map((item, index) => <SortableItem key={item.id} index={index}>
              <div className={classes.dragContainer}>
                <EditPhotoThumbnail key={item.id} id={item.id} image={item.image} loaded={item.loaded} loading={item.loading} type={item.type} error={item.error} onSave={onImageSave} onDelete={onImageDelete} onImageRetry={onImageRetry} />
                <DragHandle>
                  <div className={classes.drag}>
                    <IconButton color="inherit" aria-label="Drag" className={classes.button}>
                      <DragIndicatorIcon className={classes.icon} fontSize="small" />
                    </IconButton>
                  </div>
                </DragHandle>
              </div>
            </SortableItem>)}
        </div>
      </SortableContainer>
    </div>;
};

export default withStyles(styles)(UploadImagesForm);