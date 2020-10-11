import React from "react";
import { Quill } from "react-quill";

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
  "code-block"
];

export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      {/* <select className="ql-font" defaultValue="arial"> */}
      {/* <option value="arial">Arial</option> */}
      {/* <option value="comic-sans">Comic Sans</option> */}
      {/* <option value="courier-new">Courier New</option> */}
      {/* <option value="georgia">Georgia</option> */}
      {/* <option value="helvetica">Helvetica</option> */}
      {/* <option value="lucida">Lucida</option> */}
      {/* </select> */}
      <select className="ql-header" defaultValue="3">
        <option value="1">Heading</option>
        <option value="2">Subheading</option>
        <option value="3">Normal</option>
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
      <button type='button' className="ql-script" value="super" />
      <button type='button' className="ql-script" value="sub" />
      <button type='button' className="ql-blockquote" />
      <button type='button' className="ql-direction" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button type='button' className="ql-link" />
      {/* <button type='button' className="ql-image" /> */}
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
);

export default QuillToolbar;
