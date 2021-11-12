/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import { getCampaign } from '../../api/campaign';
import { getClassmates } from '../../api/chat';
import Dialog from '../../components/Dialog/Dialog';
import LoadingImg from '../../assets/svg/astro-shuttle.svg';
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
}: {
  open?: any;
  userId?: any;
  channel?: any;
  groupUsers?: any;
  classList?: any;
  handleClose?: any;
  handleInvite?: any;
  handleStart?: any;
}) => {
  const classes: any = useStyles();
  const [searchKey, setSearchKey] = useState('');
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const initSelectedClassesClassmates = async () => {
      setLoading(true);
      const students = {};
      await Promise.all(
        classList.map(async (selectedClass) => {
          const classmates = await getClassmates({
            sectionId: selectedClass.section?.[0]?.sectionId,
            classId: selectedClass.classId
          });
          classmates.forEach((classmate) => {
            const classes = students[classmate.userId] ? students[classmate.userId].classes : [];
            students[classmate.userId] = { ...classmate, classes: [...classes, selectedClass] };
          });
        })
      );
      const res = Object.values(students);
      const classmates = res.filter(
        (classmate: any) => Number(classmate.userId) !== Number(userId)
      );
      setClassmates(classmates);
      setLoading(false);
    };

    if (classList.length > 0) {
      initSelectedClassesClassmates();
    }
  }, [classList.length, classList, userId]);

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
        open={open}
        title="Invite to Study Room"
      >
        <div className={classes.searchWrapper}>
          <FormControl
            classes={{
              root: classes.searchInput
            }}
            fullWidth
          >
            <Input
              id="search-classmates"
              placeholder="Search for classmates"
              value={searchKey}
              startAdornment={<SearchIcon />}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            variant="contained"
            className={groupUsers.length === 0 ? classes.disabled : classes.headToRoom}
            startIcon={<VideocamRoundedIcon />}
            onClick={handleStart}
          >
            Head to Room
          </Button>
        </div>

        {loading ? (
          <div className={classes.loadingScreen}>
            <img className={classes.img} src={LoadingImg} alt="study room chat" />
            <div className={classes.text1}>Finding your classmates...</div>
            <div className={classes.text2}>
              Sit tight! We’re searching high and low to generate a list for you.
            </div>
          </div>
        ) : (
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
        )}
      </Dialog>
    </div>
  );
};

export default StudyRoomInvite;
