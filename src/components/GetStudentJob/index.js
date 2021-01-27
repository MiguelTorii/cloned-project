// @flow
import React from 'react'
import Dialog from 'components/Dialog'
import { pdfjs } from 'react-pdf';
import PdfComponent from 'components/PdfGallery/PdfComponent'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const STUDENT_JOB_PDF_URI = "https://media.circleinapp.com/CircleIn+Student+Ambassador.pdf"

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
        url={STUDENT_JOB_PDF_URI}
        height="100%"
        width="100%"
        radius={10}
      />
    </Dialog>
  )
}

export default GetAppDialog
