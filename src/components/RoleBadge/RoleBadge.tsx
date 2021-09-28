import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { ReactComponent as BadgeVector } from '../../assets/svg/badge_vector.svg';
import styles from '../_styles/RoleBadge';

type Props = {
  text?: any;
  classes?: any;
};

const RoleBadge = ({ text, classes }: Props) => (
  <Chip
    size="small"
    color="primary"
    icon={<BadgeVector />}
    label={text}
    classes={{
      root: text ? classes.root : classes.vectorBadgeRoot,
      label: !text && classes.label,
      labelSmall: classes.labelSmall,
      sizeSmall: classes.sizeSmall,
      colorPrimary: classes.userRoleColor,
      iconSmall: !text && classes.iconSmall
    }}
  />
);

export default withStyles(styles as any)(RoleBadge);
