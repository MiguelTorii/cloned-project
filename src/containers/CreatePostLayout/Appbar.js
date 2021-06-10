import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import withStyles from '@material-ui/core/styles/withStyles'
import { animations } from 'react-animation'
import clsx from 'clsx'

import { ReactComponent as DeactiveCreatePost } from 'assets/svg/inactive_create_post.svg'
import { ReactComponent as DeactiveCreateQuestion } from 'assets/svg/inactive_create_question.svg'
import { ReactComponent as DeactiveCreateNote } from 'assets/svg/inactive_create_note.svg'
import { ReactComponent as DeactiveCreateShare } from 'assets/svg/inactive_create_share.svg'

import { ReactComponent as ActiveCreatePost } from 'assets/svg/active_create_post.svg'
import { ReactComponent as ActiveCreateQuestion } from 'assets/svg/smile-green.svg'
import { ReactComponent as ActiveCreateNote } from 'assets/svg/active_create_note.svg'
import { ReactComponent as ActiveCreateShare } from 'assets/svg/active_create_share.svg'

const styles = theme => ({
  appBar: {
    backgroundColor: theme.circleIn.palette.formBackground,
    borderRadius: theme.spacing(1),
    boxShadow: 'none'
  },
  hoverPost: {
    borderRadius: theme.spacing(1.25, 0, 0, 0),
  },
  hoverQuestion: {
    borderRadius: theme.spacing(0, 0, 0, 0),
  },
  hoverNotes: {
    borderRadius: theme.spacing(0, 0, 0, 0),
  },
  hoverResource: {
    borderRadius: theme.spacing(0, 1.25, 0, 0),
  },
  hover: {
    background: 'linear-gradient(180deg, #383838 0%, #383838 49.48%, #222222 100%), #3A3B3B'
  },
  tabsContainer: {
    borderBottom: `1px solid ${theme.circleIn.palette.modalBackground}`,
    height: 92,
  },
  tabLabel: {
    borderRight: `1px solid ${theme.circleIn.palette.modalBackground}`,
    borderLeft: `1px solid ${theme.circleIn.palette.modalBackground}`,
  },
  tabLabelRight: {
    borderRight: `1px solid ${theme.circleIn.palette.modalBackground}`,
  },
  tabWapper: {
    display: 'contents',
    color: theme.circleIn.palette.inactiveColor,
    fontSize: 16,
    fontWeight: 'bold',
    "&>:first-child": {
      marginBottom: '0px !important',
      marginRight: theme.spacing(0.5)
    },
    textTransform: 'none',
  },
  selectedPost: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: `5px solid ${theme.circleIn.palette.brand}`,
  },
  selectedQuestion: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: `5px solid ${theme.circleIn.palette.success}`,
  },
  selectedNote: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: `5px solid ${theme.circleIn.palette.notesTabBorder}`,
  },
  selectedResource: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: `5px solid ${theme.circleIn.palette.resourceTabBorder}`,
  },
  mr1: {
    marginRight: `${theme.spacing(1)}px !important`
  },
})

const AppbarComponent = ({
  classes,
  value,
  handleChange,
}) => {
  const [hoverIdx, setHoverIdx] = useState(null)

  return (
    <AppBar position="static" className={classes.appBar}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-label="icon label tabs"
        classes={{
          flexContainer: classes.tabsContainer
        }}
      >
        <Tab
          classes={{
            wrapper: classes.tabWapper,
            selected: classes.selectedPost
          }}
          icon={
            value === 0 || hoverIdx === 0
              ? <ActiveCreatePost />
              : <DeactiveCreatePost className={classes.mr1} />
          }
          label="Write a Post"
          style={{ animation: animations.fadeIn }}
          className={clsx(
            hoverIdx === 0 && [classes.hoverPost, classes.hover, classes.selectedPost]
          )}
          onMouseEnter={() => setHoverIdx(0)}
          onMouseLeave={() => setHoverIdx(null)}
        />
        <Tab
          classes={{
            wrapper: classes.tabWapper,
            labelIcon: classes.tabLabel,
            selected: classes.selectedQuestion
          }}
          icon={
            value === 1 || hoverIdx === 1
              ? <ActiveCreateQuestion className={classes.mr1} />
              : <DeactiveCreateQuestion className={classes.mr1} />
          }
          label="Ask a question"
          style={{ animation: animations.fadeIn }}
          className={clsx(
            hoverIdx === 1 && [classes.hoverQuestion, classes.hover, classes.selectedQuestion]
          )}
          onMouseEnter={() => setHoverIdx(1)}
          onMouseLeave={() => setHoverIdx(null)}
        />
        <Tab
          classes={{
            wrapper: classes.tabWapper,
            selected: classes.selectedNote,
            labelIcon: classes.tabLabelRight
          }}
          icon={
            value === 2 || hoverIdx === 2
              ? <ActiveCreateNote className={classes.mr1} />
              : <DeactiveCreateNote className={classes.mr1} />
          }
          label="Share Notes"
          style={{ animation: animations.fadeIn }}
          className={clsx(
            hoverIdx === 2 && [classes.hoverNotes, classes.hover, classes.selectedNote]
          )}
          onMouseEnter={() => setHoverIdx(2)}
          onMouseLeave={() => setHoverIdx(null)}
        />
        <Tab
          classes={{
            wrapper: classes.tabWapper,
            selected: classes.selectedResource
          }}
          icon={
            value === 3 || hoverIdx === 3
              ? <ActiveCreateShare className={classes.mr1} />
              : <DeactiveCreateShare className={classes.mr1} />
          }
          label="Share a resource"
          style={{ animation: animations.fadeIn }}
          className={clsx(
            hoverIdx === 3 && [classes.hoverResource, classes.hover, classes.selectedResource]
          )}
          onMouseEnter={() => setHoverIdx(3)}
          onMouseLeave={() => setHoverIdx(null)}
        />
      </Tabs>
    </AppBar>
  )
}

export default withStyles(styles)(AppbarComponent)
