export default (defaultColor) => {
  window.katex = {};

  window.katex.render = (value, node, { color, dpi }) => {
    // eslint-disable-next-line
    node.innerHTML = `<img src='https://private.codecogs.com/png.latex?\\dpi{${
      dpi || 400
    }}\\color{${color || defaultColor}}${value}' />`;
  };
};
