import React, { memo, useEffect, useState } from 'react';

import { pdfjs } from 'react-pdf';

import AppBar from '@material-ui/core/AppBar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { styles } from '../_styles/PdfGallery/index';

import PdfComponent from './PdfComponent';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDF = {
  src: string;
  thumbnail: string;
};

type Props = {
  classes: Record<string, any>;
  title: string;
  pdfs: Array<PDF>;
};

const Transition = React.forwardRef<any, any>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PdfGallery = ({ title, classes, pdfs }: Props) => {
  const [urls, setUrls] = useState([]);
  const [selected, setSelected] = useState('');
  useEffect(() => {
    const init = async () => {
      const fileNames = pdfs.map((p) => p.src);
      setUrls(fileNames);
    };

    init(); // eslint-disable-next-line
  }, []);

  const handleClose = () => setSelected('');

  return (
    <div className={classes.root}>
      <div className={classes.gallery}>
        {urls.map((url) => (
          <ButtonBase key={url} onClick={() => setSelected(url)} className={classes.buttonBase}>
            <PdfComponent url={url} height={120} width={120} />
          </ButtonBase>
        ))}
      </div>
      <Dialog
        open={Boolean(selected)}
        TransitionComponent={Transition as any}
        keepMounted
        onClose={handleClose}
        fullScreen
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography color="textPrimary" variant="h4">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {Boolean(selected) && (
            <iframe
              title="pdf"
              className={classes.pdf}
              src={`/pdf/web/viewer.html?file=${selected}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(withStyles(styles as any)(PdfGallery));
