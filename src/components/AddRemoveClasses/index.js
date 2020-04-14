// @flow
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import {
  leaveUserClass,
  joinClass,
  getUserClasses,
  getAvailableClassesSections,
  getAvailableSubjectsClasses,
  getAvailableSubjects
} from 'api/user';
import searchClasses from 'api/class';
import * as notificationsActions from '../../actions/notifications';
import * as userActions from '../../actions/user';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import Dialog, { dialogStyle } from '../Dialog';

const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
  },
  list: {
    overflowY: 'scroll',
  },
  stackbar: {
    color: theme.circleIn.palette.primaryText1
  },
  dialog: {
    ...dialogStyle,
    height: 700,
    width: 700,
  },
  optionItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  optionName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  optionButton: {
    borderRadius: 8,
    fontWeight: 'bold',
    marginLeft: 10,
    padding: '2px 16px',
    width: 50,
  },
  autocomplete: {
    marginBottom: 20,
    width: '100%'
  },
  paper: {
    background: theme.circleIn.palette.appBar
  }
});

type Props = {
  classes: Object,
  user: UserState,
  open: boolean,
  enqueueSnackbar: Function,
  fetchClasses: Function,
  onClose: Function
};

const AddRemoveClasses = (props: Props) => {
  const {
    classes,
    enqueueSnackbar,
    fetchClasses: updateClasses,
    open,
    user: {
      data: { userId, schoolId }
    },
    onClose
  } = props;

  const [tree, setTree] = useState({})
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState({})
  const [canAddClasses, setCanAddClasses] = useState(false)
  const [options, setOptions] = useState([])

  const fetchUserClasses = async () => {
    try {
      const res = await getUserClasses({ userId })
      const { permissions: { canAddClasses: cac } } = res
      setCanAddClasses(cac)
      const sectionsObj = {}
      res.classes.forEach(c => {
        const { section, permissions } = c
        section.forEach(s => {
          sectionsObj[`sc${s.sectionId}`] = { canLeave: permissions.canLeave }
        })
      })
      setSections(sectionsObj)
    } catch (e) {
      enqueueSnackbar({
        notification: {
          message: `Error loading Classes`,
          options: {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 7000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });
    }
  }

  const fetchSections = async (subjectId, classId) => {
    setLoading(true)
    const res = await getAvailableClassesSections({ classId })
    const sectionsObj = {}
    res.forEach(r => {
      sectionsObj[`sc${r.section_id}`] = {
        name: r.display_name,
        sectionId: r.section_id,
        classId,
        subjectId,
      }
    })

    tree[`s${subjectId}`].classes[`c${classId}`].sections = sectionsObj
    setTree(tree)
    setLoading(false)
  }

  const fetchClasses = async subjectId => {
    setLoading(true)
    const res = await getAvailableSubjectsClasses({ subjectId })
    const classesOps = {}
    res.forEach(r => {
      classesOps[`c${r.class_id}`] = {
        name: r.display_name,
        subjectId,
        sections: {},
        expand: () => fetchSections(subjectId, r.class_id)
      }
    })

    tree[`s${subjectId}`].classes = classesOps
    tree[`s${subjectId}`].expanded = true
    setTree(tree)
    setLoading(false)
  }

  const fetchSubjects = async () => {
    setLoading(true)
    const res = await getAvailableSubjects()
    res.forEach(r => {
      tree[`s${r.subject_id}`] = {
        name: r.display_name,
        subjectId: r.subject_id,
        expanded: false,
        classes: {},
        expand: () => fetchClasses(r.subject_id)
      }
    })

    setTree(tree)
    setLoading(false)
  }

  const handleChange = async (classId, sectionId, name) => {
    setLoading(true)
    try {
      if (Object.keys(sections).includes(`sc${sectionId}`)) {
        await leaveUserClass({ sectionId, classId, userId: String(userId) })
        delete sections[`sc${sectionId}`]
        setSections(sections)
        enqueueSnackbar({
          notification: {
            message: `Left ${name}`,
            options: {
              variant: 'info',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000,
              ContentProps: {
                classes: {
                  root: classes.stackbar
                }
              }
            }
          }
        });
      } else {
        const { success } = await joinClass({ classId, sectionId, userId: String(userId) })
        if (success) {
          sections[`sc${sectionId}`] = {}
          setSections(sections)
          enqueueSnackbar({
            notification: {
              message: `Joined ${name}`,
              options: {
                variant: 'info',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                autoHideDuration: 3000,
                ContentProps: {
                  classes: {
                    root: classes.stackbar
                  }
                }
              }
            }
          });
        }
      }

      await updateClasses()
    } catch (e) {
      enqueueSnackbar({
        notification: {
          message: `Couldn't change class settings`,
          options: {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            autoHideDuration: 7000,
            ContentProps: {
              classes: {
                root: classes.stackbar
              }
            }
          }
        }
      });
    }
    setLoading(false)
  }

  useEffect(() => {
    if (open) {
      fetchSubjects()
      if (userId) fetchUserClasses()
    }
    // eslint-disable-next-line
  }, [userId, open])

  let debouncedFn;

  const onAutocompleteChange = async (e) => {
    e.persist();

    if (!debouncedFn) {
      debouncedFn = debounce(async () => {
        const searchString = e.target.value;
        const result = await searchClasses(searchString);
        setOptions(result);
      }, 300);
    }

    debouncedFn();
  };

  const renderOption = (option) => (
    <div className={classes.optionItem}>
      <Typography
        className={classes.optionName}
      >
        {option.name.split("\n").map((item) => {
          return (<span key={Math.random()}>{item}<br /></span>)
        })}
      </Typography>
      <Button
        className={classes.optionButton}
        color={option.hasJoined ? 'secondary' : 'primary'}
        onClick={(e) => {
          e.stopPropagation();
          const newOptions = options.map(o => {
            if (o.sectionId === option.sectionId) {
              return {
                ...o,
                hasJoined: !option.hasJoined
              }
            }
            return o;
          });
          setOptions(newOptions);
          handleChange(option.classId, option.sectionId, option.name);
        }}
        variant="contained"
      >
        {option.hasJoined ? 'Added' : 'Add'}
      </Button>
    </div>
  );

  return (
    <Dialog
      className={classes.dialog}
      okTitle="Ok"
      onCancel={onClose}
      onOk={onClose}
      open={open}
      showActions
      title="Add/Remove Classes"
    >
      <>
        {loading && <CircularProgress
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%'
          }}
        />}
        {schoolId === "52" &&
          <Autocomplete
            classes={{ paper: classes.paper }}
            onClose={() => setOptions([])}
            options={options}
            renderOption={renderOption}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Find a class..."
                variant="outlined"
                onChange={onAutocompleteChange}
                className={classes.autocomplete}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
        }
        <TreeView
          className={classes.list}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {Object.keys(tree).map(t => {
            const subject = tree[t]
            return (
              <TreeItem
                key={t}
                onClick={!subject.expanded ? subject.expand : () => { }}
                nodeId={t}
                label={subject.name}
              >
                <TreeItem nodeId='classes' />

                {Object.keys(subject.classes).map(c => {
                  const classC = subject.classes[c]
                  return (
                    <TreeItem
                      key={c}
                      onClick={classC.expand}
                      nodeId={c}
                      label={classC.name}
                    >
                      <TreeItem nodeId='sections' />
                      {Object.keys(classC.sections).map(sc => {
                        const section = classC.sections[sc]

                        return (<div key={sc}>
                          <Checkbox
                            checked={Boolean(sections[sc])}
                            disabled={(sections[sc] && !sections[sc].canLeave) || !canAddClasses}
                            onChange={() => handleChange(section.classId, section.sectionId, `${classC.name} ${section.name}`)}
                            value="primary"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />{section.name}
                        </div>)
                      })}
                    </TreeItem>

                  )
                })}
              </TreeItem>
            )
          })}
        </TreeView>
      </>
    </Dialog>
  );
}


const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
      fetchClasses: userActions.fetchClasses,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddRemoveClasses));
