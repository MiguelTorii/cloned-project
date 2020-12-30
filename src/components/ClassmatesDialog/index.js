import React, { useMemo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getClassmates } from 'api/chat'
import { getReferralProgram } from 'api/referral';
import { getCampaign } from 'api/campaign';
import List from '@material-ui/core/List';
import Dialog, { dialogStyle } from 'components/Dialog';
import { ReferralInvite } from 'containers/Referrals';
import Classmate from 'components/ClassmatesDialog/Classmate'
import { decypherClass } from 'utils/crypto'

const ClassmatesDialog = ({ close, state, courseDisplayName }) => {
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

  const isExpert = useMemo(() => state === 'student', [state])

  useEffect(() => {
    const init = async () => {
      const { classId, sectionId } = decypherClass()
      if (!sectionId && !classId) return
      let res = await getClassmates({
        sectionId,
        classId
      })
      if (res) setClassmates(res)

      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);

      res = await getReferralProgram();
      setReferralProgram(res);
    }

    if (state) init()
  }, [state])

  if (!campaign) return null

  const Invite = () => {
    if (!referralProgram || !referralProgram.is_visible) return null;

    const { code, img_url: imageUrl, title, subtitle } = referralProgram;

    return (
      <div>
        <div className={classes.text}>
          Dont's see {isExpert ? 'students' : 'your classmates'}?
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
        title={isExpert ? 'Students' : `${courseDisplayName} Classmates`}
      >
        <div className={classes.text}>
          {isExpert ? 'Students' : 'Classmates'} who have joined CircleIn
        </div>
        <List className={classes.list}>
          {classmates.map(c => (
            <Classmate
              videoEnabled={videoEnabled && !isExpert}
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
