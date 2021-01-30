export default defaultColor => {
  window.katex = {}
  window.katex.render = (value, node, { color, dpi }) => {
    // eslint-disable-next-line
    node.innerHTML = `<img src='https://private.codecogs.com/png.download?\\dpi{${dpi || 100}}\\color{${color || defaultColor}}${value}' />`
  }
}
