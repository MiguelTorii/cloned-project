import React from 'react';
import { useDrag } from 'react-dnd';
import LoadImg from '../../LoadImg';

const style = {
  cursor: 'move'
};

const Box = ({ name, type, ic, isDropped }) => {
  const [{ opacity }, drag] = useDrag({
    item: { name, type, ic },
    canDrag: !isDropped,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });

  const droppedStyle = isDropped ? { opacity: 0.4 } : null;
  const imgStyle = { height: 50, width: 50 };

  return (
    <div ref={drag} style={{ ...style, opacity }}>
      <LoadImg
        url={ic}
        loadingSize={10}
        style={{ ...droppedStyle, ...imgStyle }}
      />
    </div>
  );
};
export default Box;
