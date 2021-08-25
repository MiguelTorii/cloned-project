import React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import cx from 'classnames';

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
import { ReactComponent as CancelIcon } from 'assets/svg/file-upload-cancel.svg';

import { styles } from '../_styles/FileUpload';

const URLs = {
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
const getIconURL = (extension) => {};

const FileUploadContainer = (props) => {
  const { classes, file, onCancel } = props;
  const { type, name, url } = file;

  return (
    <div className={classes.container}>
      <div className={classes.fileIcon}>
        <img src={Icon3GPUrl} alt="3GP Icon" />
      </div>
      <div className={classes.infoContainer}>
        <div className={classes.name}>{name}</div>
        {/* {info && <div className={classes.info}>{info}</div>} */}

        {/* {progress > 0 && (
          <div className={classes.progressBar}>
            <div
              className={classes.content}
              style={{ width: `${(progress / 100) * 80}px` }}
            />
          </div>
        )} */}
      </div>

      {onCancel && (
        <div className={classes.cancelIcon} onClick={onCancel}>
          <CancelIcon />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(FileUploadContainer);
