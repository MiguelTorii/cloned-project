import React, { useCallback, useMemo, useState } from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import type { FeedItem } from '../../types/models';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import pluralize from 'pluralize';
import ActionBar from './ActionBar';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { animations } from 'react-animation';
import { bookmarkFlashcards } from '../../actions/user';
import clsx from 'clsx';
import ShareLinkModal from '../ShareLinkModal';
import { APP_ROOT_PATH } from '../../constants/app';
import moment from 'moment';

type Props = {
  data: FeedItem
};

const FlashcardsDeck = ({ data }: Props) => {
  // Hooks
  const classes = useStyles();
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.user.userClasses.classList);
  const me = useSelector((state) => state.user.data);

  // States
  const [isHover, setIsHover] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);

  // Memos
  const deckClass = useMemo(() => {
    return classList.find((item) => item.classId === data.class_id);
  }, [data, classList]);

  const deckLink = useMemo(() => {
    return `${APP_ROOT_PATH}/flashcards/${data.feed_id}`;
  }, [data]);

  const shareLinkModalTitle = useMemo(() => (
    <Typography variant="h6">
      <span role="img" aria-label="Two hands">🙌</span>
      &nbsp; You’re awesome for helping your peers! Ready to share a link to your <b>{ data.title }</b> deck?
    </Typography>
  ), [data]);

  // Callbacks
  const handleBookmark = useCallback(() => {
    dispatch(
      bookmarkFlashcards(me.userId, data.feed_id, data.bookmarked)
    );
  }, [data, me, dispatch]);

  const handleView = useCallback(() => {

  }, []);

  const handleShareLink = useCallback(() => {
    setIsShareLinkModalOpen(true);
  }, []);

  const handleReportIssue = useCallback(() => {

  }, []);

  const handleCloseShareLinkModal = useCallback(() => {
    setIsShareLinkModalOpen(false);
  }, [setIsShareLinkModalOpen]);

  // Rendering
  return (
    <div
     className={classes.root}
     onMouseEnter={() => setIsHover(true)}
     onMouseLeave={() => setIsHover(false)}
    >
      <div className={classes.contentContainer}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <div>
            <Typography variant="h6">
              { _.truncate(_.capitalize(data.title), { length: 50 }) }
            </Typography>
            <Typography variant="body2" className={classes.subtitle}>
              { pluralize('flashcard', data.deck.length, true) }
              &nbsp; • &nbsp;
              updated { moment(data.created).fromNow() }
            </Typography>
          </div>
          <div>
            {
              deckClass &&
                <Chip
                  label={_.truncate(deckClass.className, { length: 25 })}
                  size="small"
                  style={{
                    backgroundColor: deckClass.bgColor,
                    color: 'white'
                  }}
                />
            }
            <div
              className={clsx(
                !isHover && classes.hidden
              )}
              style={{ animation: animations.fadeIn }}
            >
              <ActionBar
                bookmarked={data.bookmarked}
                onViewEdit={handleView}
                onBookmark={handleBookmark}
                onShareLink={handleShareLink}
                onReportIssue={handleReportIssue}
              />
            </div>
          </div>
        </Box>
        <ShareLinkModal
          open={isShareLinkModalOpen}
          link={deckLink}
          title={shareLinkModalTitle}
          onClose={handleCloseShareLinkModal}
        />
      </div>
    </div>
  );
};

export default withRoot(FlashcardsDeck);
