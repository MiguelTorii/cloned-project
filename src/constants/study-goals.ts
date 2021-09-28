import { ReactComponent as IconPostsThanked } from 'assets/svg/study-goals-posts-thanked.svg';
import { ReactComponent as IconStudentsHelped } from 'assets/svg/study-goals-students-helped.svg';
import { ReactComponent as IconRoomsJoined } from 'assets/svg/study-goals-rooms-joined.svg';
import { ReactComponent as IconCompletedTasks } from 'assets/svg/study-goals-completed-tasks.svg';
import { ReactComponent as IconResourcesShared } from 'assets/svg/study-goals-resources-shared.svg';
import { ReactComponent as IconNotesCreated } from 'assets/svg/study-goals-notes-created.svg';
import { ReactComponent as IconDecksReviewed } from 'assets/svg/study-goals-decks-reviewed.svg';
import { ReactComponent as IconMessagesSent } from 'assets/svg/study-goals-messages-sent.svg';
import { ReactComponent as IconNotesShared } from 'assets/svg/study-goals-notes-shared.svg';
import { ReactComponent as IconDecksCreated } from 'assets/svg/study-goals-decks-created.svg';
import React from 'react';

export default [
  {
    id: 1,
    title: 'Posts Thanked',
    description: (
      <>
        <b>Thank</b> a classmate’s post on your <b>Class Feeds</b> if you found their post to be
        useful. This lets your classmates know you appreciate them!
      </>
    ),
    icon: IconPostsThanked
  },
  {
    id: 2,
    title: 'Students Helped',
    description: (
      <>
        Ask a question or answer a question on your <b>Class Feeds</b>. Both of these count towards
        helping your fellow classmates!
      </>
    ),
    icon: IconStudentsHelped
  },
  {
    id: 3,
    title: 'Study Rooms Joined',
    description: (
      <>
        Start or join a <b>Study Room</b> with your peers. This is a great way to collaborate and
        tackle difficult problems with classmates!
      </>
    ),
    icon: IconRoomsJoined
  },
  {
    id: 4,
    title: 'Completed Tasks',
    description: (
      <>
        Create and complete tasks on Workflow. A task is completed when the status is changed to{' '}
        <b>Done</b>. Tasks can help you stay organized!
      </>
    ),
    icon: IconCompletedTasks
  },
  {
    id: 5,
    title: 'Resources Shared',
    description: (
      <>
        Share valuable resources you come across on your <b>Class Feeds</b>. This helps your
        classmates learn and understand new topics!
      </>
    ),
    icon: IconResourcesShared
  },
  {
    id: 6,
    title: 'Notes Created',
    description: (
      <>
        Create a <b>new page</b> of notes for any of your classes. Notes are a great way to solidify
        your understanding of new topics!
      </>
    ),
    icon: IconNotesCreated
  },
  {
    id: 7,
    title: 'Decks Reviewed',
    description: (
      <>
        Review an entire flashcard deck using <b>Review Time</b>, <b>Quiz Yourself</b>, or{' '}
        <b>Match Magic</b>. This is a great way to study for upcoming exams!
      </>
    ),
    icon: IconDecksReviewed
  },
  {
    id: 8,
    title: 'Messages Sent',
    description: (
      <>
        Send a <b>direct message</b> to different peers and group chats. You can use the Chat
        feature to collaborate and get to know your peers!
      </>
    ),
    icon: IconMessagesSent
  },
  {
    id: 9,
    title: 'Decks Created',
    description: (
      <>
        Create a <b>new flashcard deck</b> with at least <b>3 flashcards</b>. The action of creating
        flashcards can help you grasp new topics!
      </>
    ),
    icon: IconDecksCreated
  },
  {
    id: 10,
    title: 'Notes Shared',
    description: (
      <>
        Share notes you created this week on your <b>Class Feeds</b>. Your notes can be a valuable
        resource to your classmates as well!
      </>
    ),
    icon: IconNotesShared
  }
];
