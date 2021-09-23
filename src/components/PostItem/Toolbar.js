import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Quill } from 'react-quill';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import EmojiSelector from 'components/EmojiSelector/EmojiSelector';
import { useStyles } from '../_styles/PostItem/Toolbar';
import { QUILL_TOOLBAR_SHORT_KEYS } from '../../constants/common';

const Link = Quill.import('formats/link');
Link.sanitize = function link(url) {
  if (!url.includes('http') || !url.includes('https')) {
    return `https://${url}`;
  }
  return url;
};

export const formats = [
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'list',
  'bullet',
  'indent',
  'image',
  'formula'
];

export const QuillToolbar = ({ id, handleSelect }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(!open);
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
          title={QUILL_TOOLBAR_SHORT_KEYS.BOLD}
          aria-label="bold"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-bold" />
        </Tooltip>
        <Tooltip
          title={QUILL_TOOLBAR_SHORT_KEYS.ITALIC}
          aria-label="italic"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-italic" />
        </Tooltip>
        <Tooltip
          title={QUILL_TOOLBAR_SHORT_KEYS.UNDERLINE}
          aria-label="underline"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-underline" />
        </Tooltip>
        <Tooltip
          title={QUILL_TOOLBAR_SHORT_KEYS.IMAGE}
          aria-label="image"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-image" />
        </Tooltip>
        <Tooltip
          title="Formula"
          aria-label="formula"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-formula" />
        </Tooltip>
        <Tooltip
          title={QUILL_TOOLBAR_SHORT_KEYS.EMOJI}
          aria-label="emoji"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <div className={cx('ql-emoji', classes.emoji)}>
            <EmojiSelector onSelect={handleSelect} emoIconStyle={classes.emoIconStyle} />
          </div>
        </Tooltip>
      </span>
      <span className={cx('ql-formats', classes.subToolbar, open ? classes.show : classes.hide)}>
        <Tooltip
          title="Strike"
          aria-label="strike"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-strike" />
        </Tooltip>
        <Tooltip
          title="Numbered list"
          aria-label="numbered-list"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-list" value="ordered" />
        </Tooltip>
        <Tooltip
          title="Bulleted list"
          aria-label="bulleted-list"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-list" value="bullet" />
        </Tooltip>
        <Tooltip
          title="Decrease indent"
          aria-label="decrease-indent"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-indent" value="-1" />
        </Tooltip>
        <Tooltip
          title="Increase indent"
          aria-label="increase-indent"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-indent" value="+1" />
        </Tooltip>
        <Tooltip
          title="Clean"
          aria-label="clean"
          arrow
          placement="top"
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type="button" className="ql-clean" />
        </Tooltip>
      </span>
    </div>
  );
};

export default QuillToolbar;
