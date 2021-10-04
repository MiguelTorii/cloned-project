import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import Typography from "@material-ui/core/Typography";
import { getReferralStatus } from "../../api/referral";

const styles = () => ({
  row: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 14,
    justifyContent: 'space-between',
    margin: '0px 20px'
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center'
  }
});

const Status = ({
  classes
}: {
  classes: Record<string, any>;
}) => {
  const [referralStatus, setReferralStatus] = useState(null);
  useEffect(() => {
    const init = async () => {
      const result = await getReferralStatus();

      if (result) {
        setReferralStatus(result);
      }
    };

    init();
  }, []);

  if (!referralStatus) {
    return <div>Loading...</div>;
  }

  const {
    subtitle,
    users
  } = referralStatus;
  return <div className={classes.body}>
      <Typography className={classes.subtitle}>
        {subtitle.split('\n').map(item => <span key={Math.random()}>
            {item}
            <br />
          </span>)}
      </Typography>
      {users.map((user, index) => <div key={user.id} className={classes.row}>
          <div>{`${index + 1}. ${user.name}`}</div>
          <div>
            <DoneIcon style={{
          fill: '#60b515'
        }} />
          </div>
        </div>)}
    </div>;
};

export default withStyles(styles)(Status);