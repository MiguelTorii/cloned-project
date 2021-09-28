/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import LoadImg from 'components/LoadImg/LoadImg';

import ClassMultiSelect from 'containers/ClassMultiSelect/ClassMultiSelect';
import ClassSelector from 'containers/ClassSelector/ClassesSelector';
import circleinLogo from 'assets/svg/circlein_logo_minimal.svg';
import postingImage from 'assets/gif/loading-rocket.gif';

import { useLocation } from 'react-router';
import CreateQuestion from './Question';
import CreateNotes from './Note';
import CreatePostSt from './PostSt';
import CreateShareLink from './ShareLink';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import type { State as StoreState } from '../../types/state';
import Appbar from './Appbar';

const styles = (theme) => ({
  item: {
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(4),
    fontWeight: 'bold'
  },
  container: {
    marginTop: theme.spacing(3),
    padding: theme.spacing()
  },
  paperRoot: {
    flexGrow: 1,
    boxShadow: 'none',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.circleIn.palette.formBackground
  },
  selectClassTxtContainer: {
    padding: theme.spacing(2, 0),
    maxWidth: 400
  },
  circleinPostListTitle: {
    padding: theme.spacing(3, 1.5, 1.5, 1.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
      boxShadow: 'none'
    }
  },
  label: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: '65px',
    textAlign: 'center',
    marginTop: '-60px'
  }
});

const CreatePostLayout = ({ classes, user, postId, questionId, noteId, sharelinkId }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [value, setValue] = useState(0);
  const [classId, setClassId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [images, setImages] = useState([]);
  const location = useLocation();

  useEffect(
    () => () => {
      localStorage.removeItem('postSt');
      localStorage.removeItem('question');
      localStorage.removeItem('note');
      localStorage.removeItem('shareLink');
    },
    []
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab !== null) {
      setValue(Number(tab));
    }
  }, [location]);

  useEffect(() => {
    if (postId) {
      setValue(0);
    }

    if (questionId) {
      setValue(1);
    }

    if (noteId) {
      setValue(2);
    }

    if (sharelinkId) {
      setValue(3);
    }
  }, [postId, noteId, questionId, sharelinkId]);

  const {
    expertMode,
    data: { firstName, permission },
    userClasses: { classList }
  } = user;

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const canBatchPost = useMemo(
    () => expertMode && permission.includes('one_touch_send_posts'),
    [expertMode, permission]
  );

  const handleClassChange = useCallback(({ classId, sectionId }) => {
    setClassId(classId);
    setSectionId(sectionId);
  }, []);

  const options = useMemo(() => {
    try {
      const newClassList = {};
      const currentClassList = classList.filter((cl) => cl.isCurrent);
      currentClassList.forEach((cl) => {
        if (cl.section && cl.section.length > 0 && cl.className && cl.bgColor) {
          cl.section.forEach((s) => {
            newClassList[s.sectionId] = cl;
          });
        }
      });
      return Object.keys(newClassList).map((sectionId) => ({
        ...newClassList[sectionId],
        sectionId: Number(sectionId)
      }));
    } finally {
      /* NONE */
    }
  }, [classList]);

  const onSelect = useCallback((opts) => {
    setSelectedClasses(opts);
  }, []);

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Dialog
        open={isPosting}
        classes={{
          paper: classes.dialogPaper
        }}
      >
        <img src={postingImage} alt="Posting" className={classes.postingImage} />
        <div className={classes.label}>Posting...</div>
      </Dialog>
      <Grid justifyContent="flex-start" className={classes.container} container spacing={2}>
        <Grid item xs={12} md={9} display="flex">
          <div className={classes.title}>
            <Typography component="h1" variant="h4" color="textPrimary">
              Create New Post
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9} display="flex">
          {canBatchPost ? (
            <ClassMultiSelect
              noEmpty
              variant="standard"
              allLabel={`${firstName}'s Classes`}
              containerStyle={classes.selectClassTxtContainer}
              externalOptions={options}
              placeholder="Select Classes..."
              selected={selectedClasses}
              onSelect={onSelect}
            />
          ) : (
            <ClassSelector
              classId={classId}
              sectionId={sectionId}
              variant="standard"
              onChange={handleClassChange}
            />
          )}
        </Grid>
        <Grid item xs={12} lg={9} display="flex">
          <div className={classes.paperRoot}>
            <Appbar value={value} handleChange={handleChange} />
            <TabPanel key="create-post" value={value} index={0} {...a11yProps(0)}>
              <CreatePostSt
                classList={selectedClasses}
                classId={classId}
                sectionId={sectionId}
                currentTag={value}
                postId={postId}
                setIsPosting={(val) => setIsPosting(val)}
              />
            </TabPanel>
            <TabPanel key="create-question" value={value} index={1} {...a11yProps(1)}>
              <CreateQuestion
                classList={selectedClasses}
                currentSelectedClassId={classId}
                sectionId={sectionId}
                currentTag={value}
                questionId={questionId}
                setIsPosting={(val) => setIsPosting(val)}
              />
            </TabPanel>
            <TabPanel key="share-note" value={value} index={2} {...a11yProps(2)}>
              <CreateNotes
                classList={selectedClasses}
                currentTag={value}
                classId={classId}
                sectionId={sectionId}
                noteId={noteId}
                images={images}
                handleUpdateImages={setImages}
                setIsPosting={(val) => setIsPosting(val)}
              />
            </TabPanel>
            <TabPanel key="share-resources" value={value} index={3} {...a11yProps(3)}>
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
        <Grid item xs={12} lg={3} display="flex">
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
                  8. Read our{' '}
                  <a
                    className={classes.link}
                    href="http://community.circleinapp.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    community rules
                  </a>
                </span>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    </ErrorBoundary>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreatePostLayout));
