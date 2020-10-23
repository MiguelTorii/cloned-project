import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf'

const PdfComponent = ({ url, radius, height, width }) => {
  const useStyles = makeStyles({
    canvas: {
      objectFit: 'cover',
      height,
      borderRadius: radius,
      width,
      '& canvas, div': {
        borderRadius: radius,
        height: `${height}px !important`,
        width: `${width}px !important`,
      }
    }
  })

  const classes = useStyles()

  return (
    <Document file={{ url }}>
      <Page pageNumber={1} className={classes.canvas} />
    </Document>
  );
}

PdfComponent.propTypes = {
  url: PropTypes.string.isRequired
};

export default memo(PdfComponent)
