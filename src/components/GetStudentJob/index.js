// @flow
import React from 'react'
import Dialog from 'components/Dialog'
import pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import PdfComponent from 'components/PdfGallery/PdfComponent'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const STUDENT_JOB_PDF_URI = "https://f.hubspotusercontent00.net/hubfs/5258553/Spring%202021%20Awareness%20Resources/CircleIn%20Student%20Ambassador.pdf"
const COS_PDF_URL = process.env.NODE_ENV === 'development'
  ? `https://cors-anywhere.herokuapp.com/${STUDENT_JOB_PDF_URI}`
  : STUDENT_JOB_PDF_URI;

type Props = {
  open: boolean, onClose: Function
};

const GetAppDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog
      maxWidth='md'
      onCancel={onClose}
      open={Boolean(open)}
    >
      <PdfComponent
        url={COS_PDF_URL}
        height="100%"
        width="100%"
        radius={10}
      />
    </Dialog>
  )
}

export default GetAppDialog
