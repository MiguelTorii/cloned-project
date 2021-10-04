import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getReferralProgram } from "api/referral";
import Invite from "./Invite";

const styles = () => ({
  body: {
    padding: 16,
    width: '100%'
  },
  button: {
    width: '100%'
  },
  text: {
    margin: '10px 0px'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center'
  }
});

const CTA = ({
  classes
}: {
  classes: Record<string, any>;
}) => {
  const [inviteVisible, setInviteVisible] = useState(false);
  const [referralProgram, setReferralProgram] = useState(null);
  useEffect(() => {
    const init = async () => {
      const result = await getReferralProgram();

      if (result) {
        setReferralProgram(result);
      }
    };

    init();
  }, []);

  if (!referralProgram || !referralProgram.is_visible) {
    return null;
  }

  const {
    code,
    cta,
    cta_body: ctaBody,
    cta_title: ctaTitle,
    img_url: imageUrl,
    title,
    subtitle
  } = referralProgram;
  return <div className={classes.body}>
      <Typography className={classes.title}>{ctaTitle}</Typography>
      <Typography className={classes.text}>
        {ctaBody.split('\n').map(item => <span key={Math.random()}>
            {item}
            <br />
          </span>)}
      </Typography>
      <Button className={classes.button} color="primary" onClick={() => setInviteVisible(true)} variant="contained">
        {cta}
      </Button>
      <Invite onHide={() => setInviteVisible(false)} referralData={{
      code,
      imageUrl,
      subtitle,
      title
    }} visible={inviteVisible} />
    </div>;
};

export default withRouter(withStyles(styles)(CTA));