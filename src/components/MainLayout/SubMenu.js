// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import queryString from 'query-string';
import Tooltip from '../../containers/Tooltip';
import { useStyles } from '../_styles/MainLayout/SubMenu';

type Props = {
  MyLink: Function,
  openClassmatesDialog: Function
};

const SubItems = ({ MyLink, openClassmatesDialog, createPostOpen }: Props) => {
  const classes = useStyles();

  const { pathname, search } = window.location;
  const qs = queryString.parse(search);

  return (
    <div>
      <ListItem
        button
        component={MyLink}
        link={`/my_posts?${queryString.stringify({ ...qs, from: 'me' })}`}
        className={classNames(
          classes.item,
          ['/my_posts'].includes(pathname) && qs.from === 'me'
            ? classes.currentPath
            : classes.otherPath
        )}
      >
        <ListItemText
          primary="My Posts"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
      <ListItem
        button
        component={MyLink}
        link={`/bookmarks?${queryString.stringify({
          ...qs,
          from: 'bookmarks'
        })}`}
        className={classNames(
          classes.item,
          ['/bookmarks'].includes(pathname) && qs.from === 'bookmarks'
            ? classes.currentPath
            : classes.otherPath
        )}
      >
        <ListItemText
          primary="Bookmarks"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
      <ListItem
        button
        component={MyLink}
        link={{
          pathname: `/leaderboard`,
          search: `?class=${qs.class}`
        }}
        className={classNames(
          classes.item,
          ['/leaderboard'].includes(pathname)
            ? classes.currentPath
            : classes.otherPath
        )}
      >
        <Tooltip
          hidden={createPostOpen}
          id={6938}
          placement="left"
          text="See the scores of all your classmates towards scholarships and gifts."
        >
          <ListItemText
            primary="Class Leaderboard"
            classes={{
              primary: classes.label
            }}
          />
        </Tooltip>
      </ListItem>
      <ListItem
        button
        onClick={openClassmatesDialog}
        className={classNames(classes.item)}
      >
        <ListItemText
          primary="Classmates"
          classes={{
            primary: classes.label
          }}
        />
      </ListItem>
    </div>
  );
};

export default SubItems;
