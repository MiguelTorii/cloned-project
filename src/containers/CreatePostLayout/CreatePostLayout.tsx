/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { push } from 'connected-react-router';
import { connect, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { cypherClass } from 'utils/crypto';
import { buildPath } from 'utils/helpers';

import postingImage from 'assets/gif/loading-rocket.gif';
import circleinLogo from 'assets/svg/circlein_logo_minimal.svg';
import LoadImg from 'components/LoadImg/LoadImg';

import ClassMultiSelect from '../ClassMultiSelect/ClassMultiSelect';
import ClassSelector from '../ClassSelector/ClassesSelector';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import CreateNotes from './Note';
import CreatePostSt from './PostSt';
import Question from './Question';
import CreateShareLink from './ShareLink';
import TabPanel from './TabPanel';

import type { State as StoreState } from 'types/state';

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
  container: {},
  paperRoot: {
    flexGrow: 1,
    boxShadow: 'none',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.circleIn.palette.formBackground
  },
  selectClassOuterContainer: {
    padding: theme.spacing(5, 5, 0, 5)
  },
  selectClassInnerContainer: {
    width: '100%'
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

type Props = {
  classes?: any;
  user?: any;
  postId?: any;
  questionId?: any;
  noteId?: any;
  sharelinkId?: any;
};

const CreatePostLayout = ({ classes, user, postId, questionId, noteId, sharelinkId }: Props) => {
  const dispatch = useDispatch();
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [value, setValue] = useState(0);
  const [classId, setClassId] = useState(0);
  const [sectionId, setSectionId] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [noteImages, setNoteImages] = useState([]);
  const [isFormValidated, setIsFormValidated] = useState(false);
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
    } else if (location.pathname === '/create/question') {
      setValue(1);
    } else if (location.pathname === '/create/notes') {
      setValue(2);
    } else if (location.pathname === '/create/sharelink') {
      setValue(3);
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

  const handleAfterCreation = useCallback(
    (path) => {
      dispatch(
        push(
          buildPath(path, {
            class: !canBatchPost ? cypherClass({ classId, sectionId }) : undefined,
            reload: true
          })
        )
      );
    },
    [dispatch, canBatchPost, classId, sectionId]
  );

  const renderClassSelector = () => (
    <Grid item xs={12} md={9}>
      {canBatchPost ? (
        <ClassMultiSelect
          noEmpty
          variant="standard"
          allLabel={`${firstName}'s Classes`}
          externalOptions={options}
          placeholder="Select Classes..."
          selected={selectedClasses}
          onSelect={onSelect}
          classes={{
            container: classes.selectClassTxtContainer
          }}
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
  );

  const a11yProps = (index) => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  });

  const renderHudClassSelector = () => (
    <div className={classes.selectClassOuterContainer}>
      <div className={classes.selectClassInnerContainer}>
        {canBatchPost ? (
          <ClassMultiSelect
            noEmpty
            variant="standard"
            allLabel={`All Classes`}
            externalOptions={options}
            placeholder="Select Classes..."
            selected={selectedClasses}
            onSelect={onSelect}
            classes={{
              container: classes.selectClassTxtContainer
            }}
          />
        ) : (
          <ClassSelector
            wideLayout
            classId={classId}
            sectionId={sectionId}
            variant="standard"
            onChange={handleClassChange}
            validate={isFormValidated}
          />
        )}
      </div>
    </div>
  );

  const handleValidateForm = useCallback(() => setIsFormValidated(true), []);

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
        <Grid item xs={12} lg={9}>
          <div className={classes.paperRoot}>
            {renderHudClassSelector()}
            <TabPanel value={value} index={0} {...a11yProps(0)}>
              <CreatePostSt
                classList={selectedClasses}
                classId={classId}
                sectionId={sectionId}
                currentTag={value}
                postId={postId}
                setIsPosting={(val) => setIsPosting(val)}
                handleAfterCreation={handleAfterCreation}
                onSetClass={handleClassChange}
                onValidateForm={handleValidateForm}
              />
            </TabPanel>
            <TabPanel value={value} index={1} {...a11yProps(1)}>
              <Question
                classList={selectedClasses}
                classId={classId}
                sectionId={sectionId}
                currentTag={value}
                questionId={questionId}
                setIsPosting={(val) => setIsPosting(val)}
                handleAfterCreation={handleAfterCreation}
                onSetClass={handleClassChange}
                onValidateForm={handleValidateForm}
              />
            </TabPanel>
            <TabPanel value={value} index={2} {...a11yProps(2)}>
              <CreateNotes
                classList={selectedClasses}
                currentTag={value}
                classId={classId}
                sectionId={sectionId}
                noteId={noteId}
                setIsPosting={(val) => setIsPosting(val)}
                handleAfterCreation={handleAfterCreation}
                onSetClass={handleClassChange}
                images={noteImages}
                onSetImages={setNoteImages}
                onValidateForm={handleValidateForm}
              />
            </TabPanel>
            <TabPanel value={value} index={3} {...a11yProps(3)}>
              <CreateShareLink
                classList={selectedClasses}
                currentTag={value}
                classId={classId}
                sectionId={sectionId}
                sharelinkId={sharelinkId}
                handleAfterCreation={handleAfterCreation}
                onSetClass={handleClassChange}
                onValidateForm={handleValidateForm}
              />
            </TabPanel>
          </div>
        </Grid>
        <Grid item xs={12} lg={3}>
          <div className={classes.paperRoot}>
            <div className={classes.circleinPostListTitle}>
              <LoadImg url={circleinLogo} className={classes.circleinLogo} alt="Posting..." />
              <Typography variant="subtitle1" color="textPrimary">
                <b>Etiquette for CircleIn Posts</b>
              </Typography>
            </div>
            <List component="nav" aria-label="circlein-post">
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="1. Be kind and courteous" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="2. Support your classmates" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="3. Behave as you would IRL" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="4. Cite your sources" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="5. Check for duplicates" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="6. Take a deep breath" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <ListItemText primary="7. Make links shareable" />
              </ListItem>
              <Divider
                classes={{
                  root: classes.divider
                }}
              />
              <ListItem button>
                <span
                  style={{
                    fontSize: '1rem'
                  }}
                >
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
export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(CreatePostLayout));
