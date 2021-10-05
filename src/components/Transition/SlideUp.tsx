import React from 'react';
import Slide from '@material-ui/core/Slide';

const SlideUp = React.forwardRef<any, any>((props, ref) => (
  <Slide ref={ref} direction="up" {...props} />
));
export default SlideUp;
