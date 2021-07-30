export const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(2),
    '& .microlink_card': {
      width: 295,
      height: 169,
      borderRadius: 10,
      border: 'none'
    },
    '& .microlink_card__content': {
      backgroundColor: theme.circleIn.palette.appBar,
      color: 'white',
      flex: 'none',
      '-webkit-flex': 'none',
      borderRadius: '0 0 8px 8px'
    },
    '& .microlink_card__content_description': {
      display: 'none'
    },
    '& .microlink_card__content_url': {
      display: 'none'
    }
  }
});
