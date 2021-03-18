// @flow

import React , {
  useCallback,
  // useEffect,
  useState,
  memo
} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import { ReactComponent as ClassFeedIconOff } from 'assets/svg/class-feed-icon-off.svg';
import { ReactComponent as ClassFeedIconOn } from 'assets/svg/class-feed-icon-on.svg';
// $FlowIgnore
// import Typography from '@material-ui/core/Typography';
// import SubMenu from 'components/MainLayout/SubMenu'
// import { cypher, decypherClass } from 'utils/crypto'
import Tooltip from 'containers/Tooltip'

type Props = {
  // newClassExperience: boolean,
  MyLink: Function
  // userClasses: Object,
  // updateFeed: Function,
  // openClassmatesDialog: Function
};

const useStyles = makeStyles(theme => ({
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
  },
  menuIcon: {
    marginRight: theme.spacing(),
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const HomeItem = ({
  MyLink,
  // newClassExperience,
  // landingPageCampaign,
  // createPostOpen,
  // updateFeed,
  // openClassmatesDialog,
  // userClasses,
}: Props) => {
  const classes = useStyles()
  // const [classList, setClassList] = useState([])
  const [hoverState, setHoverState] = useState(false)

  const onHover = useCallback((hover) => () => {
    setHoverState(hover)
  }, [])

  // const { classId, sectionId } = decypherClass()

  // useEffect(() => {
  // if (newClassExperience && userClasses && userClasses.classList) {
  // setClassList(
  // userClasses.classList.map(cl => {
  // const classInter = cl.section.map(s => ({
  // sectionDisplayName: s.sectionDisplayName,
  // instructorDisplayName: s.instructorDisplayName,
  // class: cl.class,
  // sectionId: s.sectionId,
  // classId: cl.classId,
  // color: cl.bgColor,
  // courseDisplayName: cl.courseDisplayName,
  // }))
  // return classInter.length > 0 ? classInter[0] : null
  // })
  // )
  // }
  // }, [newClassExperience, userClasses])

  // const classesPath = landingPageCampaign ? '/classes' : '/'
  // const isHome = [classesPath].includes(window.location.pathname)

  // const renderCircle = color => (
  // <div style={{
  // background: color,
  // borderRadius: '50%',
  // width: 8,
  // height: 8,
  // position: 'absolute',
  // }} />
  // )

  return (
    <div
      className="tour-onboarding-study"
    >
      <Tooltip
        id={9054}
        placement="right"
        okButton='Okay!'
        totalSteps={3}
        completedSteps={0}
        text="Hey! 👋 We moved “classes”.
Classes will not appear in this left navigation.
"
      >
        <ListItem
          button
          component={MyLink}
          onMouseOver={onHover(true)}
          onMouseLeave={onHover(false)}
          link='/feed'
          // link={classesPath}
          className={classNames(
            classes.item,
            // isHome ? classes.currentPath : null
            ['/feed', '/my_posts', '/bookmarks'].includes(window.location.pathname) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemIcon className={classes.menuIcon}>
            {hoverState || ['/feed', '/my_posts', '/bookmarks'].includes(window.location.pathname)
              ? <ClassFeedIconOn />
              : <ClassFeedIconOff />
            }
          </ListItemIcon>
          <ListItemText
          // primary={!newClassExperience ? "Study" : "Classes"}
            primary='Class Feeds'
          />
        </ListItem>
      </Tooltip>
      {/* {classList.map(cl => cl && ( */}
      {/* <div */}
      {/* key={cl.sectionId} */}
      {/* > */}
      {/* <ListItem */}
      {/* button */}
      {/* component={MyLink} */}
      {/* onClick={() => updateFeed(cl.sectionId, cl.classId)} */}
      {/* link={`/feed?class=${cypher(`${cl.classId}:${cl.sectionId}`)}`} */}
      {/* className={classNames( */}
      {/* classes.classes, */}
      {/* classes.item, */}
      {/* sectionId === String(cl.sectionId) && classId === String(cl.classId) ? classes.currentPath : classes.otherPath */}
      {/* )} */}
      {/* > */}
      {/* [>{renderCircle(cl.color)}<] */}
      {/* <Typography className={classes.typo}>{cl.courseDisplayName}</Typography> */}
      {/* </ListItem> */}
      {/* {sectionId === String(cl.sectionId) && classId === String(cl.classId) && */}
      {/* <SubMenu */}
      {/* createPostOpen={createPostOpen} */}
      {/* MyLink={MyLink} */}
      {/* openClassmatesDialog={openClassmatesDialog} */}
      {/* />} */}
      {/* </div> */}
      {/* ))} */}
    </div>
  )
}

export default memo(HomeItem)
