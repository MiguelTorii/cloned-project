// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadImg from 'components/LoadImg';

const styles = (theme) => ({
  body: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: 50,
  },
  content: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    paddingBottom: 23,
    paddingTop: 26,
    maxWidth: 600,
    fontSize: 32,
    textAlign: 'center',
  },
});

type Props = {
  children: Object | Array<Object>,
  classes: Object,
  imageUrl: string,
  title: string
};

const EmptyState = ({ children, classes, imageUrl, title }: Props) => (
  <div className={classes.body}>
    <LoadImg url={imageUrl} style={{ width: '100%' }} />
    <div className={classes.title}>{title}</div>
    <div className={classes.content}>{children}</div>
  </div>
);

export default withStyles(styles)(EmptyState);