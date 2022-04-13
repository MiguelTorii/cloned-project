/* eslint-disable jsx-a11y/accessible-emoji */
import { useCallback, useEffect } from 'react';

import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { useQuill } from 'react-quilljs';

import type { QuillOptionsStatic } from 'quill';

export const useChatQuill = (
  id: string,
  options: QuillOptionsStatic,
  onChange: (value: string) => void,
  onTyping?: () => void
) => {
  const { quill, quillRef, Quill } = useQuill(options);

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

  useEffect(() => {
    if (quill) {
      quill.focus();
    }
  }, [quill]);

  const onQuillChange = useCallback(() => {
    if (!quill) return;
    if (quill.getSelection(true)) {
      onChange((quill as any).container.firstChild.innerHTML);

      if ((quill as any).container.firstChild.innerHTML.length > quill.getSelection(true).index) {
        quill.setSelection(
          quill.getSelection(true).index + (quill as any).container.firstChild.innerHTML.length
        );
      }

      const currentFocusPosition = quill.getSelection(true).index;
      const leftPosition = quill.getBounds(currentFocusPosition).left;
      const currentTooltipWidth = document.getElementById(id)
        ? document.getElementById(id).clientWidth
        : 0;
      const currentEditorWidth = (quill as any).container.firstChild.clientWidth;

      if (currentEditorWidth - currentTooltipWidth < leftPosition + 80) {
        if (!(quill as any).container.firstChild.innerHTML.includes('<p>\n</p>')) {
          quill.insertText((quill as any).container.firstChild.innerHTML.length.index + 1, '\n');
        }
      }

      if (!(quill as any).container.firstChild.innerText.trim()) {
        quill.focus();
      }
    }

    onTyping?.();
  }, [id, onChange, onTyping, quill]);

  useEffect(() => {
    let editorChangeCallback: undefined | ((eventName: string) => void);
    if (quill) {
      quill.focus();
      const callback = (eventName) => {
        if (eventName === 'text-change') {
          onQuillChange();
        }
      };
      editorChangeCallback = callback;
      quill.on('editor-change', editorChangeCallback);
    }

    return () => {
      if (editorChangeCallback) {
        quill?.off('editor-change', editorChangeCallback);
      }
    };
  }, [onQuillChange, quill]);

  return { quill, quillRef, Quill };
};
