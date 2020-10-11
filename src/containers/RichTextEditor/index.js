// @flow

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { getPresignedURL } from '../../api/media';
import CustomQuill from '../../components/CustomQuill';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    position: 'relative',
    maxWidth: 'inherit',
    maxHeight: 200
  },
  quill: {
    padding: theme.spacing(2),
    maxHeight: 200
  },
  input: {
    display: 'none'
  },
  loader: {
    position: 'absolute',
    zIndex: 1200,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  placeholder: string,
  value: string,
  onChange: Function,
  fileType: number,
  setLoadingImage: ?Function,
  handleImage: ?Function
};

const RichTextEditor = ({
  classes,
  user,
  placeholder,
  value,
  onChange,
  fileType,
  setLoadingImage,
  handleImage,
  setEditor
}: Props) => {
  const [loading, setLoading] = useState(false)
  const rte = useRef(null)
  const fileInput = useRef(null)

  const {
    isLoading,
    error,
    data: { userId }
  } = user

  const handleImageInput = useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);

  useEffect(() => {
    if (rte.current) {
      const { editor } = rte.current
      if (setEditor) setEditor(editor)
      editor
        .getEditor()
        .getModule('toolbar')
        .addHandler('image', handleImageInput);
    }
  }, [handleImageInput, setEditor])

  const handleInputChange = useCallback(async () => {
    if (
      rte.current &&
      rte.current.editor &&
      fileInput.current &&
      fileInput.current.files.length > 0 &&
      fileInput.current.files[0].size < 8000000
    ) {
      if (setLoadingImage) setLoadingImage(true)
      setLoading(true)
      try {
        const file = fileInput.current.files[0];
        const range = rte.current.editor.getEditor().getSelection();
        rte.current.editor.getEditor().enable(false);
        const { type } = file;
        const result = await getPresignedURL({
          userId,
          type: fileType || 1,
          mediaType: type
        });

        const { readUrl, url } = result;

        await axios.put(url, file, {
          headers: {
            'Content-Type': type
          }
        });

        if (handleImage) handleImage(readUrl)

        else rte.current.editor.getEditor().insertEmbed(range.index, 'image', readUrl);

        rte.current.editor.getEditor().enable(true);
      } catch (err) {
        if (rte.current && rte.current.editor)
          rte.current.editor.getEditor().enable(true);
      } finally {
        if (setLoadingImage) setLoadingImage(false)
        setLoading(false)
      }
    }
  }, [fileType, handleImage, userId, setLoadingImage]);

  if (isLoading) return <CircularProgress size={12} />;
  if (userId === '' || error)
    return 'Oops, there was an error loading your data, please try again.';

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <div className={classes.quill}>
          <CustomQuill
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            ref={rte}
          />
        </div>
        <input
          accept="image/*"
          className={classes.input}
          ref={fileInput}
          onChange={handleInputChange}
          type="file"
        />
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(RichTextEditor));
