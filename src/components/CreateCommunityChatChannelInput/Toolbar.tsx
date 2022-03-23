import React, { useState, useCallback, useEffect } from 'react';

import cx from 'classnames';
import { Quill } from 'react-quill';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { QUILL_TOOLBAR_SHORT_KEYS } from 'constants/common';

import useStyles from '../_styles/CreateCommunityChatChannelInput/toolbar';
import EmojiSelector from '../EmojiSelector/EmojiSelector';

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
  'image'
];
export const QuillToolbar = ({ id, handleSelect }) => {
  const classes: any = useStyles();
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [windowWidth]);
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={cx(windowWidth < 815 ? classes.hide : classes.show)}
        >
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
            title={QUILL_TOOLBAR_SHORT_KEYS.EMOJI}
            aria-label="emoji"
            arrow
            placement="top"
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
          >
            <EmojiSelector onSelect={handleSelect} emoIconStyle={classes.emoIconStyle} />
          </Tooltip>
        </Box>
      </span>
      <span className={cx('ql-formats', classes.subToolbar, open ? classes.show : classes.hide)}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          className={cx(windowWidth > 815 ? classes.hide : classes.show)}
        >
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
            title={QUILL_TOOLBAR_SHORT_KEYS.EMOJI}
            aria-label="emoji"
            arrow
            placement="top"
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
          >
            <EmojiSelector onSelect={handleSelect} emoIconStyle={classes.emoIconStyle} />
          </Tooltip>
        </Box>
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
