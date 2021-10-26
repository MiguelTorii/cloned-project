import React, { useCallback, FC, ReactElement, useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '../components/Dialog/Dialog';

type TDeleteCallbackMethod = () => void;
type TElement = ReactElement | string;

type TOpenMethod = (
  title: TElement,
  content: TElement,
  onConfirmDelete: TDeleteCallbackMethod
) => void;

interface IDeleteModalContext {
  open: TOpenMethod;
}

const defaultState = {
  open: () => {}
};

export const DeleteModalContext = React.createContext<IDeleteModalContext>(defaultState);

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxWidth: 500
  },
  contentText: {
    fontSize: 18
  },
  okButton: {
    color: 'white',
    '&, &:hover': {
      backgroundColor: theme.circleIn.palette.removeColor
    },
    borderRadius: 20
  },
  cancelButton: {
    color: 'white'
  }
}));

export const DeleteModalContextProvider: FC = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState({
    title: null,
    content: null,
    callback: null
  });

  const handleOpenDeleteModal: TOpenMethod = useCallback((title, content, onConfirmDelete) => {
    setData({
      title,
      content,
      callback: onConfirmDelete
    });
    setOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setOpen(false);
    if (data.callback) {
      data.callback();
    }
  }, [data]);

  const handleCloseDeleteModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <DeleteModalContext.Provider value={{ open: handleOpenDeleteModal }}>
      {children}
      <Dialog
        className={classes.dialog}
        classes={{
          okButton: classes.okButton,
          cancelButton: classes.cancelButton
        }}
        open={open}
        onCancel={handleCloseDeleteModal}
        title={data.title}
        onOk={handleConfirmDelete}
        okTitle="Yes, delete"
        showActions
        showCancel
      >
        {typeof data.content === 'string' ? (
          <Typography className={classes.contentText}>{data.content}</Typography>
        ) : (
          data.content
        )}
      </Dialog>
    </DeleteModalContext.Provider>
  );
};

export const useDeleteModal = () => React.useContext(DeleteModalContext);
