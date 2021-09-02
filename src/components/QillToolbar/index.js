import React, { useCallback } from 'react';
import useStyles from './styles';
import withRoot from '../../withRoot';

type Props = {
  elementId: string
};

const QuillToolbar = ({ elementId }: Props) => {
  const classes = useStyles();

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  return (
    <div id={elementId} className={classes.root} onClick={handleClick}>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-blockquote" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
      <button className="ql-clean" />
    </div>
  );
};

export default withRoot(QuillToolbar);
