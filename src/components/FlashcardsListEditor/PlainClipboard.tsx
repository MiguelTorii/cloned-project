import ReactQuill from 'react-quill';

import { QuillModules, QuillSources } from 'constants/common';

const { Quill } = ReactQuill;
const Clipboard = Quill.import(QuillModules.clipboard);
const Delta = Quill.import(QuillModules.delta);

class PlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault();

    const range = this.quill.getSelection();
    const text = e.clipboardData.getData('text/plain');
    const delta = new Delta().retain(range.index).delete(range.length).insert(text);
    const index = text.length + range.index;
    const length = 0;

    this.quill.updateContents(delta, QuillSources.silent);
    this.quill.setSelection(index, length, QuillSources.silent);
    this.quill.scrollIntoView();
  }
}

export default PlainClipboard;
