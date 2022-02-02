/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomQuill from '../../components/CustomQuill/CustomQuill';
import AvatarEditor from '../../components/AvatarEditor/AvatarEditor';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { getPresignedURL } from '../../api/media';
import { uploadMedia } from '../../actions/user';
import { UPLOAD_MEDIA_TYPES } from '../../constants/app';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  root: {
    position: 'relative',
    maxWidth: 'inherit',
    maxHeight: 200
  },
  quill: {
    padding: theme.spacing(2),
    maxHeight: 200,
    '& .ql-editor': {
      minHeight: 70,
      maxHeight: 105
    }
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
  },
  headerClass: {
    height: 20,
    zIndex: 999999
  },
  dialog: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: theme.spacing(1.5)
  },
  divider: {
    backgroundColor: theme.circleIn.palette.dividerColor
  },
  contentClassName: {
    paddingRight: 0,
    paddingLeft: 0
  },
  cropContainer: {
    margin: theme.spacing(4, 0),
    position: 'relative',
    width: '100%',
    height: 200,
    background: '#333',
    [theme.breakpoints.up('sm')]: {
      height: 280
    }
  },
  options: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cropOptions: {
    width: 260,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  saveImage: {
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
    color: theme.circleIn.palette.primaryText1,
    borderRadius: 100,
    fontWeight: 'bold',
    width: '100%',
    margin: theme.spacing(3, 1, 5, 1)
  }
});

type Props = {
  classes?: Record<string, any>;
  user?: UserState;
  placeholder?: string;
  value?: string;
  onChange?: (...args: Array<any>) => any;
  fileType?: number;
  setEditor?: any;
  setLoadingImage?: ((...args: Array<any>) => any) | null | undefined;
  handleImage?: ((...args: Array<any>) => any) | null | undefined;
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
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const rte = useRef(null);
  const fileInput = useRef(null);
  const {
    isLoading,
    error,
    data: { userId }
  } = user;
  const handleImageInput = useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);
  const closeImageModal = useCallback(() => {
    setOpenImageModal(false);
  }, []);
  useEffect(() => {
    if (rte.current) {
      const { editor } = rte.current;

      if (setEditor) {
        setEditor(editor);
      }

      editor.getEditor().getModule('toolbar').addHandler('image', handleImageInput);
    }
  }, [handleImageInput, setEditor]);
  const readFile = useCallback(
    (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
      }),
    []
  );
  const handleSaveImage = useCallback(
    async (blob) => {
      setOpenImageModal(false);
      setLoading(true);

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
        await axios.put(url, blob, {
          headers: {
            'Content-Type': type
          }
        });

        if (handleImage) {
          handleImage(readUrl);
        } else {
          rte.current.editor.getEditor().insertEmbed(range.index, 'image', readUrl);
        }

        rte.current.editor.getEditor().enable(true);
      } catch (err) {
        if (rte.current && rte.current.editor) {
          rte.current.editor.getEditor().enable(true);
        }
      } finally {
        if (setLoadingImage) {
          setLoadingImage(false);
        }

        setLoading(false);
      }
    },
    [fileType, handleImage, setLoadingImage, userId]
  );
  const handleInputChange = useCallback(async () => {
    if (
      rte.current &&
      rte.current.editor &&
      fileInput.current &&
      fileInput.current.files.length > 0 &&
      fileInput.current.files[0].size < 8000000
    ) {
      setLoading(true);

      if (setLoadingImage) {
        setLoadingImage(true);
      }

      const file = fileInput.current.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      const range = rte.current.editor.getEditor().getSelection();
      const result = await uploadMedia(userId, UPLOAD_MEDIA_TYPES.POST_FEED, file);
      const { readUrl } = result;
      rte.current.editor.getEditor().insertEmbed(range.index, 'image', readUrl);
      setLoading(false);
    }
  }, [readFile, setLoadingImage, userId]);

  if (isLoading) {
    return <CircularProgress size={12} />;
  }

  if (userId === '' || error) {
    return 'Oops, there was an error loading your data, please try again.';
  }

  return (
    <>
      <ErrorBoundary>
        <div className={classes.root}>
          <div className={classes.quill} id="quill-editor">
            <CustomQuill placeholder={placeholder} value={value} onChange={onChange} ref={rte} />
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
      <ErrorBoundary>
        <AvatarEditor
          open={openImageModal}
          title={'Edit Image'}
          originalImage={imageSrc}
          onCancel={closeImageModal}
          onSave={handleSaveImage}
        />
      </ErrorBoundary>
    </>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(
  mapStateToProps,
  null
)(withStyles(styles as any)(RichTextEditor as any));
