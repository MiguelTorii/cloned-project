import React, { useState, useCallback, useEffect } from "react";
import cx from "classnames";
import { Quill } from "react-quill";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EmojiSelector from "components/EmojiSelector/EmojiSelector";
import { ReactComponent as PaperClip } from "assets/svg/quill-paper.svg";
import useStyles from "./_styles/toolbar";
import { QUILL_TOOLBAR_SHORT_KEYS } from "../../constants/common";
const Link = Quill.import('formats/link');

Link.sanitize = function link(url) {
  if (!url.includes('http') || !url.includes('https')) {
    return `https://${url}`;
  }

  return url;
};

export const formats = ['bold', 'italic', 'underline', 'align', 'strike', 'list', 'bullet', 'indent', 'image', 'file'];
export const QuillToolbar = ({
  id,
  handleSelect,
  handleUploadFile
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // If the toolbar menu is open and the user clicks anywhere on the screen,
    // we should close the toolbar menu.
    const handleWindowClick = () => {
      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('click', handleWindowClick);
    };
  }, [open, windowWidth]);
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const renderCommonTools = () => <>
      <Tooltip title={QUILL_TOOLBAR_SHORT_KEYS.BOLD} aria-label="bold" arrow placement="top" classes={{
      tooltip: classes.tooltip,
      arrow: classes.tooltipArrow,
      popper: classes.popper
    }}>
        <button type="button" className="ql-bold" />
      </Tooltip>
      <Tooltip title={QUILL_TOOLBAR_SHORT_KEYS.ITALIC} aria-label="italic" arrow placement="top" classes={{
      tooltip: classes.tooltip,
      arrow: classes.tooltipArrow,
      popper: classes.popper
    }}>
        <button type="button" className="ql-italic" />
      </Tooltip>
      <Tooltip title={QUILL_TOOLBAR_SHORT_KEYS.UNDERLINE} aria-label="underline" arrow placement="top" classes={{
      tooltip: classes.tooltip,
      arrow: classes.tooltipArrow,
      popper: classes.popper
    }}>
        <button type="button" className="ql-underline" />
      </Tooltip>
      <Tooltip title="Upload File (max limit: 40 MB)" aria-label="file" arrow placement="top" classes={{
      tooltip: classes.tooltip,
      arrow: classes.tooltipArrow,
      popper: classes.uploadFilePopper
    }}>
        <button type="button" onClick={handleUploadFile}>
          <PaperClip />
        </button>
      </Tooltip>
      <Tooltip title={QUILL_TOOLBAR_SHORT_KEYS.EMOJI} aria-label="emoji" arrow placement="top" classes={{
      tooltip: classes.tooltip,
      arrow: classes.tooltipArrow,
      popper: classes.popper
    }}>
        <div className={cx('ql-emoji', classes.emoji)}>
          <EmojiSelector onSelect={handleSelect} emoIconStyle={classes.emoIconStyle} />
        </div>
      </Tooltip>
    </>;

  return <div id={id} className={classes.toolbar}>
      <span className="ql-formats">
        <div>
          <IconButton className={classes.moreHoriz} onClick={handleClick} aria-label="more" aria-controls="menu" aria-haspopup="true">
            <MoreHorizIcon />
          </IconButton>
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" className={cx(windowWidth < 815 ? classes.hide : classes.show)}>
          {renderCommonTools()}
        </Box>
      </span>
      <span className={cx('ql-formats', classes.subToolbar, open ? classes.show : classes.hide)}>
        <Box display="flex" justifyContent="center" alignItems="center" className={cx(windowWidth > 815 ? classes.hide : classes.show)}>
          {renderCommonTools()}
        </Box>
        <Tooltip title="Strike" aria-label="strike" arrow placement="top" classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
        popper: classes.popper
      }}>
          <button type="button" className="ql-strike" />
        </Tooltip>
        <Tooltip title="Numbered list" aria-label="numbered-list" arrow placement="top" classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
        popper: classes.popper
      }}>
          <button type="button" className="ql-list" value="ordered" />
        </Tooltip>
        <Tooltip title="Bulleted list" aria-label="bulleted-list" arrow placement="top" classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
        popper: classes.popper
      }}>
          <button type="button" className="ql-list" value="bullet" />
        </Tooltip>
        <Tooltip title="Clean" aria-label="clean" arrow placement="top" classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
        popper: classes.popper
      }}>
          <button type="button" className="ql-clean" />
        </Tooltip>
      </span>
    </div>;
};
export default QuillToolbar;