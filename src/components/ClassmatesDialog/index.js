import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getClassmates } from 'api/chat'
import { getReferralProgram } from 'api/referral';
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

  useEffect(() => {
    const init = async () => {
      const { classId, sectionId } = decypherClass()
      if (!sectionId && !classId) return
      let res = await getClassmates({
        sectionId,
        classId
      })
      if (res) setClassmates(res)

      res = await getReferralProgram();
      setReferralProgram(res);
    }

    if (state) init()
  }, [state])

  const Invite = () => {
    if (!referralProgram || !referralProgram.is_visible) return null;

    const { code, img_url: imageUrl, title, subtitle } = referralProgram;

    return (
      <div>
        <div className={classes.text}>
          Dont's see your classmates?
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

  return (
    <div>
      <Dialog
        className={classes.dialog}
        onCancel={close}
        open={state}
        title={`${courseDisplayName} Classmates`}
      >
        <div className={classes.text}>
          Classmates who have joined CircleIn
        </div>
        <List className={classes.list}>
          {classmates.map(c => <Classmate close={close} key={c.userId} classmate={c} />)}
          <Invite />
        </List>
      </Dialog>
    </div>
  );
}

export default ClassmatesDialog
