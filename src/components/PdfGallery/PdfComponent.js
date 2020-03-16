import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfComponent = ({ url, radius, height, width }) => {
  const canvasRef = useRef(null)
  const useStyles = makeStyles({
    canvas: {
      objectFit: 'cover',
      borderRadius: radius,
      height,
      width
    }
  })

  const classes = useStyles()

  useEffect(() => {
    const fetchPdf = async () => {
      try { 
        const loadingTask = pdfjs.getDocument(url);

        const pdf = await loadingTask.promise;

        const firstPageNumber = 1;

        const page = await pdf.getPage(firstPageNumber);

        const scale = page.view[2] ? 120/page.view[2] : 1;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;

        const context = canvas.getContext('2d');
        canvas.height = 120;
        canvas.width = 120;

        const renderContext = {
          canvasContext: context,
          viewport
        };
        const renderTask = page.render(renderContext);

        await renderTask.promise;
      } catch (e) {}
    };

    fetchPdf();
  }, [url]);

  return (
    <canvas
      ref={canvasRef}
      className={classes.canvas}
      width={height}
      height={width}
    />
  );
}

PdfComponent.propTypes = {
  url: PropTypes.string.isRequired
};

export default PdfComponent
