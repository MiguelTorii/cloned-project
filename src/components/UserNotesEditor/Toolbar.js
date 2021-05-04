/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import cx from 'classnames'
import ReactDOMServer from 'react-dom/server';
import { Quill } from "react-quill";
import Tooltip from '@material-ui/core/Tooltip';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { useStyles } from '../_styles/UserNotesEditor';

const icons = Quill.import('ui/icons');
const fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = ['8px', '9px', '10px', '11px', '13px', '14px', '18px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'];
Quill.register(fontSizeStyle, true);

const Link = Quill.import('formats/link');
Link.sanitize = function link(url) {
  if (!url.includes('http') || !url.includes('https')) {
    return `https://${url}`
  }
  return url
}

const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
];
Quill.register(Font, true);

export const modules = {
  formula: true,
  clipboard: {
    matchVisual: false,
  },
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  },
};

export const formats = [
  "header",
  "font",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "formula",
  "link",
  "image",
  "color",
  "size",
  "code-block"
];

export const QuillToolbar = ({ hidden }) => {
  const classes = useStyles();
  icons.background = ReactDOMServer.renderToString(
    <div className={classes.highlighterContainer}>
      <BorderColorIcon className={classes.highlighter} />
    </div>
  );

  return (
    <div id="toolbar" className={cx(hidden && classes.hidden, classes.toolbar)}>
      <span className="ql-formats">
        <Tooltip
          title="Undo"
          aria-label="undo"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-undo">
            <CustomUndo />
          </button>
        </Tooltip>
        <Tooltip
          title="Redo"
          aria-label="redo"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-redo">
            <CustomRedo />
          </button>
        </Tooltip>
      </span>

      <span className="ql-formats">
        <Tooltip
          title="Font Styles"
          aria-label="Font styles"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <div>
            <select
              className="ql-header"
              defaultValue="3"
            >
              <option value="1">Heading</option>
              <option value="2">Subheading</option>
              <option value="3">Normal</option>
            </select>
          </div>
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
      </span>
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
      </span>
      <span className="ql-formats">
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
      </span>
      <span className="ql-formats">
        <Tooltip
          title="Align"
          aria-label="align"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <div>
            <select className="ql-align" />
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
          title="Highlight color"
          aria-label="highlight-color"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <div>
            <select className="ql-background" />
          </div>
        </Tooltip>
      </span>
      <span className="ql-formats">
        <Tooltip
          title="Superscript"
          aria-label="superscript"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-script" value="super" />
        </Tooltip>
        <Tooltip
          title="Subscript"
          aria-label="subscript"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-script" value="sub" />
        </Tooltip>
        <Tooltip
          title="Block quote"
          aria-label="block-quote"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-blockquote" />
        </Tooltip>
        <Tooltip
          title="Direction"
          aria-label="direction"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-direction" />
        </Tooltip>
      </span>
      <span className="ql-formats">
        <Tooltip
          title="Link"
          aria-label="Link"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-link" />
        </Tooltip>
      </span>
      <span className="ql-formats">
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
          title="Code Block"
          aria-label="code-block"
          arrow
          placement='top'
          classes={{
            tooltip: classes.tooltip,
            popper: classes.popper
          }}
        >
          <button type='button' className="ql-code-block" />
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
