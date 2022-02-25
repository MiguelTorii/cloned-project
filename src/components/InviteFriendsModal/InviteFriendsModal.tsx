import React, { useEffect, useState } from 'react';

import { Typography } from '@material-ui/core';

import ShareLinkModal from 'components/ShareLinkModal/ShareLinkModal';
import { apiGetInviteLink } from 'api/user';

type Props = {
  open: boolean;
  onClose: () => void;
};

const InviteFriendsModal = ({ open, onClose }: Props) => {
  const [link, setLink] = useState(null);

  const fetchInviteLink = () => {
    apiGetInviteLink().then(({ referral_link }) => setLink(referral_link));
  };

  // Fetch an invite link whenever modal is open
  useEffect(() => {
    if (open) {
      fetchInviteLink();
    }
  }, [open]);

  return (
    <ShareLinkModal
      open={open}
      onClose={onClose}
      title={
        <Typography variant="h6">
          Share the link below with your friends to invite them to CircleIn.
        </Typography>
      }
      link={link}
    />
  );
};

export default InviteFriendsModal;
