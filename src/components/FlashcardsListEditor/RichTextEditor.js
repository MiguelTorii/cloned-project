import React, { useCallback, useState } from 'react';
import ReactQuill from 'react-quill';
import { useDropzone } from 'react-dropzone';
import IconImage from '@material-ui/icons/ImageOutlined';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { UPLOAD_MEDIA_TYPES } from '../../constants/app';
import { uploadMedia } from '../../actions/user';
import useStyles from './styles';

const RichTextEditor = (
  {
    active,
    label,
    placeholder,
    value,
    imageUrl,
    containerId,
    readOnly,
    onChangeImageUrl,
    onFocus,
    onSetRef
  }: Props
) => {
  // Hooks
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    disabled: readOnly,
    onDropAccepted: (files) => {
      setIsUploadingImage(true);
      uploadMedia(me.userId, UPLOAD_MEDIA_TYPES.FLASHCARDS, files[0])
        .then(({ readUrl }) => {
          onChangeImageUrl(readUrl);
          setIsUploadingImage(false);
        })
    }
  });

  // Callbacks
  const removeStyleMatcher = useCallback((node, delta) => {
    delta.ops = delta.ops.map(op => {
      return {
        insert: op.insert
      };
    });
    return delta;
  }, []);

  // Event Handlers
  const handleFocus = useCallback(() => {
    if (!readOnly) {
      onFocus();
    }
  }, [onFocus, readOnly]);

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

    if (readOnly) return null;

    return <IconImage className={classes.imageIcon} />;
  };

  return (
    <div
      className={
        clsx(
          classes.textEditorContainer,
          active && 'active',
          readOnly && 'read-only'
        )
      }
      onMouseDown={handleFocus}
    >
      {!readOnly && (
        <div className={clsx(classes.editorLabel, active && 'active')}>
          { label }
        </div>
      )}
      <div className={classes.textEditor}>
        <ReactQuill
          ref={onSetRef}
          theme="snow"
          placeholder={readOnly ? '' : placeholder}
          modules={{
            toolbar: {
              container: `#${containerId}`
            },
            clipboard: {
              matchers: [
                [Node.ELEMENT_NODE, removeStyleMatcher]
              ]
            }
          }}
          defaultValue={value}
          readOnly={readOnly}
        />
      </div>
      <div className="container">
        <div {...getRootProps({ className: clsx(classes.imageDnd, readOnly && 'read-only') })}>
          <input {...getInputProps()} />
          { renderImage() }
        </div>
      </div>
    </div>
  );
};

RichTextEditor.propTypes = {
  label: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  active: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  imageUrl: PropTypes.string,
  onChangeImageUrl: PropTypes.func,
  onFocus: PropTypes.func,
  onSetRef: PropTypes.func
};

RichTextEditor.defaultProps = {
  active: false,
  placeholder: '',
  value: '',
  imageUrl: '',
  readOnly: false,
  onChangeImageUrl: () => {},
  onFocus: () => {},
  onSetRef: () => {}
};

export default RichTextEditor;
