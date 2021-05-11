import React, { useCallback, useState } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import ReactQuill from 'react-quill';
import { useDropzone } from 'react-dropzone';
import IconImage from '@material-ui/icons/ImageOutlined';
import clsx from 'clsx';
import { uploadMedia } from '../../actions/user';
import { useSelector } from 'react-redux';
import { UPLOAD_MEDIA_TYPES } from '../../constants/app';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  label: string,
  placeholder: string,
  value: string,
  imageUrl: string,
  onChangeValue: Function,
  onChangeImageUrl: Function,
  containerId: string,
  onFocus: Function
};

const RichTextEditor = (
  {
    label,
    placeholder,
    value,
    imageUrl,
    onChangeValue = () => {},
    onChangeImageUrl = () => {},
    containerId,
    onFocus = () => {}
  }: Props
) => {
  // Hooks
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.png,.jpg',
    onDropAccepted: (files) => {
      setIsUploadingImage(true);
      uploadMedia(me.userId, UPLOAD_MEDIA_TYPES.FLASHCARDS, files[0])
        .then(({ readUrl }) => {
          onChangeImageUrl(readUrl);
          setIsUploadingImage(false);
        })
    }
  });

  // States
  const [isActive, setIsActive] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Event Handlers
  const handleFocus = useCallback(() => {
    setIsActive(true);
    onFocus();
  }, [setIsActive, onFocus]);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, [setIsActive]);

  const handleChangeValue = useCallback((newValue) => {
    if (newValue !== value) {
      onChangeValue(newValue);
    }
  }, [value, onChangeValue]);

  // Rendering Helpers
  const renderImage = () => {
    if (isUploadingImage) {
      return <CircularProgress size={20} />;
    }

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Flashcards"
          className={classes.thumbnail}
        />
      )
    }

    return <IconImage />;
  };

  return (
    <div className={clsx(classes.textEditorContainer, isActive && 'active')}>
      <div className={clsx(classes.editorLabel, isActive && 'active')}>
        { label }
      </div>
      <div className={classes.textEditor}>
        <ReactQuill
          theme="snow"
          defaultValue={value || ''}
          placeholder={placeholder}
          modules={{
            toolbar: {
              container: `#${containerId}`
            }
          }}
          onChange={handleChangeValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <div className="container">
        <div {...getRootProps({ className: classes.imageDnd })}>
          <input {...getInputProps()} />
          { renderImage() }
        </div>
      </div>
    </div>
  );
};

export default withRoot(RichTextEditor);
