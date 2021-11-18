import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';
import parse from 'html-react-parser';
import { AppState } from '../../configureStore';
import { TErrorModalData } from '../../types/models';
import Dialog from '../Dialog/Dialog';
import { ReactComponent as Image400 } from '../../assets/svg/error-modal-400.svg';
import { ReactComponent as Image500 } from '../../assets/svg/error-modal-500.svg';
import { closeErrorModal } from '../../actions/dialog';
import { ERROR_MODAL_TITLE } from '../../constants/common';
import useStyles from './styles';

const getErrorImage = (errorCode: number) => {
  if (errorCode >= 400 && errorCode < 500) {
    return <Image400 />;
  }
  if (errorCode >= 500 && errorCode < 600) {
    return <Image500 />;
  }
  return null;
};

const ErrorModal: FC = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errorData = useSelector<AppState, TErrorModalData>((state) => state.dialog.errorModal);

  const handleCloseModal = useCallback(() => {
    dispatch(closeErrorModal());
  }, [dispatch]);

  return (
    <>
      {children}
      <Dialog
        className={classes.modal}
        open={!!errorData}
        title={errorData ? ERROR_MODAL_TITLE[errorData.code] : ''}
        onCancel={handleCloseModal}
      >
        {!!errorData && (
          <Box>
            {/* Need to display the error code with an image in the middle, which needs arithmetic operation. */}
            {/* e.g. Error code 404 will be shown as "4<image>4" */}
            <Box
              className={classes.container}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography className={classes.errorText}>
                {Math.floor(errorData.code / 100)}
              </Typography>
              <Box className={classes.image}>{getErrorImage(errorData.code)}</Box>
              <Typography className={classes.errorText}>{errorData.code % 10}</Typography>
            </Box>
            <Typography>{parse(errorData.text)}</Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default ErrorModal;
