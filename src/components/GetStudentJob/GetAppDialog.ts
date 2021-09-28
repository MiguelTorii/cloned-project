// @flow
import React from 'react';
import Dialog from 'components/Dialog/Dialog';
import { pdfjs } from 'react-pdf';
import PdfComponent from 'components/PdfGallery/PdfComponent';
import studentJobPdf from 'assets/pdf/CircleIn-Student-Ambassador.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  open: boolean,
  onClose: Function
};

const GetAppDialog = ({ open, onClose }: Props) => (
  <Dialog maxWidth="md" onCancel={onClose} open={Boolean(open)}>
    <PdfComponent url={studentJobPdf} height="100%" width="100%" radius={10} />
  </Dialog>
);

export default GetAppDialog;
