// // @flow
// import React from 'react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import type { HomeCard } from '../../types/models';

// const styles = theme => ({
//   paper: {
//     ...theme.mixins.gutters(),
//     paddingTop: theme.spacing(2),
//     paddingBottom: theme.spacing(2),
//     textAlign: 'left',
//     height: '100%'
//   },
//   title: {
//     fontWeight: 'bold'
//   },
//   img: {
//     width: 65,
//     margin: theme.spacing(2)
//   },
//   referral: {
//     width: '100%',
//     marginTop: theme.spacing(2),
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   referralCode: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   link: {
//     flex: 1,
//     height: 40,
//     padding: theme.spacing(),
//     borderRadius: 10,
//     marginRight: theme.spacing(2),
//     backgroundColor: theme.circleIn.palette.appBar
//   },
//   icon: {
//     marginRight: theme.spacing()
//   },
//   button: {
//     height: 40,
//     backgroundColor: theme.circleIn.palette.success
//   }
// });

// type Props = {
//   classes: Object,
//   referralCode: string,
//   card: HomeCard,
//   onCopy: Function
// };

// type State = {};

// class Referral extends React.PureComponent<Props, State> {
//   render() {
//     const { classes, referralCode, card, onCopy } = this.props;
//     const {
//       title,
//       data: {
//         message: { text },
//         imageUrl
//       }
//     } = card;

//     return (
//       <Grid item xs={6}>
//         <Paper className={classes.paper} elevation={0}>
//           <Typography
//             variant="h4"
//             className={classes.title}
//             align="left"
//             paragraph
//           >
//             {title}
//           </Typography>
//           <Typography variant="h6" align="left">
//             {text}
//           </Typography>
//           <div className={classes.referral}>
//             <img alt={title} src={imageUrl} className={classes.img} />
//             <div className={classes.link}>
//               <Typography variant="h6" align="center">
//                 {referralCode}
//               </Typography>
//             </div>
//             <CopyToClipboard text={referralCode} onCopy={onCopy}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 autoFocus
//                 className={classes.button}
//               >
//                 Share
//               </Button>
//             </CopyToClipboard>
//           </div>
//         </Paper>
//       </Grid>
//     );
//   }
// }

// export default withStyles(styles)(Referral);
