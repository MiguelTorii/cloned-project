// @flow
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import quillEmoji from 'quill-emoji';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import withStyles from '@material-ui/core/styles/withStyles';
import cx from 'classnames';
import './quill.custom.css';
import MathQuill from './Math'

import { styles } from '../_styles/CustomQuill';

const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;
Quill.register({
  'formats/emoji': EmojiBlot,
  'modules/emoji-shortname': ShortNameEmoji,
  'modules/emoji-toolbar': ToolbarEmoji,
  'modules/emoji-textarea': TextAreaEmoji
}, true);

const modules = {
  formula: true,
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['formula'],
    ['image'],
    ['link'],
    ['clean'],
    ['emoji'],
  ],
  keyboard: {
    bindings: {
      'tabToPost': {
        key: 13,
        shortKey: true,
        handler: function(range, context) {
          const postButtonEl = document.getElementById('post-submit-btn')

          if (postButtonEl) {
            postButtonEl.focus()
          }

          return false
        }
      }
    }
  },
  'emoji-toolbar': true,
  // 'emoji-textarea': true,
  'emoji-shortname': true,
};

type Props = {
  placeholder: string,
  value: string,
  readOnly: boolean,
  onChange: Function
};

class CustomQuill extends React.PureComponent<Props> {
  editor: ?Object;

  componentDidMount() {
    const enableMathQuillFormulaAuthoring = MathQuill();
    enableMathQuillFormulaAuthoring(this.editor.editor,{
      displayHistory: true,
      operators: [
        ["\\sqrt[n]{x}", "\\nthroot"],
        ["\\frac{x}{y}","\\frac"],
        ["{a}^{b}", "^"],
        // eslint-disable-next-line
     ["\\int", "\int"],
        ["n \\choose k","\\choose"]
      ]
    });
  }

  render() {
    const { classes, placeholder, value, onChange, readOnly } = this.props;

    return (
      <ReactQuill
        disabled
        className={cx(readOnly && classes.readOnly)}
        modules={modules}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={element => {
          this.editor = element;
        }}
      />
    );
  }
}

export default withStyles(styles)(CustomQuill);
