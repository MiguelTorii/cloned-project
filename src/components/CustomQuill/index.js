// @flow
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.custom.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image'],
    ['clean']
  ]
};

type Props = {
  placeholder: string,
  value: string,
  onChange: Function
};

class CustomQuill extends React.PureComponent<Props> {
  editor: ?Object;

  render() {
    const { placeholder, value, onChange } = this.props;
    return (
      <ReactQuill
        disabled
        modules={modules}
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

export default CustomQuill;
