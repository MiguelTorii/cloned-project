import React from 'react';
import cx from 'classnames';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import FileUpload from 'components/FileUpload';
import { bytesToSize } from 'utils/chat';
import useStyles from '../_styles/FloatingChat/CommunityChatMessage';

const AnyFileUpload = ({
  message,
  renderHtmlWithImage,
  files,
  smallChat = false
}) => {
  const classes = useStyles();

  const renderMessage = (html, fileHtml) => (
    <div className={cx(classes.bodyWrapper)}>
      <Typography
        className={clsx(classes.body, 'ql-editor')}
        dangerouslySetInnerHTML={{
          __html: renderHtmlWithImage(message)
        }}
      />
      {fileHtml}
    </div>
  );

  const splitHtmlStringByFiles = message.split('File Attachment');

  if (splitHtmlStringByFiles.length > 1) {
    const files = JSON.parse(
      splitHtmlStringByFiles[splitHtmlStringByFiles.length - 1]
    );
    const fileHtml = files.map((file) => (
      <FileUpload
        name={file.name}
        size={file.size}
        url={file.url}
        smallChat={smallChat}
      />
    ));
    splitHtmlStringByFiles.splice(splitHtmlStringByFiles.length - 1, 1);
    const html = splitHtmlStringByFiles.reduce((acc, cur) => acc + cur, '');
    return renderMessage(html, fileHtml);
  }

  if (files?.length) {
    const fileHtml = files.map((file) => (
      <FileUpload
        name={file.fileName}
        size={bytesToSize(file.fileSize)}
        url={file.readUrl}
        smallChat={smallChat}
      />
    ));

    return renderMessage(message, fileHtml);
  }

  return (
    <div className={cx(classes.bodyWrapper)}>
      <Typography
        className={clsx(classes.body, 'ql-editor')}
        dangerouslySetInnerHTML={{ __html: renderHtmlWithImage(message) }}
      />
    </div>
  );
};

export default AnyFileUpload;
