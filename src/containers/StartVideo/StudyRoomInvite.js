/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getClassmates } from 'api/chat';
import { getCampaign } from 'api/campaign';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import Dialog from 'components/Dialog';
import Classmate from './Classmate';
import useStyles from './_styles/StudyRoomInvite';

const StudyRoomInvite = ({
  open,
  userId,
  channel,
  groupUsers,
  classList,
  handleClose,
  handleInvite,
  handleStart,
  ...props
}) => {
  const classes = useStyles();

  const [searchKey, setSearchKey] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [classmates, setClassmates] = useState([]);

  useEffect(() => {
    const initSelectedClassesClassmates = async () => {
      const students = {};
      await Promise.all(
        classList.map(async (selectedClass) => {
          const classmates = await getClassmates({
            sectionId: selectedClass.section[0].sectionId,
            classId: selectedClass.classId
          });
          classmates.forEach((classmate) => {
            const classes = students[classmate.userId]
              ? students[classmate.userId].classes
              : [];
            students[classmate.userId] = {
              ...classmate,
              classes: [...classes, selectedClass]
            };
          });
        })
      );

      const res = Object.values(students);
      const classmates = res.filter(
        (classmate) => Number(classmate.userId) !== Number(userId)
      );
      setClassmates(classmates);
    };

    if (classList.length > 0) {
      initSelectedClassesClassmates();
    }
  }, [classList.length, classList, userId]);

  useEffect(() => {
    const init = async () => {
      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);
    };

    init();
  }, []);

  const visiabled = useMemo(() => {
    return campaign?.variation_key && campaign?.variation_key !== 'hidden';
  }, [campaign]);

  const handleChange = useCallback(
    (e) => {
      setSearchKey(e.target.value.toLowerCase());
    },
    [setSearchKey]
  );

  const filterClassmates = () => {
    if (!searchKey) {
      return classmates;
    }

    return classmates.filter((classmate) => {
      const name = `${classmate.firstName} ${classmate.lastName}`.toLowerCase();
      return name.includes(searchKey);
    });
  };

  const filteredClassmates = filterClassmates();

  return (
    <div>
      <Dialog
        className={classes.dialog}
        onCancel={handleClose}
        maxWidth="sm"
        fullWidth
        open={open && visiabled}
        title="Invite to Study Room"
      >
        <div className={classes.searchWrapper}>
          <FormControl classes={{ root: classes.searchInput }} fullWidth>
            <Input
              id="search-classmates"
              placeholder="Search for classmates"
              value={searchKey}
              startAdornment={<SearchIcon position="start" />}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            variant="contained"
            className={
              groupUsers.length === 0 ? classes.disabled : classes.headToRoom
            }
            startIcon={<VideocamRoundedIcon />}
            onClick={handleStart}
          >
            Head to Room
          </Button>
        </div>
        <List className={classes.list}>
          {filteredClassmates.map((classmate) => {
            const isInvited = groupUsers.some(
              (user) => Number(user.userId) === Number(classmate.userId)
            );

            return (
              <Classmate
                videoEnabled
                isInvited={isInvited}
                key={classmate.userId}
                classmate={classmate}
                handleInvite={handleInvite}
              />
            );
          })}
        </List>
      </Dialog>
    </div>
  );
};

export default StudyRoomInvite;
