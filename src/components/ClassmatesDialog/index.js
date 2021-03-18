import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getClassmates } from 'api/chat'
import { getReferralProgram } from 'api/referral';
import { getCampaign } from 'api/campaign';
import List from '@material-ui/core/List';
import Dialog, { dialogStyle } from 'components/Dialog';
import { ReferralInvite } from 'containers/Referrals';
import Classmate from 'components/ClassmatesDialog/Classmate'
import { decypherClass } from 'utils/crypto'

const ClassmatesDialog = ({
  userId,
  userClasses,
  expertMode,
  close,
  state,
  courseDisplayName,
  selectedClasses
}) => {
  const classes = makeStyles(theme => ({
    dialog: {
      ...dialogStyle,
      height: 700
    },
    link: {
      color: theme.circleIn.palette.action,
      cursor: 'pointer',
      display: 'inline',
      paddingLeft: 3
    },
    list: {
      overflowY: 'scroll'
    },
    text: {
      padding: '16px 8px',
    }
  }))()

  const [classmates, setClassmates] = useState([])
  const [inviteVisible, setInviteVisible] = useState(false);
  const [referralProgram, setReferralProgram] = useState(null);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const initClassmates = async () => {
      const { classId, sectionId } = decypherClass()
      if (!sectionId && !classId) return
      const res = await getClassmates({
        sectionId,
        classId
      })
      if (res) {
        const classmates = res.filter(r => Number(r.userId) !== Number(userId))
        setClassmates(classmates)
      }
    }

    const initStudents = async () => {
      const { classId, sectionId } = decypherClass()
      if (!sectionId && !classId) return
      const res = await getClassmates({
        sectionId,
        classId
      })
      if (res) {
        const classmates = res.filter(classmate => Number(classmate.userId) !== Number(userId))
        setClassmates(classmates)
      }
    }

    const initSelectedClassesClassmates = async () => {
      const students = {}
      await Promise.all(selectedClasses.map(async selectedClass => {
        const classmates = await getClassmates({
          sectionId: selectedClass.sectionId,
          classId: selectedClass.classId
        })
        classmates.forEach(classmate => {
          students[classmate.userId] = classmate
        })
      }))

      const res = Object.values(students)
      const classmates = res.filter(classmate => Number(classmate.userId) !== Number(userId))
      setClassmates(classmates)
    }

    const init = async () => {
      if (selectedClasses.length > 0) {
        initSelectedClassesClassmates()
      }
      else if (state === 'classmate') initClassmates()
      else initStudents()

      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);

      const res = await getReferralProgram();
      setReferralProgram(res);
    }

    if (state) init()
  }, [selectedClasses, selectedClasses.length, state, userClasses, userId])

  if (!campaign) return null

  const Invite = () => {
    if (!referralProgram || !referralProgram.is_visible) return null;

    const { code, img_url: imageUrl, title, subtitle } = referralProgram;

    return (
      <div>
        <div className={classes.text}>
          Dont's see {expertMode ? 'students' : 'your classmates'}?
          <div
            className={classes.link}
            onClick={() => {
              setInviteVisible(true);
            }}
            onKeyPress={() => setInviteVisible(true)}
            role="button"
            tabIndex="0"
          >
            Invite them and earn your first gift
          </div>
        </div>
        <ReferralInvite
          onHide={() => setInviteVisible(false)}
          referralData={{ code, imageUrl, subtitle, title }}
          visible={inviteVisible}
        />
      </div>
    )
  }

  const videoEnabled = (campaign.variation_key && campaign.variation_key !== 'hidden');

  return (
    <div>
      <Dialog
        className={classes.dialog}
        onCancel={close}
        maxWidth='sm'
        fullWidth
        open={Boolean(state)}
        title={expertMode ? 'Students' : `${courseDisplayName} Classmates`}
      >
        <div className={classes.text}>
          {expertMode ? 'Students' : 'Classmates'} who have joined CircleIn
        </div>
        <List className={classes.list}>
          {classmates.map(c => (
            <Classmate
              videoEnabled={videoEnabled && !expertMode}
              close={close}
              key={c.userId}
              classmate={c}
            />
          ))}
          <Invite />
        </List>
      </Dialog>
    </div>
  );
}

export default ClassmatesDialog
