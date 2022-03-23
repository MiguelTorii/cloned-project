import type { FC } from 'react';
import React, { useCallback } from 'react';

import parse from 'html-react-parser';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@material-ui/core';

import { ERROR_MODAL_TITLE } from 'constants/common';

import { closeErrorModal } from 'actions/dialog';
import { ReactComponent as ImageError } from 'assets/svg/error-modal.svg';

import Dialog from '../Dialog/Dialog';
import SemiBoldTypography from '../SemiBoldTypography/SemiBoldTypography';

import useStyles from './styles';

import type { AppState } from 'redux/store';
import type { TErrorModalData } from 'types/models';

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
        classes={{
          title: classes.title,
          closeIcon: classes.closeIcon,
          hr: classes.hr
        }}
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
              <Typography className={classes.errorTitle}>
                {Math.floor(errorData.code / 100)}
              </Typography>
              <Box className={classes.image}>
                <ImageError />
              </Box>
              <Typography className={classes.errorTitle}>{errorData.code % 10}</Typography>
            </Box>
            <SemiBoldTypography className={classes.errorText} align="center">
              {parse(errorData.text)}
            </SemiBoldTypography>
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default ErrorModal;
