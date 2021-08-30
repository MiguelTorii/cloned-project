/* eslint-disable no-restricted-properties */
import React, { useState } from 'react';
import withWidth from '@material-ui/core/withWidth';
import axios from 'axios';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

import { fileContent } from 'constants/common';
import Icon3GPUrl from 'assets/svg/icons/3gp-icon.svg';
import IconAACUrl from 'assets/svg/icons/aac-icon.svg';
import IconAIFUrl from 'assets/svg/icons/aif-icon.svg';
import IconASFUrl from 'assets/svg/icons/asf-icon.svg';
import IconAVIUrl from 'assets/svg/icons/avi-icon.svg';
import IconCVSUrl from 'assets/svg/icons/cvs-icon.svg';
import IconDOCUrl from 'assets/svg/icons/doc-icon.svg';
import IconDOCXUrl from 'assets/svg/icons/docx-icon.svg';
import IconFLVUrl from 'assets/svg/icons/flv-icon.svg';
import IconHTMLUrl from 'assets/svg/icons/html-icon.svg';
import IconM4VUrl from 'assets/svg/icons/m4v-icon.svg';
import IconMOVUrl from 'assets/svg/icons/mov-icon.svg';
import IconMP3Url from 'assets/svg/icons/mp3-icon.svg';
import IconMP4Url from 'assets/svg/icons/mp4-icon.svg';
import IconODPUrl from 'assets/svg/icons/odp-icon.svg';
import IconODTUrl from 'assets/svg/icons/odt-icon.svg';
import IconOGGUrl from 'assets/svg/icons/ogg-icon.svg';
import IconOPSUrl from 'assets/svg/icons/ops-icon.svg';
import IconPDFUrl from 'assets/svg/icons/pdf-icon.svg';
import IconPPTUrl from 'assets/svg/icons/ppt-icon.svg';
import IconPPTXUrl from 'assets/svg/icons/pptx-icon.svg';
import IconRTFUrl from 'assets/svg/icons/rtf-icon.svg';
import IconTXTUrl from 'assets/svg/icons/txt-icon.svg';
import IconWAVUrl from 'assets/svg/icons/wav-icon.svg';
import IconWEBMUrl from 'assets/svg/icons/webm-icon.svg';
import IconWMVUrl from 'assets/svg/icons/wmv-icon.svg';
import IconXLSUrl from 'assets/svg/icons/xls-icon.svg';
import IconXLSXUrl from 'assets/svg/icons/xlsx-icon.svg';
import IconZIPUrl from 'assets/svg/icons/zip-icon.svg';
import IconBINARYUrl from 'assets/svg/icons/binary-default-icon.svg';
import IconCODEUrl from 'assets/svg/icons/code-default-icon.svg';
import IconOTHERUrl from 'assets/svg/icons/other-default-icon.svg';
import { ReactComponent as DownloadIcon } from 'assets/svg/download.svg';
import { truncate } from 'utils/helpers';
import styles from '../_styles/FileUpload';

const URIS = {
  '3gp': Icon3GPUrl,
  aac: IconAACUrl,
  aif: IconAIFUrl,
  asf: IconASFUrl,
  avi: IconAVIUrl,
  cvs: IconCVSUrl,
  doc: IconDOCUrl,
  docx: IconDOCXUrl,
  flv: IconFLVUrl,
  html: IconHTMLUrl,
  m4v: IconM4VUrl,
  mov: IconMOVUrl,
  mp3: IconMP3Url,
  mp4: IconMP4Url,
  odp: IconODPUrl,
  odt: IconODTUrl,
  ogg: IconOGGUrl,
  ops: IconOPSUrl,
  pdf: IconPDFUrl,
  ppt: IconPPTUrl,
  pptx: IconPPTXUrl,
  rtf: IconRTFUrl,
  txt: IconTXTUrl,
  wav: IconWAVUrl,
  webm: IconWEBMUrl,
  wmv: IconWMVUrl,
  xls: IconXLSUrl,
  xlsx: IconXLSXUrl,
  zip: IconZIPUrl,
  'binary-default': IconBINARYUrl,
  'code-default': IconCODEUrl,
  'other-default': IconOTHERUrl
};

const getIconURL = (extension) => {
  if (URIS[extension]) return URIS[extension];
  return URIS['other-default'];
};

const getFileContent = (extension) => {
  if (fileContent[extension]) return fileContent[extension];
  return fileContent['other-default'];
};

const getFileExtension = (filename) => filename.split('.').pop();

const FileUploadContainer = ({ classes, file, width, smallChat = false }) => {
  const [isDownload, setDownload] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const { name, size, url } = file;

  const extension = getFileExtension(name);
  const iconUrl = getIconURL(extension);

  const onMouseEnterHandler = () => {
    setDownload(true);
  };

  const onMouseLeaveHandler = () => {
    setDownload(false);
  };

  const downloadFile = async (filename) => {
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setPercentage(progress);
      }
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      setPercentage(0);
    });
  };

  return (
    <Tooltip
      title={name}
      placement="top"
      arrow
      classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
        popper: classes.titleTooltip
      }}
    >
      <div
        className={cx(smallChat ? classes.smallContainer : classes.container)}
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <div
          className={cx(smallChat ? classes.smallFileIcon : classes.fileIcon)}
        >
          <img src={iconUrl} alt={iconUrl} />
        </div>
        <div className={classes.infoContainer}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <div className={cx(smallChat ? classes.fileName : classes.name)}>
              {truncate(name, 22)}
            </div>
            {(width === 'xs' || smallChat) && isDownload && (
              <DownloadIcon
                onClick={() => downloadFile(name)}
                className={classes.downloadIcon}
              />
            )}
          </Box>
          {smallChat ||
            (width !== 'xs' && (
              <Box display="flex" alignItems="center">
                <Typography variant="body2" component="div">
                  {size} {getFileContent(extension)}
                </Typography>
                {isDownload && (
                  <DownloadIcon
                    onClick={() => downloadFile(name)}
                    className={classes.downloadIcon}
                  />
                )}
              </Box>
            ))}
          {percentage > 0 && (
            <div className={classes.progressBar}>
              <div
                className={classes.content}
                style={{ width: `${(percentage / 100) * 80}px` }}
              />
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default withStyles(styles)(withWidth()(FileUploadContainer));
