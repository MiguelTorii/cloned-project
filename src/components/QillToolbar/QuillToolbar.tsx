import React, { useCallback } from 'react';

import withRoot from 'withRoot';

import useStyles from './styles';

type Props = {
  elementId: string;
};

const QuillToolbar = ({ elementId }: Props) => {
  const classes: any = useStyles();
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);
  return (
    <div id={elementId} className={classes.root} onClick={handleClick}>
      <button type="button" className="ql-bold" />
      <button type="button" className="ql-italic" />
      <button type="button" className="ql-underline" />
      <button type="button" className="ql-strike" />
      <button type="button" className="ql-blockquote" />
      <button type="button" className="ql-list" value="ordered" />
      <button type="button" className="ql-list" value="bullet" />
      <button type="button" className="ql-indent" value="-1" />
      <button type="button" className="ql-indent" value="+1" />
      <button type="button" className="ql-clean" />
    </div>
  );
};

export default withRoot(QuillToolbar);
