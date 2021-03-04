// @flow

import React , { useEffect, useState, memo }from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import ViewListIcon from '@material-ui/icons/ViewList';
// $FlowIgnore
import Typography from '@material-ui/core/Typography';
import SubMenu from 'components/MainLayout/SubMenu'
import { cypher, decypherClass } from 'utils/crypto'
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';

type Props = {
  newClassExperience: boolean,
  MyLink: Function,
    userClasses: Object,
updateFeed: Function,
  openClassmatesDialog: Function
};

const HomeItem = ({
  MyLink,
  newClassExperience,

  landingPageCampaign,

  createPostOpen,
  updateFeed,

  openClassmatesDialog,

  userClasses,
}: Props) => {
  const [classList, setClassList] = useState([])

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
  const { classId, sectionId } = decypherClass()

  useEffect(() => {
    if (newClassExperience && userClasses && userClasses.classList) {
      setClassList(
        userClasses.classList.map(cl => {
          const classInter = cl.section.map(s => ({
            sectionDisplayName: s.sectionDisplayName,
            instructorDisplayName: s.instructorDisplayName,
            class: cl.class,
            sectionId: s.sectionId,
            classId: cl.classId,
            color: cl.bgColor,
            courseDisplayName: cl.courseDisplayName,
          }))
          return classInter.length > 0 ? classInter[0] : null
        })
      )
    }
  }, [newClassExperience, userClasses])

  const classesPath = landingPageCampaign ? '/classes' : '/'
  const isHome = [classesPath].includes(window.location.pathname)

  const renderCircle = color => (
    <div style={{
      background: color,
      borderRadius: '50%',
      width: 8,
      height: 8,
      position: 'absolute',
    }} />
  )

  return (
    <div
      className="tour-onboarding-study"
    >
      <ListItem
        button
        component={MyLink}
        // link='/feed'
        link={classesPath}
        className={classNames(
          classes.item,
          isHome ? classes.currentPath : null
          // ['/feed', '/my_posts', '/bookmarks'].includes(window.location.pathname) ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemIcon>
          {newClassExperience ? <GradCapIcon className={classNames("whiteSvg")} /> : <ViewListIcon />}
        </ListItemIcon>
        <ListItemText
          primary={!newClassExperience ? "Study" : "Classes"}
          // primary='Class Feeds'
        />
      </ListItem>
      {classList.map(cl => cl && (
        <div
          key={cl.sectionId}
        >
          <ListItem
            button
            component={MyLink}
            onClick={() => updateFeed(cl.sectionId, cl.classId)}
            link={`/feed?class=${cypher(`${cl.classId}:${cl.sectionId}`)}`}
            className={classNames(
              classes.classes,
              classes.item,
              sectionId === String(cl.sectionId) && classId === String(cl.classId) ? classes.currentPath : classes.otherPath
            )}
          >
            {renderCircle(cl.color)}
            <Typography className={classes.typo}>{cl.courseDisplayName}</Typography>
          </ListItem>
          {sectionId === String(cl.sectionId) && classId === String(cl.classId) &&
            <SubMenu
              createPostOpen={createPostOpen}
              MyLink={MyLink}
              openClassmatesDialog={openClassmatesDialog}
            />}
        </div>
      ))}
    </div>
  )
}

export default memo(HomeItem)
