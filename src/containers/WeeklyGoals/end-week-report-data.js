import React from 'react';
import ImageLessThan100 from 'assets/gif/study-goals-end-less-than-100.gif';
import Image100 from 'assets/gif/study-goals-end-100.gif';

export default [
  {
    image: ImageLessThan100,
    content: (
      <>
        You didn’t achieve your goals this week 😔<br/>
        But that’s okay! Try spending more time attaining your goals next week!<br/>
        It’s all about the progress, not perfection. 💪
      </>
    )
  },
  {
    image: ImageLessThan100,
    content: (
      <>
        You were so close to achieving your goals this week! 😬<br/>
        Try increasing your time spent on attaining your goals next week.<br/>
        In time, you’ll be achieving all of your goals! 🙌
      </>
    )
  },
  {
    image: Image100,
    content: (
      <>
        You’re a rockstar for achieving your goals this week! 🔥<br/>
        Push yourself to the next level by completing even more study actions next week! 🚀
      </>
    )
  }
]