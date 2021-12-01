import React from 'react';
import { useDispatch } from 'react-redux';
import Profile, { PROFILE_PAGES } from '../../containers/Profile/Profile';
import { useStyles } from './AboutMeSubareaStyles';
import TransparentButton from '../../components/Basic/Buttons/TransparentButton';
import { signOut } from '../../actions/sign-in';

type Props = {
  userIdToDisplay: string;
  from: string;
  canEdit: boolean;
};

const AboutMeSubarea = ({ userIdToDisplay, from, canEdit }: Props) => {
  const classes: any = useStyles();

  return (
    <div className={classes.container}>
      <Profile
        userId={userIdToDisplay}
        edit={canEdit}
        from={from}
        defaultPage={PROFILE_PAGES.index}
        isHud
      />
    </div>
  );
};

export default AboutMeSubarea;
