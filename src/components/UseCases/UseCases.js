/* eslint-disable jsx-a11y/click-events-have-key-events */
// @flow
import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { push as routePush } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { getCampaign } from 'api/campaign';
import withRoot from '../../withRoot';
import LoadImg from '../LoadImg/LoadImg';

import bookmarks from '../../assets/svg/bookmarks.svg';
import flashcards from '../../assets/svg/flashcards.svg';
import groupchat from '../../assets/svg/group_chat.svg';
import links from '../../assets/svg/links.svg';
import notes from '../../assets/svg/notes.svg';
import question from '../../assets/svg/questions.svg';
import reminders from '../../assets/svg/reminders.svg';
import videos from '../../assets/svg/videos.svg';
import { styles } from '../_styles/UseCases';

const UseCases = ({
  classes,
  onRedirect,
  push,
  userId
}: {
  classes: Object,
  onRedirect: Function,
  push: Function,
  userId: number
}) => {
  const [campaign, setCampaign] = useState(null);
  const organizeText = useMemo(
    () =>
      'To make life easier, we all need reminders. Setup tasks and reminders to study, to review flashcards and to review notes your classmates posted',
    []
  );

  useEffect(() => {
    const init = async () => {
      const aCampaign = await getCampaign({ campaignId: 9 });
      setCampaign(aCampaign);
    };

    init();
  }, []);

  if (!campaign) { return null; }

  const videoEnabled =
    campaign.variation_key && campaign.variation_key !== 'hidden';

  const Item = ({
    imageUrl,
    onClick,
    title,
    to
  }: {
    imageUrl: string,
    onClick: ?Function,
    title: string,
    to: ?string
  }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classes.item}
      onClick={() => {
        onRedirect();

        if (to) {
          push(to);
        } else if (onClick) {
          onClick();
        }
      }}
    >
      <div>
        <LoadImg className={classes.icon} key={imageUrl} url={imageUrl} />
      </div>
      <div className={classes.itemTitle}>{title}</div>
    </div>
  );

  const UseCase = ({
    children,
    title,
    text
  }: {
    children: Object | Array<Object>,
    text: string,
    title: string
  }) => (
    <div className={classes.useCase}>
      <div className={classes.title}>{title}</div>
      <div className={classes.text}>{text}</div>
      <div>{children}</div>
    </div>
  );

  const onClickChat = () => {
    const newChat = document.getElementById('circlein-newchat');
    if (newChat) { newChat.click(); }
  };

  return (
    <div>
      <div className={classes.row}>
        <UseCase
          title="Need Help"
          text="It feels terrible to struggle and not have immediate help. Post a question, your classmates get notified, and when you vote a student with “Best Answer”, they get 25,000 points for helping you out."
        >
          <Item
            imageUrl={question}
            title="Post a Question"
            to="/create/question"
          />
          {videoEnabled && (
            <Item
              imageUrl={videos}
              to="/video-call"
              title="Start a Chat or Group Chat"
            />
          )}
        </UseCase>
        <UseCase
          title="Group Studying or Project"
          text="CircleIn makes group projects and studying so much easier. Don’t worry if someone is down the hall or across the country"
        >
          {videoEnabled && (
            <Item
              imageUrl={videos}
              to="/video-call"
              title="Create a Video Study Session"
            />
          )}
          <Item
            imageUrl={groupchat}
            onClick={onClickChat}
            title="Start a Chat or Group Chat"
          />
          <Item
            imageUrl={links}
            title="Share a link to a file or video"
            to="/create/sharelink"
          />
        </UseCase>
      </div>
      <div className={classes.row}>
        <UseCase
          title="Get Ready for a Test"
          text="CircleIn is great for preparing for your next midterm or final exam"
        >
          <Item
            imageUrl={flashcards}
            title="Create Flashcards"
            to="/create/flashcards"
          />
          <Item imageUrl={notes} title="Upload your Notes" to="/create/notes" />
          <Item
            imageUrl={reminders}
            title="Add a task to your Workflow"
            to="/"
          />
        </UseCase>
        <UseCase title="Get Organized" text={organizeText}>
          <Item
            imageUrl={reminders}
            title="Add a task to your Workflow"
            to="/"
          />
          <Item
            imageUrl={bookmarks}
            title="View my Bookmarks"
            to={`/profile/${userId}/2`}
          />
        </UseCase>
      </div>
      <div className={classes.text2}>
        {`Send us an email with your best study tips at `}
        <a className={classes.action} href="mailto:hello@circleinapp.com">
          hello@circleinapp.com
        </a>
        !
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  userId: user.data.userId
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(withWidth()(UseCases))));
