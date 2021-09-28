export const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    position: 'relative'
  },
  outlineInput: {
    '& input': {
      padding: theme.spacing(1.5, 1.75)
    },
    '& fieldset': {
      borderRadius: theme.spacing(1)
    }
  }
});
