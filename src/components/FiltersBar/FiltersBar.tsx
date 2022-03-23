import React from 'react';

import clsx from 'clsx';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';

import useStyles from './styles';

type Props = {
  data: Array<Record<string, any>>;
  activeValue: string;
  onSelectItem: (...args: Array<any>) => any;
};

const FiltersBar = ({ data, activeValue, onSelectItem }: Props) => {
  const classes: any = useStyles();
  return (
    <Breadcrumbs
      separator="|"
      classes={{
        separator: classes.separator
      }}
    >
      {data.map((item) => (
        <Chip
          clickable
          key={item.value}
          label={item.text}
          classes={{
            root: clsx(classes.item, item.value === activeValue && classes.itemActive)
          }}
          onClick={() => onSelectItem(item.value)}
        />
      ))}
    </Breadcrumbs>
  );
};

export default FiltersBar;
