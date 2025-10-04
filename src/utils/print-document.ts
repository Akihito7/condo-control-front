import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import React from "react";

export const printDocument = async (
  componentToPrint: HTMLElement,
  componentToHidden: HTMLElement | HTMLDivElement,
  orientation: 'p' | 'l' = 'p',
  setImage?: React.Dispatch<React.SetStateAction<string>>
) => {
  componentToHidden.style.display = "none";

  if (componentToPrint) {
    const canvas = await html2canvas(componentToPrint, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: componentToPrint.scrollWidth * 1.1,
      windowHeight: componentToPrint.scrollHeight * 1.1
    });

    const imgData = canvas.toDataURL("image/png", 2.0);

    setImage?.(imgData)

    const pdf = new jsPDF(orientation, "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Pegando as dimensões reais da imagem
    const imgProps = pdf.getImageProperties(imgData);

    // Calcula largura da imagem no PDF = largura da página PDF
    const imgWidth = pdfWidth;
    // Calcula a altura proporcional para manter a proporção da imagem
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Primeira página posiciona no topo
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    // Adiciona páginas enquanto sobra altura da imagem
    while (heightLeft > 0) {
      position -= pdfHeight; // Move a imagem para cima para mostrar próxima parte
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("transaction-entry.pdf");
    componentToHidden.style.display = "flex";
  }
};
