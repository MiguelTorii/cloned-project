import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import ViewListIcon from '@material-ui/icons/ViewList';
import queryString from 'query-string'
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';

type Props = {
  newClassExperience: boolean,
  updateFeed: Function,
  userClasses: Object,
  MyLink: Function
}

const HomeItem = ({
  userClasses, 
  MyLink, 
  updateFeed,
  newClassExperience
}: Props) => {
  const [classList, setClassList] = useState([])
  const classes = makeStyles(theme => ({
    currentPath: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      background: theme.circleIn.palette.buttonBackground,
      paddingTop: 0,
      paddingBottom: 0,
      margin: theme.spacing(2),
      '&:hover': {
        background: theme.circleIn.palette.primaryText2
      },
    },
    otherPath: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      paddingTop: 0,
      paddingBottom: 0,
      margin: theme.spacing(2),
      '&:hover': {
        background: theme.circleIn.palette.primaryText2
      },
    },
    classes: {
      fontSize: 14,
      paddingTop: 0,
      paddingBottom: 0,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      textAlign: 'center'
    }
  }))()

  useEffect(() => {
    if(newClassExperience && userClasses && userClasses.classList) {
      setClassList(
        userClasses.classList.map(cl => {
          return cl.section.map(s => ({
            sectionDisplayName: s.sectionDisplayName,
            instructorDisplayName: s.instructorDisplayName,
            class: cl.class,
            sectionId: s.sectionId,
            classId: cl.classId,
            courseDisplayName: cl.courseDisplayName,
          }))
        }).flatMap(x =>x)
      )
    }
  }, [newClassExperience, userClasses])

  const isHome = ['/'].includes(window.location.pathname)
  const params = queryString.parse(window.location.search)

  return (
    <div
      className="tour-onboarding-study"
    >
      <ListItem 
        button 
        component={MyLink} 
        link="/"
        className={classNames(
          isHome ? classes.currentPath : classes.otherPath
        )}
      >
        <ListItemIcon>
          {newClassExperience ? <GradCapIcon className={classNames("whiteSvg")} /> : <ViewListIcon />}
        </ListItemIcon>
        <ListItemText
          primary={!newClassExperience ? "Study" : "My Classes"}
        />
      </ListItem>
      {classList.map(cl => (
        <ListItem 
          button 
          key={cl.sectionId}
          component={MyLink} 
          onClick={() => updateFeed(cl.sectionId, cl.classId)}
          link={`/feed?sectionId=${cl.sectionId}&classId=${cl.classId}`}
          className={classNames(
            classes.classes,
            params.sectionId === String(cl.sectionId) && params.classId === String(cl.classId) ? classes.currentPath : classes.otherPath
          )}
        >
          <ListItemText
            primary={cl.class}
          />
        </ListItem>
      ))}
    </div>
  )
}

export default HomeItem
