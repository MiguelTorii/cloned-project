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
import withRoot from '../../withRoot';

const RichTextEditor = (
  {
    label,
    placeholder,
    value,
    imageUrl,
    containerId,
    readOnly,
    onChangeValue,
    onChangeImageUrl,
    onFocus
  }: Props
) => {
  // Hooks
  const classes = useStyles();
  const me = useSelector((state) => state.user.data);
  const [isActive, setIsActive] = useState(false);
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
      setIsActive(true);
      onFocus();
    }
  }, [setIsActive, onFocus, readOnly]);

  const handleBlur = useCallback(() => {
    if (!readOnly) setIsActive(false);
  }, [setIsActive, readOnly]);

  const handleChangeValue = (newValue) => {
    if (newValue !== value) {
      onChangeValue(newValue);
    }
  };

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
          isActive && 'active',
          readOnly && 'read-only'
        )
      }
      onMouseDown={handleFocus}
    >
      {!readOnly && (
        <div className={clsx(classes.editorLabel, isActive && 'active')}>
          { label }
        </div>
      )}
      <div className={classes.textEditor}>
        <ReactQuill
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
          value={value}
          readOnly={readOnly}
          onChange={handleChangeValue}
          onBlur={handleBlur}
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
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  imageUrl: PropTypes.string,
  onChangeValue: PropTypes.func,
  onChangeImageUrl: PropTypes.func,
  onFocus: PropTypes.func
};

RichTextEditor.defaultProps = {
  placeholder: '',
  value: '',
  imageUrl: '',
  readOnly: false,
  onChangeValue: () => {},
  onChangeImageUrl: () => {},
  onFocus: () => {}
};

export default withRoot(RichTextEditor);
