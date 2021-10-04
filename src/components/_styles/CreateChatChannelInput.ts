export const styles = theme => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%',
    // Fix IE 11 issue.
    display: 'flex',
    alignItems: 'flex-start'
  },
  inputContainer: {
    flex: 1
  },
  input: {
    display: 'none'
  },
  button: {
    marginTop: theme.spacing(),
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: '14px'
  }
});