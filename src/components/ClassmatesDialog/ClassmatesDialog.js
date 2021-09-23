/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react';
import { getClassmates } from 'api/chat';
import { getReferralProgram } from 'api/referral';
import { getCampaign } from 'api/campaign';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Dialog from 'components/Dialog/Dialog';
import ReferralInvite from 'containers/Referrals/Invite';
import Classmate from 'components/ClassmatesDialog/Classmate';
import { decypherClass } from 'utils/crypto';
import { useStyles } from '../_styles/ClassmatesDialog/index';

const ClassmatesDialog = ({
  meetingInvite = false,
  userId,
  userClasses,
  expertMode,
  close,
  state,
  courseDisplayName,
  selectedClasses
}) => {
  const classes = useStyles();

  const [classmates, setClassmates] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [inviteVisible, setInviteVisible] = useState(false);
  const [referralProgram, setReferralProgram] = useState(null);
  const [campaign, setCampaign] = useState(null);

  const title = useMemo(
    () => (meetingInvite ? 'Invite To Study Room' : expertMode ? 'Students' : 'Classmates'),
    [expertMode, meetingInvite]
  );

  useEffect(() => {
    const initClassmates = async () => {
      const { classId, sectionId } = decypherClass();
      if (!sectionId && !classId) {
        return;
      }
      const res = await getClassmates({
        sectionId,
        classId
      });
      if (res) {
        const classmates = res.filter((r) => Number(r.userId) !== Number(userId));
        setClassmates(classmates);
      }
    };

    const initStudents = async () => {
      const { classId, sectionId } = decypherClass();
      if (!sectionId && !classId) {
        return;
      }
      const res = await getClassmates({
        sectionId,
        classId
      });
      if (res) {
        const classmates = res.filter((classmate) => Number(classmate.userId) !== Number(userId));
        setClassmates(classmates);
      }
    };

    const initSelectedClassesClassmates = async () => {
      const students = {};
      await Promise.all(
        selectedClasses.map(async (selectedClass) => {
          const classmates = await getClassmates({
            sectionId: selectedClass.sectionId,
            classId: selectedClass.classId
          });
          classmates.forEach((classmate) => {
            const classes = students[classmate.userId] ? students[classmate.userId].classes : [];
            students[classmate.userId] = {
              ...classmate,
              classes: [...classes, selectedClass]
            };
          });
        })
      );

      const res = Object.values(students);
      const classmates = res.filter((classmate) => Number(classmate.userId) !== Number(userId));
      setClassmates(classmates);
    };

    const init = async () => {
      if (selectedClasses.length > 0) {
        initSelectedClassesClassmates();
      } else if (state === 'classmate') {
        initClassmates();
      } else {
        initStudents();
      }

      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);

      const res = await getReferralProgram();
      setReferralProgram(res);
    };

    if (state && !searchKey) {
      init();
    }
  }, [searchKey, selectedClasses, selectedClasses.length, state, userClasses, userId]);

  if (!campaign) {
    return null;
  }

  const Invite = () => {
    if (!referralProgram || !referralProgram.is_visible) {
      return null;
    }

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
    );
  };

  const videoEnabled = campaign.variation_key && campaign.variation_key !== 'hidden';

  const handleChange = (e) => {
    const currentClassMates = [...classmates];
    setSearchKey(e.target.value);
    if (e.target.value) {
      const filterClassmates = currentClassMates.filter((classmate) =>
        `${classmate.firstName} ${classmate.lastName}`.includes(e.target.value)
      );
      setClassmates(filterClassmates);
    }
  };

  const handleCloseModal = () => {
    setSearchKey('');
    close();
  };

  return (
    <div>
      <Dialog
        className={classes.dialog}
        onCancel={handleCloseModal}
        maxWidth="md"
        fullWidth
        contentClassName={classes.contentClassName}
        open={Boolean(state)}
        title={title}
      >
        {!meetingInvite && <div className={classes.courseDisplayName}>{courseDisplayName}</div>}
        <FormControl classes={{ root: classes.searchInput }} fullWidth>
          <Input
            id="search-classmates"
            placeholder="Search for classmates"
            value={searchKey}
            onChange={handleChange}
            startAdornment={<SearchIcon position="start" />}
          />
        </FormControl>
        <List className={classes.list}>
          {classmates.map((c) => (
            <Classmate
              meetingInvite={meetingInvite}
              courseDisplayName={courseDisplayName}
              videoEnabled={meetingInvite ? videoEnabled : videoEnabled && !expertMode}
              key={c.userId}
              classmate={c}
            />
          ))}
          <Invite />
        </List>
      </Dialog>
    </div>
  );
};

export default ClassmatesDialog;
