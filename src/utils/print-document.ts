import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export const printDocument = async (
  componentToPrint: HTMLElement,
  componentToHidden: HTMLElement | HTMLDivElement,
) => {
  componentToHidden.style.display = "none";

  if (componentToPrint) {
    const canvas = await html2canvas(componentToPrint, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: componentToPrint.scrollWidth,
      windowHeight: componentToPrint.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // altura proporcional da imagem em relação à largura do PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // primeira página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // páginas adicionais, se precisar
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    pdf.save("transaction-entry.pdf");
    componentToHidden.style.display = 'flex'
  }
};
