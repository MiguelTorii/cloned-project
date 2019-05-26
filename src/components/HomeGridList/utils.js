/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
// @flow
import React from 'react';
import reactStringReplace from 'react-string-replace';
import type {HomeCardStyle} from '../../types/models';

export const renderText = (text: string, textStyles: Array<HomeCardStyle>) => {
  let result = text;
  for (const style of textStyles) {
    result = reactStringReplace(result, style.substring, match => (
      <span
        key={style.substring}
        style={{ color: style.textColor, fontWeight: style.weight }}
      >
        {match}
      </span>
    ));
  }
  return result;
};
