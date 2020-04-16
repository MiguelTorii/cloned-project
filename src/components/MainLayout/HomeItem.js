import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import ViewListIcon from '@material-ui/icons/ViewList';
import queryString from 'query-string'
import Typography from '@material-ui/core/Typography';
import SubMenu from 'components/MainLayout/SubMenu'
// $FlowIgnore
import { ReactComponent as GradCapIcon } from '../../assets/svg/ic_grad_cap.svg';

type Props = {
  newClassExperience: boolean,
  updateFeed: Function,
  userClasses: Object,
  MyLink: Function,
  openClassmatesDialog: Function
};

const HomeItem = ({
  userClasses,
  MyLink,
  updateFeed,
  openClassmatesDialog,
  newClassExperience,
  createPostOpen,
}: Props) => {
  const [classList, setClassList] = useState([])
  const classes = makeStyles(theme => ({
    item: {
      width: 'auto',
      borderRadius: theme.spacing(6),
      paddingTop: 0,
      paddingBottom: 0,
      margin: theme.spacing(2),
      '&:hover': {
        background: theme.circleIn.palette.primaryText2
      },
    },
    currentPath: {
      background: theme.circleIn.palette.buttonBackground,
    },
    otherPath: {
      background: theme.circleIn.palette.modalBackground,
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

  useEffect(() => {
    if(newClassExperience && userClasses && userClasses.classList) {
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

  const isHome = ['/'].includes(window.location.pathname)
  const params = queryString.parse(window.location.search)

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
        link="/"
        className={classNames(
          classes.item,
          isHome ? classes.currentPath : null
        )}
      >
        <ListItemIcon>
          {newClassExperience ? <GradCapIcon className={classNames("whiteSvg")} /> : <ViewListIcon />}
        </ListItemIcon>
        <ListItemText
          primary={!newClassExperience ? "Study" : "My Classes"}
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
            link={`/feed?sectionId=${cl.sectionId}&classId=${cl.classId}`}
            className={classNames(
              classes.classes,
              classes.item,
              params.sectionId === String(cl.sectionId) && params.classId === String(cl.classId) ? classes.otherPath : null
            )}
          >
            {renderCircle(cl.color)}
            <Typography className={classes.typo}>{cl.courseDisplayName}</Typography>
          </ListItem>
          {params.sectionId === String(cl.sectionId) && params.classId === String(cl.classId) &&
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

export default HomeItem
