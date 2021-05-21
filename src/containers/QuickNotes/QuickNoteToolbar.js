/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import cx from 'classnames'
import ReactDOMServer from 'react-dom/server';
import { Quill } from "react-quill";
import EmojiSelector from 'components/EmojiSelector';
import Tooltip from '@material-ui/core/Tooltip';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import useStyles from './_styles/toolbar';

const icons = Quill.import('ui/icons');
const fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ['8px', '9px', '10px', '11px', '13px', '14px', '18px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'];
Quill.register(fontSizeStyle, true);

export const modules = {
  formula: true,
  clipboard: {
    matchVisual: false,
  },
  toolbar: {
    container: "#toolbar",
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  },
};

export const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "size",
  "color",
  "list",
  "bullet",
  "indent",
];

export const QuillToolbar = ({ open, insertEmoji }) => {
  const classes = useStyles();

  icons.background = ReactDOMServer.renderToString(
    <div className={classes.highlighterContainer}>
      <BorderColorIcon className={classes.highlighter} />
    </div>
  );

  return (
    <div className={cx(open ? classes.show : classes.hide)}>
      <div
        id="toolbar"
        className={cx(
          classes.toolbar
        )}
      >
        <span className="ql-formats">
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
            title="Font size"
            aria-label="font-size"
            arrow
            placement='top'
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
          >
            <div>
              <select className="ql-size">
                <option value='8px'>8</option>
                <option value="9px">9</option>
                <option value="10px">10</option>
                <option value="11px">11</option>
                <option value="13px" defaultValue>13</option>
                <option value="14px">14</option>
                <option value="18px">18</option>
                <option value="24px">24</option>
                <option value="30px">30</option>
                <option value="36px">36</option>
                <option value="48px">48</option>
                <option value="60px">60</option>
                <option value="72px">72</option>
                <option value="96px">96</option>
              </select>
            </div>
          </Tooltip>
          <Tooltip
            title="Text color"
            aria-label="text-color"
            arrow
            placement='top'
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
          >
            <div>
              <select className="ql-color" />
            </div>
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
            title="EmoJi (⌘J)"
            aria-label="emoji"
            arrow
            placement='top'
            classes={{
              tooltip: classes.tooltip,
              popper: classes.popper
            }}
          >
            <div className={cx("ql-emoji", classes.emoji)}>
              <EmojiSelector onSelect={insertEmoji} emoIconStyle={classes.emoIconStyle}/>
            </div>
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
    </div>
  )
}

export default QuillToolbar;
