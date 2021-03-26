import React, { useState, useCallback } from "react";
import cx from 'classnames'
import { Quill } from "react-quill";

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import EmojiSelector from 'components/EmojiSelector';

const Link = Quill.import('formats/link');
Link.sanitize = function link(url) {
  if (!url.includes('http') || !url.includes('https')) {
    return `https://${url}`
  }
  return url
}

const useStyles = makeStyles(() => ({
  toolbar: {
    textAlign: 'center',
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    '& .ql-formats': {
      marginRight: 0
    }
  },
  tooltip: {
    fontSize: 14,
  },
  popper: {
    zIndex: 1500
  },
  openSelectBox: {
    zIndex: 2000
  },
  firstline: {},
  secondline: {},
  hidden: { display: 'none' },
  highlighter: {
    height: 14,
    width: 14,
    '&:hover': {
      color: '#06c'
    }
  },
  highlighterContainer: {
    textAlign: 'center',
    paddingTop: 0.5
  },
  emoji: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emoIconStyle: {
    width: 20
  },
  moreHoriz: {
    display: 'flex !important'
  },
  subToolbar: {
    position: 'absolute',
    top: -35,
    right: 70,
    border: '1px solid',
    borderRadius: 5
  },
  show: {
    display: 'inline-flex'
  },
  hide: {
    display: 'none !important'
  }
}));

export const formats = [
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "list",
  "bullet",
  "indent",
  "image",
  "formula"
];

export const QuillToolbar = ({ id, handleSelect }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open]);

  return (
    <div id={id} className={classes.toolbar}>
      <span className="ql-formats">
        <div>
          <IconButton
            className={classes.moreHoriz}
            onClick={handleClick}
            aria-label="more"
            aria-controls="menu"
            aria-haspopup="true"
          >
            <MoreHorizIcon />
          </IconButton>
        </div>
        <Tooltip
          title="Bold (⌘B)"
          aria-label="bold"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-bold" />
        </Tooltip>
        <Tooltip
          title="Italic (⌘I)"
          aria-label="italic"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-italic" />
        </Tooltip>
        <Tooltip
          title="Underline (⌘U)"
          aria-label="underline"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-underline" />
        </Tooltip>
        <Tooltip
          title="Image (⌘P)"
          aria-label="image"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-image" />
        </Tooltip>
        <Tooltip
          title="Formula"
          aria-label="formula"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-formula" />
        </Tooltip>
        <Tooltip
          title="EmoJi (⌘J)"
          aria-label="emoji"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className={cx("ql-emoji", classes.emoji)}>
            <EmojiSelector onSelect={handleSelect} emoIconStyle={classes.emoIconStyle}/>
          </button>
        </Tooltip>
      </span>
      <span className={cx("ql-formats", classes.subToolbar, open ? classes.show : classes.hide)}>
        <Tooltip
          title="Strike"
          aria-label="strike"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-strike" />
        </Tooltip>
        <Tooltip
          title="Numbered list"
          aria-label="numbered-list"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-list" value="ordered" />
        </Tooltip>
        <Tooltip
          title="Bulleted list"
          aria-label="bulleted-list"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-list" value="bullet" />
        </Tooltip>
        <Tooltip
          title="Decrease indent"
          aria-label="decrease-indent"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-indent" value="-1" />
        </Tooltip>
        <Tooltip
          title="Increase indent"
          aria-label="increase-indent"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-indent" value="+1" />
        </Tooltip>
        <Tooltip
          title="Clean"
          aria-label="clean"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-clean" />
        </Tooltip>
      </span>
    </div>
  )
}

export default QuillToolbar;
