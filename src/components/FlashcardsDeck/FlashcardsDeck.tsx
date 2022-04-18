import React, { useCallback, useMemo, useState } from 'react';

import cx from 'classnames';
import clsx from 'clsx';
import { push } from 'connected-react-router';
import capitalize from 'lodash/capitalize';
import truncate from 'lodash/truncate';
import moment from 'moment';
import pluralize from 'pluralize';
import { animations } from 'react-animation';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { APP_ROOT_PATH } from 'constants/app';

import { bookmarkFlashcards, deleteFlashcard } from 'actions/user';
import withRoot from 'withRoot';

import Dialog from '../Dialog/Dialog';
import ShareLinkModal from '../ShareLinkModal/ShareLinkModal';

import ActionBar from './ActionBar';
import useStyles from './styles';

import type { TFeedItem } from 'types/models';

type Props = {
  data: TFeedItem;
};

const FlashcardsDeck = ({ data }: Props) => {
  // Hooks
  const classes: any = useStyles();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const classList = useSelector((state) => (state as any).user.userClasses.classList);
  const me = useSelector((state) => (state as any).user.data);
  // States
  const [isHover, setIsHover] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Memos
  const deckClass = useMemo(
    () => classList.find((item) => item.classId === data.classId),
    [data, classList]
  );
  const deckLink = useMemo(() => `${APP_ROOT_PATH}/flashcards/${data.postId}`, [data]);
  const shareLinkModalTitle = useMemo(
    () => (
      <Typography variant="h6">
        <span role="img" aria-label="Two hands">
          🙌
        </span>
        &nbsp; You’re awesome for helping your peers! Ready to share a link to your{' '}
        <b>{data.title}</b> deck?
      </Typography>
    ),
    [data]
  );
  // Callbacks
  const handleBookmark = useCallback(() => {
    dispatch(bookmarkFlashcards(me.userId, data.feedId, data.bookmarked));
  }, [data, me, dispatch]);
  const handleView = useCallback(() => {
    dispatch(push(`/flashcards/${data.postId}?source=deck`));
  }, [dispatch, data]);
  const handleShareLink = useCallback(() => {
    setIsShareLinkModalOpen(true);
  }, []);
  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    dispatch(deleteFlashcard(me.userId, data.feedId));
  }, [me, data, dispatch]);
  const handleOpenDeleteModal = useCallback(() => setIsDeleteModalOpen(true), []);
  const handleCloseDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);
  const handleCloseShareLinkModal = useCallback(() => {
    setIsShareLinkModalOpen(false);
  }, [setIsShareLinkModalOpen]);
  const handleClickActionBar = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const isOwn = () => {
    const dataUserId: string = data.userId ? String(data.userId) : '';
    return me.userId === dataUserId;
  };

  // Rendering
  return (
    <div
      className={cx(classes.root, search.includes('past') && classes.pastClassRoot)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={classes.contentContainer}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          onClick={handleView}
        >
          <div>
            <Typography variant="h6" className={classes.title}>
              {truncate(capitalize(data.title), {
                length: 50
              })}
            </Typography>
            <Typography variant="body2" className={classes.subtitle}>
              {pluralize('flashcard', data.deckCount, true)}
              &nbsp; • &nbsp; updated {moment(data.created).fromNow()}
            </Typography>
          </div>
          <div>
            {deckClass && (
              <Chip
                label={truncate(deckClass.className, {
                  length: 25
                })}
                size="small"
                style={{
                  backgroundColor: deckClass.bgColor,
                  color: 'white'
                }}
              />
            )}
            <div
              aria-hidden="true"
              className={clsx(!isHover && classes.hidden)}
              style={{
                animation: animations.fadeIn
              }}
              onClick={handleClickActionBar}
            >
              <ActionBar
                isOwn={isOwn()}
                bookmarked={data.bookmarked}
                onViewEdit={handleView}
                onBookmark={handleBookmark}
                onShareLink={handleShareLink}
                onDelete={handleOpenDeleteModal}
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
        <Dialog
          className={classes.deleteModal}
          open={isDeleteModalOpen}
          title="Delete Flashcard Deck"
          onCancel={handleCloseDeleteModal}
        >
          <Typography variant="h6">
            Are you sure you want to delete this flashcard deck? If you delete this deck, it will
            deleted from your created decks.
          </Typography>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button className={classes.deleteButton} onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Dialog>
      </div>
    </div>
  );
};

export default withRoot(FlashcardsDeck);
