import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(() => ({
  select: {
    width: 350
  },
  selectForm: {
    width: '100%',
    '& .MuiInput-formControl': {
      marginTop: 10
    }
  },
  reminder: {
    '& .MuiInputLabel-outlined': {// transform: 'translate(14px, 13px) scale(1)'
    },
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 16px'
    }
  },
  hidden: {
    display: 'none'
  }
}));