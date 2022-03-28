import React, { useEffect, useState } from 'react';

import uuidv4 from 'uuid/v4';

import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { apiGetInviteLink, apiGetRefereeList } from 'api/user';
import LoadingSpin from 'components/LoadingSpin';
import ShareLinkWidget from 'components/ShareLinkWidget';

import { useStyles } from './styles';

import type { RefereeList } from 'types/models';

const RefereeListCard = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [refereeList, setRefereeList] = useState<RefereeList>([]);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    (async function () {
      setIsLoading(true);

      const { referees } = await apiGetRefereeList();
      setRefereeList(referees);

      const { referral_link } = await apiGetInviteLink();
      setReferralLink(referral_link);

      setIsLoading(false);
    })();
  }, []);

  return (
    <Box mt={5}>
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Referee List</Typography>
            {refereeList.map((referee) => (
              <Paper key={uuidv4()} className={classes.refereeItem}>
                <Typography>{referee}</Typography>
              </Paper>
            ))}
            <ShareLinkWidget shareLink={referralLink} headerText="" />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default RefereeListCard;
