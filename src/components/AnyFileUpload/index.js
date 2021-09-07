import React from 'react';
import cx from 'classnames';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import FileUpload from 'components/FileUpload';
import useStyles from '../_styles/FloatingChat/CommunityChatMessage';

const AnyFileUpload = ({
  message,
  renderHtmlWithImage,
  files,
  smallChat = false
}) => {
  const classes = useStyles();

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

    return (
      <div className={cx(classes.bodyWrapper)}>
        <Typography
          className={clsx(classes.body, 'ql-editor')}
          dangerouslySetInnerHTML={{
            __html: renderHtmlWithImage(html)
          }}
        />
        {fileHtml}
      </div>
    );
  }

  if (files?.length) {
    const fileHtml = files.map((file) => (
      <FileUpload
        name={file.fileName}
        size={file.fileSize}
        url={file.readUrl}
        smallChat={smallChat}
      />
    ));

    return (
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
