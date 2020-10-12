import React from "react";
import { Quill } from "react-quill";
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(() => ({
  toolbar: {},
  firstline: {},
  secondline: {}
}))

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

export const QuillToolbar = () => {
  const classes = useStyles()
  return (
    <div id="toolbar" className={classes.toolbar}>
      <div className={classes.firstline}>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="3">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="3">Normal</option>
          </select>
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
        </span>
        <span className="ql-formats">
          <button type='button' className="ql-bold" />
          <button type='button' className="ql-italic" />
          <button type='button' className="ql-underline" />
          <button type='button' className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button type='button' className="ql-list" value="ordered" />
          <button type='button' className="ql-list" value="bullet" />
          <button type='button' className="ql-indent" value="-1" />
          <button type='button' className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
      </div>
      <div className={classes.secondline}>
        <span className="ql-formats">
          <button type='button' className="ql-script" value="super" />
          <button type='button' className="ql-script" value="sub" />
          <button type='button' className="ql-blockquote" />
          <button type='button' className="ql-direction" />
        </span>
        <span className="ql-formats">
          <button type='button' className="ql-link" />
          <button type='button' className="ql-video" />
        </span>
        <span className="ql-formats">
          <button type='button' className="ql-formula" />
          <button type='button' className="ql-code-block" />
          <button type='button' className="ql-clean" />
        </span>
        <span className="ql-formats">
          <button type='button' className="ql-undo">
            <CustomUndo />
          </button>
          <button type='button' className="ql-redo">
            <CustomRedo />
          </button>
        </span>
      </div>
    </div>
  )
}

export default QuillToolbar;
