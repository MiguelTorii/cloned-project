import React from "react";
import cx from "classnames";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import FileUpload from "components/FileUpload/FileUploadContainer";
import { bytesToSize } from "utils/chat";
import useStyles from "../_styles/FloatingChat/CommunityChatMessage";

const AnyFileUpload = ({
  message,
  renderHtmlWithImage,
  files,
  onImageClick,
  onImageLoaded,
  smallChat = false
}) => {
  const classes = useStyles();

  const renderMessage = (html, fileHtml) => <div className={cx(classes.bodyWrapper)}>
      <Typography className={clsx(classes.body, 'ql-editor')} dangerouslySetInnerHTML={{
      __html: renderHtmlWithImage(message)
    }} />
      {fileHtml}
    </div>;

  if (files?.length) {
    const fileHtml = files.map((file, index) => {
      const {
        readUrl,
        fileName,
        fileType
      } = file;

      if (fileType && fileType.includes('image')) {
        return <div className={classes.bodyWrapper} key={readUrl}>
            <ButtonBase onClick={() => onImageClick(readUrl)}>
              <img className={classes.image} src={readUrl} alt="chat" onLoad={onImageLoaded} />
            </ButtonBase>
          </div>;
      }

      return <FileUpload key={readUrl} name={fileName} size={bytesToSize(file.fileSize)} url={readUrl} smallChat={smallChat} />;
    });
    return renderMessage(message, fileHtml);
  }

  return <div className={cx(classes.bodyWrapper)}>
      <Typography className={clsx(classes.body, 'ql-editor')} dangerouslySetInnerHTML={{
      __html: renderHtmlWithImage(message)
    }} />
    </div>;
};

export default AnyFileUpload;