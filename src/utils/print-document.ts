import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const printDocument = async (
  componentToPrint: HTMLElement,
  componentToHidden: HTMLElement | HTMLDivElement
) => {
  componentToHidden.style.display = "none";

  if (componentToPrint) {
    const canvas = await html2canvas(componentToPrint, {
      scale: 2, 
      useCORS: true, 
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      newWidth,
      newHeight,
      undefined,
      "FAST"
    );

    pdf.save("transaction-entry.pdf");
    componentToHidden.style.display = "flex";
  }
};
