import React from 'react';
import { useDispatch } from 'react-redux';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import { useStyles } from './AboutMeSubareaStyles';

type Props = {
  userIdToDisplay: string;
  from: string;
  canEdit: boolean;
};

const AboutMeSubarea = ({ userIdToDisplay, from, canEdit }: Props) => {
  const classes: any = useStyles();

  return (
    <Profile
      userId={userIdToDisplay}
      edit={canEdit}
      from={from}
      defaultPage={PROFILE_PAGES.index}
    />
  );
};

export default AboutMeSubarea;
