// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadImg from 'components/LoadImg';

import { styles } from '../_styles/FeedList/EmptyState';

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
