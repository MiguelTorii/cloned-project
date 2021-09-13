import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import useStyles from './styles';

type Props = {
  data: Array<Object>,
  activeValue: string,
  onSelectItem: Function
};

const FiltersBar = ({ data, activeValue, onSelectItem }: Props) => {
  const classes = useStyles();

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
            root: clsx(
              classes.item,
              item.value === activeValue && classes.itemActive
            )
          }}
          onClick={() => onSelectItem(item.value)}
        />
      ))}
    </Breadcrumbs>
  );
};

export default FiltersBar;
