// @flow

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ClassCard from 'containers/ClassesGrid/ClassCard'
import { bindActionCreators } from 'redux'
import { push } from 'connected-react-router';
import {
  leaveUserClass,
} from 'api/user'
import OnboardingList from 'components/OnboardingList';
import AddRemoveClasses from 'components/AddRemoveClasses';
import Empty from 'containers/ClassesGrid/Empty'
import { cypher } from 'utils/crypto'
import withRoot from '../../withRoot';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import * as userActions from '../../actions/user'
import * as feedActions from '../../actions/feed'

const styles = theme => ({
  item: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(4),
    fontWeight: 'bold'
  },
  container: {
    marginTop: theme.spacing(),
    padding: theme.spacing(),
  }
});

type Props = {
  classes: Object,
  fetchClasses: Function,
  // campaign: CampaignState,
  user: UserState,
  pushTo: Function,
  clearFeeds: Function
};

const Classes = ({ pushTo, fetchClasses, clearFeeds, classes, user }: Props) => {
  const [classList, setClassList] = useState(null)
  const [canAddClasses, setCanAddClasses] = useState(false)
  const [openAddClasses, setOpenAddClasses] = useState(false)
  const [emptyLogo, setEmptyLogo] = useState('')
  const [emptyVisibility, setEmptyVisibility] = useState(false)
  const [emptyBody, setEmptyBody] = useState('')

  const handleLeaveClass = useCallback(async ({ sectionId, classId, userId }) => {
    await leaveUserClass({
      sectionId,
      classId,
      userId
    })
    fetchClasses(true)
  }, [fetchClasses])

  useEffect(() => {
    const init = async () => {
      fetchClasses(true)
    }

    init()
  }, [fetchClasses])

  useEffect(() => {
    const init = async () => {
      try {
        const {
          userClasses: { classList, canAddClasses, emptyState }
        } = user

        if (emptyState && emptyState.visibility) {
          const {
            visibility,
            logo,
            body
          } = emptyState
          setEmptyLogo(logo)
          setEmptyBody(body)
          setEmptyVisibility(visibility)
        }

        if (classList) {
          setClassList(
            classList.map(cl => {
              const classesInter = cl.section.map(s => ({
                sectionDisplayName: s.sectionDisplayName,
                instructorDisplayName: s.instructorDisplayName,
                sectionId: s.sectionId,
                classId: cl.classId,
                courseDisplayName: cl.courseDisplayName,
                bgColor: cl.bgColor,
                handleLeaveClass: () => handleLeaveClass({
                  sectionId: s.sectionId,
                  classId: cl.classId,
                  userId: String(user.data.userId)
                }),
                canLeave: cl.permissions.canLeave
              }))
              if (classesInter.length > 0) return classesInter[0]
              return null
            })
          )
          setCanAddClasses(canAddClasses)
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    init()
  }, [handleLeaveClass, user])

  const navigate = useCallback(({ courseDisplayName, sectionId, classId }) => {
    document.title = courseDisplayName
    clearFeeds();
    pushTo(`/feed?class=${cypher(`${classId}:${sectionId}`)}`)
  }, [pushTo, clearFeeds])

  const hasClasses = useMemo(() => classList && classList.length > 0, [classList])

  return (
    <Grid
      justify={hasClasses ? "flex-start" : "center"}
      className={classes.container}
      container
      spacing={2}
    >
      <Grid item xs={12} md={12}>
        <OnboardingList />
      </Grid>
      <AddRemoveClasses
        open={openAddClasses}
        onClose={() => setOpenAddClasses(false)}
      />
      {classList && classList.map(cl => cl && (
        <Grid key={cl.sectionId} item xs={12} md={4} className={classes.item}>
          <ClassCard
            sectionDisplayName={cl.sectionDisplayName}
            instructorDisplayName={cl.instructorDisplayName}
            courseDisplayName={cl.courseDisplayName}
            bgColor={cl.bgColor}
            canLeave={cl.canLeave}
            handleLeaveClass={cl.handleLeaveClass}
            navigate={() => navigate({ ...cl })}
          />
        </Grid>
      ))}
      {canAddClasses && <Grid item xs={12} className={classes.item}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => setOpenAddClasses(true)}
          color="primary"
        >
          + Add More Classes
        </Button>
      </Grid>}
      {emptyVisibility &&
        <Grid container justify='center' item xs={12}>
          <Grid item xs={12} md={9}>
            <Empty
              logo={emptyLogo}
              body={emptyBody}
            />
          </Grid>
        </Grid>}
    </Grid>
  );
}

const mapStateToProps = ({ user, campaign }: StoreState): {} => ({
  campaign,
  user
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      fetchClasses: userActions.fetchClasses,
      clearFeeds: feedActions.clearFeeds,
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(withWidth()(Classes))));

