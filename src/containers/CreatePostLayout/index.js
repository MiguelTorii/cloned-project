/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'

import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import { animations } from 'react-animation';
import clsx from 'clsx';
import LoadImg from 'components/LoadImg'

import ClassMultiSelect from 'containers/ClassMultiSelect'
import ClassSelector from 'containers/ClassSelector'
import { ReactComponent as DeactiveCreatePost } from 'assets/svg/inactive_create_post.svg'
import { ReactComponent as DeactiveCreateQuestion } from 'assets/svg/inactive_create_question.svg'
import { ReactComponent as DeactiveCreateNote } from 'assets/svg/inactive_create_note.svg'
import { ReactComponent as DeactiveCreateShare } from 'assets/svg/inactive_create_share.svg'

import { ReactComponent as ActiveCreatePost } from 'assets/svg/active_create_post.svg'
import { ReactComponent as ActiveCreateQuestion } from 'assets/svg/smile-green.svg'
import { ReactComponent as ActiveCreateNote } from 'assets/svg/active_create_note.svg'
import { ReactComponent as ActiveCreateShare } from 'assets/svg/active_create_share.svg'

import circleinLogo from 'assets/svg/circlein_logo_minimal.svg'
import postingImage from 'assets/svg/posting.svg'

import CreateQuestion from './Question'
import CreateNotes from './Note'
import CreatePostSt from './PostSt'
import CreateShareLink from './ShareLink'
import ErrorBoundary from '../ErrorBoundary'
import type { State as StoreState } from '../../types/state'
import { useLocation } from 'react-router';

const styles = theme => ({
  item: {
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(4),
    fontWeight: 'bold'
  },
  container: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(),
  },
  paperRoot: {
    flexGrow: 1,
    boxShadow: 'none',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.circleIn.palette.formBackground
  },
  appBar: {
    backgroundColor: theme.circleIn.palette.formBackground,
    borderRadius: theme.spacing(1),
    boxShadow: 'none'
  },
  selectClassTxtContainer: {
    padding: theme.spacing(2, 0),
    maxWidth: 400
  },
  hoverPost: {
    borderRadius: '10px 0 0 0',
  },
  hoverQuestion: {
    borderRadius: '0 0 0 0',
  },
  hoverNotes: {
    borderRadius: '0 0 0 0',
  },
  hoverResource: {
    borderRadius: '0 10px 0 0',
  },
  hover: {
    background: 'linear-gradient(180deg, #383838 0%, #383838 49.48%, #222222 100%), #3A3B3B'
  },
  tabsContainer: {
    borderBottom: '1px solid #37393E',
    height: 92,
  },
  tabLabel: {
    borderRight: '1px solid #37393E',
    borderLeft: '1px solid #37393E'
  },
  tabLabelRight: {
    borderRight: '1px solid #37393E',
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
    borderBottom: '5px solid #03A9F4'
  },
  selectedQuestion: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: '5px solid #60B515'
  },
  selectedNote: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: '5px solid #F5C264'
  },
  selectedResource: {
    "&>:first-child": {
      color: theme.circleIn.palette.primaryText1,
    },
    borderBottom: '5px solid #6515CF'
  },
  mr1: {
    marginRight: `${theme.spacing(1)}px !important`
  },
  circleinPostListTitle: {
    padding: theme.spacing(3, 1.5, 1.5, 1.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleinLogo: {
    display: 'flex',
    justifyContent: 'center',
    width: 30,
    marginRight: 8
  },
  divider: {
    backgroundColor: theme.circleIn.palette.appBar,
    margin: theme.spacing(0, 1)
  },
  link: {
    color: theme.circleIn.palette.brand
  },
  dialogPaper: {
    '&.MuiDialog-paper': {
      background: 'transparent',
      boxShadow: 'none',
    },
  },
  label: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: '65px',
    textAlign: 'center',
    marginTop: '-60px',
  }
})

const CreatePostLayout = ({ classes, user, postId, questionId, noteId, sharelinkId }) => {

  const [selectedClasses, setSelectedClasses] = useState([])
  const [value, setValue] = useState(0)
  const [classId, setClassId] = useState(0)
  const [sectionId, setSectionId] = useState(0)
  const [isHoverOnPost, setIsHoverOnPost] = useState(false)
  const [isHoverOnQuestion, setIsHoverOnQuestion] = useState(false)
  const [isHoverOnNotes, setIsHoverOnNotes] = useState(false)
  const [isHoverOnResource, setIsHoverOnResource] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const location = useLocation()

  useEffect(() => {
    return () => {
      localStorage.removeItem('postSt');
      localStorage.removeItem('question');
      localStorage.removeItem('note');
      localStorage.removeItem('shareLink');
    }
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab !== null) {
      setValue(Number(tab));
    }
  }, [location]);

  useEffect(() => {
    if (postId) {
      setValue(0)
    }

    if (questionId) {
      setValue(1)
    }

    if (noteId) {
      setValue(2)
    }

    if (sharelinkId) {
      setValue(3)
    }
  }, [postId, noteId, questionId, sharelinkId])

  const {
    expertMode,
    data: { firstName, permission },
    userClasses: { classList }
  } = user

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue)
  }, [])

  const canBatchPost = useMemo(() =>
    expertMode && permission.includes('one_touch_send_posts'),
  [expertMode, permission])

  const handleClassChange = useCallback(({ classId, sectionId }) => {
    setClassId(classId)
    setSectionId(sectionId)
  }, [])

  const options = useMemo(() => {
    try {
      const newClassList = {}
      classList.forEach(cl => {
        if (
          cl.section &&
          cl.section.length > 0 &&
          cl.className &&
          cl.bgColor
        )
          cl.section.forEach(s => {
            newClassList[s.sectionId] = cl
          })
      })
      return Object.keys(newClassList).map(sectionId => {
        return {
          ...newClassList[sectionId],
          sectionId: Number(sectionId),
        }
      })
    } finally {/* NONE */}
  }, [classList])

  const onSelect = useCallback(opts => {
    setSelectedClasses(opts)
  }, [])

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    }
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Dialog
        open={isPosting}
        classes={{
          paper: classes.dialogPaper
        }}
      >
        <img src={postingImage} className={classes.postingImage} alt="Posting.." />
        <div className={classes.label}>Posting...</div>
      </Dialog>
      <Grid
        justify="flex-start"
        className={classes.container}
        container
        spacing={2}
      >
        <Grid item xs={12} md={9} display="flex">
          <div className={classes.title}>
            <Typography component="h1" variant="h4" color="textPrimary">Create New Post</Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9} display="flex">
          {canBatchPost
            ? <ClassMultiSelect
              noEmpty
              variant='standard'
              allLabel={`${firstName}'s Classes`}
              containerStyle={classes.selectClassTxtContainer}
              externalOptions={options}
              placeholder='Select Classes...'
              selected={selectedClasses}
              onSelect={onSelect}
            />
            : <ClassSelector
              classId={classId}
              sectionId={sectionId}
              variant='standard'
              onChange={handleClassChange}
            />}
        </Grid>
        <Grid item xs={12} md={9} display="flex">
          <div className={classes.paperRoot}>
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
                    value === 0 || isHoverOnPost
                      ? <ActiveCreatePost />
                      : <DeactiveCreatePost className={classes.mr1} />
                  }
                  label="Write a Post"
                  style={{ animation: animations.fadeIn }}
                  className={clsx(
                    isHoverOnPost && [classes.hoverPost, classes.hover, classes.selectedPost]
                  )}
                  onMouseEnter={() => setIsHoverOnPost(true)}
                  onMouseLeave={() => setIsHoverOnPost(false)}
                />
                <Tab
                  classes={{
                    wrapper: classes.tabWapper,
                    labelIcon: classes.tabLabel,
                    selected: classes.selectedQuestion
                  }}
                  icon={
                    value === 1 || isHoverOnQuestion
                      ? <ActiveCreateQuestion className={classes.mr1} />
                      : <DeactiveCreateQuestion className={classes.mr1} />
                  }
                  label="Ask a question"
                  style={{ animation: animations.fadeIn }}
                  className={clsx(
                    isHoverOnQuestion && [classes.hoverQuestion, classes.hover, classes.selectedQuestion]
                  )}
                  onMouseEnter={() => setIsHoverOnQuestion(true)}
                  onMouseLeave={() => setIsHoverOnQuestion(false)}
                />
                <Tab
                  classes={{
                    wrapper: classes.tabWapper,
                    selected: classes.selectedNote,
                    labelIcon: classes.tabLabelRight
                  }}
                  icon={
                    value === 2 || isHoverOnNotes
                      ? <ActiveCreateNote className={classes.mr1} />
                      : <DeactiveCreateNote className={classes.mr1} />
                  }
                  label="Share Notes"
                  style={{ animation: animations.fadeIn }}
                  className={clsx(
                    isHoverOnNotes && [classes.hoverNotes, classes.hover, classes.selectedNote]
                  )}
                  onMouseEnter={() => setIsHoverOnNotes(true)}
                  onMouseLeave={() => setIsHoverOnNotes(false)}
                />
                <Tab
                  classes={{
                    wrapper: classes.tabWapper,
                    selected: classes.selectedResource
                  }}
                  icon={
                    value === 3 || isHoverOnResource
                      ? <ActiveCreateShare className={classes.mr1} />
                      : <DeactiveCreateShare className={classes.mr1} />
                  }
                  label="Share a resource"
                  style={{ animation: animations.fadeIn }}
                  className={clsx(
                    isHoverOnResource && [classes.hoverResource, classes.hover, classes.selectedResource]
                  )}
                  onMouseEnter={() => setIsHoverOnResource(true)}
                  onMouseLeave={() => setIsHoverOnResource(false)}
                />
              </Tabs>
            </AppBar>
            <TabPanel key="create-post" value={value} index={0} {...a11yProps(0)} >
              <CreatePostSt
                classList={selectedClasses}
                classId={classId}
                sectionId={sectionId}
                currentTag={value}
                postId={postId}
                setIsPosting={() => setIsPosting(true)}
              />
            </TabPanel>
            <TabPanel key="create-question" value={value} index={1} {...a11yProps(1)} >
              <CreateQuestion
                classList={selectedClasses}
                currentSelectedClassId={classId}
                sectionId={sectionId}
                currentTag={value}
                questionId={questionId}
              />
            </TabPanel>
            <TabPanel key="share-note" value={value} index={2} {...a11yProps(2)} >
              <CreateNotes
                classList={selectedClasses}
                currentTag={value}
                classId={classId}
                sectionId={sectionId}
                noteId={noteId}
              />
            </TabPanel>
            <TabPanel key="share-resources" value={value} index={3} {...a11yProps(3)} >
              <CreateShareLink
                classList={selectedClasses}
                currentTag={value}
                classId={classId}
                sectionId={sectionId}
                sharelinkId={sharelinkId}
              />
            </TabPanel>
          </div>
        </Grid>
        <Grid item xs={12} md={3} display="flex">
          <div className={classes.paperRoot}>
            <div className={classes.circleinPostListTitle}>
              <LoadImg url={circleinLogo} className={classes.circleinLogo} alt="Posting..." />
              <Typography variant="subtitle1" color="textPrimary">
                <b>Etiquette for CircleIn Posts</b>
              </Typography>
            </div>
            <List component="nav" aria-label="circlein-post">
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="1. Be kind and courteous" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="2. Support your classmates" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="3. Behave as you would IRL" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="4. Cite your sources" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="5. Check for duplicates" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="6. Take a deep breath" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <ListItemText primary="7. Make links shareable" />
              </ListItem>
              <Divider classes={{ root: classes.divider }} />
              <ListItem button>
                <span style={{ fontSize: '1rem' }}>
                8. Read our <a className={classes.link} href="#">community rules</a>
                </span>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreatePostLayout))