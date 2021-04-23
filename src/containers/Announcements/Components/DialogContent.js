import React from 'react';
import parse from 'html-react-parser';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 4, 4, 4)
  }
}));

type Props = {
  content: string
};

const DialogContent = ({ content }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { parse(content) }
    </div>
  );
};

export default DialogContent;
