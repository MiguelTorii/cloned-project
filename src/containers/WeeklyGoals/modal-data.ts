import React from 'react';
import ImageMidLessThan50 from 'assets/gif/study-goal-mid-less-than-50.gif';
import ImageMidLessThan100 from 'assets/gif/study-goal-mid-less-than-100.gif';
import ImageMid100 from 'assets/gif/study-goal-mid-100.gif';
import ImageEndLessThan100 from 'assets/gif/study-goals-end-less-than-100.gif';
import ImageEnd100 from 'assets/gif/study-goals-end-100.gif';

export default {
  1: {
    title: 'Your Mid-Week Report',
    preText: () => '',
    image: ImageMidLessThan50,
    buttonText: <>🎯&nbsp;&nbsp;Get back on track!</>,
    content: (remainingPercent) => (
      <>
        You’re currently <b>{Math.floor(remainingPercent)}% away</b> from reaching your Weekly Study
        Goals.
        <br />
        Take the rest of this week to work towards meeting your goals.
        <br />
        There’s still time to catch up! You can do it! 🔥
      </>
    )
  },
  2: {
    title: 'Your Mid-Week Report',
    preText: () => '',
    image: ImageMidLessThan100,
    buttonText: <>👍&nbsp;&nbsp;Awesome!</>,
    content: (remainingPercent) => (
      <>
        You’re making great progress! 👏
        <br />
        You’re currently <b>{Math.floor(remainingPercent)}% away</b> from reaching your Weekly Study
        Goals.
        <br />
        Keep up the pace in order to achieve your goals! 💪
      </>
    )
  },
  3: {
    title: 'Your Mid-Week Report',
    preText: () => '',
    image: ImageMid100,
    buttonText: <>🎉&nbsp;&nbsp;Hooray!</>,
    content: () => (
      <>
        Amazing job! You’ve already achieved 100% of your Weekly Study Goals! 👏
        <br />
        Next week, try spending more time on your goals to really challenge yourself and see all the
        progress you’ve made along the way! ✨
      </>
    )
  },
  4: {
    title: 'Your End of Week Report',
    preText: (currentGoals, totalGoals) =>
      `Completed Weekly Study Goals: ${currentGoals}/${totalGoals}`,
    image: ImageEndLessThan100,
    buttonText: <>🎯 Got it!</>,
    content: () => (
      <>
        You didn’t achieve your goals this week 😔
        <br />
        But that’s okay! Try spending more time attaining your goals next week!
        <br />
        It’s all about the progress, not perfection. 💪
      </>
    )
  },
  5: {
    title: 'Your End of Week Report',
    preText: (currentGoals, totalGoals) =>
      `Completed Weekly Study Goals: ${currentGoals}/${totalGoals}`,
    image: ImageEndLessThan100,
    buttonText: <>🎯 Got it!</>,
    content: () => (
      <>
        You were so close to achieving your goals this week! 😬
        <br />
        Try increasing your time spent on attaining your goals next week.
        <br />
        In time, you’ll be achieving all of your goals! 🙌
      </>
    )
  },
  6: {
    title: 'Your End of Week Report',
    preText: (currentGoals, totalGoals) =>
      `Completed Weekly Study Goals: ${currentGoals}/${totalGoals}`,
    image: ImageEnd100,
    buttonText: <>🎯 Got it!</>,
    content: () => (
      <>
        You’re a rockstar for achieving your goals this week! 🔥
        <br />
        Push yourself to the next level by completing even more study actions next week! 🚀
      </>
    )
  }
};
