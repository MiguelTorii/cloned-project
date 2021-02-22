// @flow

import React , { memo }from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import ViewListIcon from '@material-ui/icons/ViewList';
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';

type Props = {
  newClassExperience: boolean,
  MyLink: Function
};

const HomeItem = ({
  MyLink,
  newClassExperience,
}: Props) => {

  const classes = makeStyles(theme => ({
    item: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      paddingTop: 0,
      paddingBottom: 0,
      margin: theme.spacing(1, 2, 1, 2),
      '&:hover': {
        background: theme.circleIn.palette.hoverMenu
      },
    },
    currentPath: {
      '& span': {
        fontWeight: 'bold',
      },
      background: theme.circleIn.palette.hoverMenu,
    },
    otherPath: {
      '&:hover': {
        background: theme.circleIn.palette.hoverMenu
      },
    },
    classes: {
      fontSize: 14,
      paddingTop: 0,
      paddingBottom: 0,
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      textAlign: 'center'
    },
    typo: {
      // textOverflow: 'ellipsis',
      textAlign: 'left',
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: 'pre-wrap',
      overflow: 'hidden',
      marginLeft: theme.spacing(2),
    }
  }))()

  return (
    <div
      className="tour-onboarding-study"
    >
      <ListItem
        button
        component={MyLink}
        link='/feed'
        className={classNames(
          classes.item,
          ['/feed', '/my_posts', '/bookmarks'].includes(window.location.pathname) ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemIcon>
          {newClassExperience ? <GradCapIcon className={classNames("whiteSvg")} /> : <ViewListIcon />}
        </ListItemIcon>
        <ListItemText
          primary='Class Feeds'
        />
      </ListItem>
    </div>
  )
}

export default memo(HomeItem)
