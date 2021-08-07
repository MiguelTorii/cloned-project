import React from 'react';
import ImageLessThan50 from 'assets/gif/study-goal-mid-less-than-50.gif';
import ImageLessThan100 from 'assets/gif/study-goal-mid-less-than-100.gif';
import Image100 from 'assets/gif/study-goal-mid-100.gif';

export default [
  {
    image: ImageLessThan50,
    buttonText: <>🎯&nbsp;&nbsp;Get back on track!</>,
    content: (remainingPercent) => (
      <>
        You’re currently <b>{Math.floor(remainingPercent)}% away</b> from reaching your Weekly Study Goals.<br/>
        Take the rest of this week to work towards meeting your goals.<br/>
        There’s still time to catch up! You can do it! 🔥
      </>
    )
  },
  {
    image: ImageLessThan100,
    buttonText: <>👍&nbsp;&nbsp;Awesome!</>,
    content: (remainingPercent) => (
      <>
        You’re making great progress! 👏<br/>
        You’re currently <b>{Math.floor(remainingPercent)}% away</b> from reaching your Weekly Study Goals.<br/>
        Keep up the pace in order to achieve your goals! 💪
      </>
    )
  },
  {
    image: Image100,
    buttonText: <>🎉&nbsp;&nbsp;Hooray!</>,
    content: () => (
      <>
        Amazing job! You’ve already achieved 100% of your Weekly Study Goals! 👏<br/>
        Next week, try spending more time on your goals to really challenge yourself and see all the progress you’ve made along the way! ✨
      </>
    )
  }
]