import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import type { State as StoreState } from '../../types/state';
import ShareLinkModal from '../../components/ShareLinkModal/ShareLinkModal';
import { apiGetCommunityShareLink } from '../../api/chat';

type Props = {
  open: boolean;
  onClose: () => void;
};

const CommunityShareLinkModal = ({ open, onClose }: Props) => {
  const [link, setLink] = useState('');
  const currentCommunity = useSelector((state: StoreState) => state.chat.data.currentCommunity);

  useEffect(() => {
    if (!open || !currentCommunity) {
      return;
    }

    const func = async () => {
      const data = await apiGetCommunityShareLink(currentCommunity.id);
      setLink(data?.url);
    };

    func();
  }, [currentCommunity, open]);

  if (!currentCommunity) {
    return null;
  }

  return (
    <ShareLinkModal
      open={open}
      onClose={onClose}
      link={link}
      title={
        <Typography variant="body1">
          <span role="img" aria-label="Two hands">
            🙌
          </span>{' '}
          &nbsp; Need to invite a student to this chat? Invite them to your{' '}
          <b>{currentCommunity.name}</b> chat by sharing the following link.
        </Typography>
      }
    />
  );
};

CommunityShareLinkModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

CommunityShareLinkModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default CommunityShareLinkModal;
