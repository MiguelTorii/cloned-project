import React from 'react';
import { pdfjs } from 'react-pdf';
import studentJobPdf from '../../assets/pdf/CircleIn-Student-Ambassador.pdf';
import Dialog from '../Dialog/Dialog';
import PdfComponent from '../PdfGallery/PdfComponent';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
type Props = {
  open: boolean;
  onClose: (...args: Array<any>) => any;
};

const GetAppDialog = ({ open, onClose }: Props) => (
  <Dialog maxWidth="md" onCancel={onClose} open={Boolean(open)}>
    <PdfComponent url={studentJobPdf} height="100%" width="100%" radius={10} />
  </Dialog>
);

export default GetAppDialog;
