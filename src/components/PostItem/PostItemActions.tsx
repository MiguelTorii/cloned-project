import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "../../containers/Tooltip/Tooltip";
// import AddIcon from '@material-ui/icons/Add';
// import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
// import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
// @ts-ignore
import { ReactComponent as ThanksIcon } from "../../assets/svg/ic_thanks_hands.svg";
import thanksSvg from "../../assets/svg/thanks.svg";
import commentSvg from "../../assets/svg/comment.svg";
// @ts-ignore
// import { ReactComponent as StudyCircleIcon } from '../../assets/svg/ic_studycircle.svg';
import { styles } from "../_styles/PostItem/PostItemActions";
type Props = {
  classes: Record<string, any>;
  isOwner: boolean;
  thanked: boolean;
  // inStudyCircle: boolean,
  questionsCount: number;
  thanksCount: number;
  viewCount: number;
  isThanksLoading: boolean;
  // isStudyCircleLoading: boolean,
  noThanks: boolean;
  onThanks: (...args: Array<any>) => any; // onStudyCircle: Function

};

class PostItemActions extends React.PureComponent<Props> {
  renderThanks = () => {
    const {
      thanked,
      isThanksLoading
    } = this.props;

    if (isThanksLoading) {
      return <CircularProgress size={24} />;
    }

    if (thanked) {
      return <ThanksIcon />;
    }

    return <ThanksIcon />;
  };

  // renderStudyCircle = () => {
  // const { inStudyCircle, isStudyCircleLoading } = this.props;
  // if (isStudyCircleLoading) return <CircularProgress size={24} />;
  // if (inStudyCircle) return <StudyCircleIcon />;
  // return <StudyCircleIcon />;
  // };
  render() {
    const {
      classes,
      isOwner,
      // thanked,
      // inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount,
      noThanks,
      onThanks // onStudyCircle

    } = this.props;
    return <>
        {
        /* <div className={classes.root}>
         {!isOwner && (
           <Fragment>
             {!noThanks && (
               <Tooltip
                 id={2197}
                 placement="top"
                 text="When your classmates post, be sure to thank them"
               >
                 <Button aria-label="Thanks" onClick={onThanks}>
                   <img
                     src={thanksSvg}
                     className={classes.actionIcon}
                     alt="thanks"
                   />
                   <Typography
                     variant="subtitle1"
                     className={classes.buttonText}
                   >
                     {thanked ? 'Thanked' : 'Thanks'}
                   </Typography>
                 </Button>
               </Tooltip>
             )}
             <Button aria-label="Add to Study Circle" onClick={onStudyCircle}>
               {this.renderStudyCircle()}
               <Typography variant="subtitle1" className={classes.buttonText}>
                 {inStudyCircle ? 'Remove from' : 'Add to'} Study Circle
               </Typography>
             </Button>
           </Fragment>
         )}
        </div> */
      }
        <div className={classes.root}>
          <div className={classes.buttonActions}>
            {!isOwner && <>
                {!noThanks && <Button aria-label="Thanks" onClick={onThanks}>
                    <img src={thanksSvg} className={classes.actionIcon} alt="thanks" />
                    <Typography variant="subtitle1" className={classes.buttonText}>
                      {thanksCount}
                    </Typography>
                  </Button>}
                <Typography variant="subtitle1" className={classes.buttonText}>
                  <img src={commentSvg} className={classes.actionIcon} alt="comment" />
                  {questionsCount}
                </Typography>
              </>}
          </div>
          <Typography variant="subtitle1" className={classes.buttonText}>
            {`${viewCount} views`}
          </Typography>
        </div>
      </>;
  }

}

export default withStyles(styles)(PostItemActions);