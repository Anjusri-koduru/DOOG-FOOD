const PDFDocument = require("pdfkit");

const generateCertificatePDF = (certificate, res) => {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");

  const safeCertificateId = certificate.certificateId
    .replace(/[^a-zA-Z0-9-_]/g, "_");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="DOGFOOD-Certificate-${safeCertificateId}.pdf"`
  );

  doc.pipe(res);

  const pageWidth = 841.89;
  const pageHeight = 595.28;

  // Outer border
  doc
    .lineWidth(4)
    .rect(25, 25, pageWidth - 50, pageHeight - 50)
    .stroke();

  doc
    .lineWidth(1)
    .rect(35, 35, pageWidth - 70, pageHeight - 70)
    .stroke();

  // Header
  doc
    .fontSize(34)
    .font("Helvetica-Bold")
    .text("DOGFOOD", 0, 75, {
      align: "center",
      width: pageWidth,
    });

  doc
    .fontSize(15)
    .font("Helvetica")
    .text("HACKATHON MANAGEMENT & JUDGING PLATFORM", 0, 118, {
      align: "center",
      width: pageWidth,
    });

  // Certificate title
  doc
    .fontSize(30)
    .font("Helvetica-Bold")
    .text("CERTIFICATE", 0, 175, {
      align: "center",
      width: pageWidth,
    });

  doc
    .fontSize(18)
    .font("Helvetica")
    .text("OF ACHIEVEMENT", 0, 215, {
      align: "center",
      width: pageWidth,
    });

  // Recipient
  const recipientName =
    certificate.user?.name ||
    certificate.team?.name ||
    "Participant";

  doc
    .fontSize(15)
    .font("Helvetica")
    .text("This certificate is proudly presented to", 0, 265, {
      align: "center",
      width: pageWidth,
    });

  doc
    .fontSize(30)
    .font("Helvetica-Bold")
    .text(recipientName, 70, 295, {
      align: "center",
      width: pageWidth - 140,
    });

  // Event
  const eventTitle = certificate.event?.title || "DOGFOOD Hackathon";

  doc
    .fontSize(16)
    .font("Helvetica")
    .text("for participating in", 0, 350, {
      align: "center",
      width: pageWidth,
    });

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(eventTitle, 70, 378, {
      align: "center",
      width: pageWidth - 140,
    });

  // Award information
  if (certificate.awardTitle) {
    doc
      .fontSize(17)
      .font("Helvetica-Bold")
      .text(certificate.awardTitle, 0, 420, {
        align: "center",
        width: pageWidth,
      });
  } else if (certificate.certificateType) {
    const certificateType = certificate.certificateType
      .replace(/_/g, " ")
      .toUpperCase();

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(certificateType, 0, 420, {
        align: "center",
        width: pageWidth,
      });
  }

  if (certificate.rank) {
    doc
      .fontSize(15)
      .font("Helvetica")
      .text(`Rank: ${certificate.rank}`, 0, 448, {
        align: "center",
        width: pageWidth,
      });
  }

  // Footer
  const issuedDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(`Certificate ID: ${certificate.certificateId}`, 55, 515);

  doc
    .fontSize(11)
    .text(`Issued: ${issuedDate}`, 0, 515, {
      align: "center",
      width: pageWidth,
    });

  doc
    .fontSize(10)
    .text("Verify this certificate through the DOGFOOD platform.", 0, 540, {
      align: "center",
      width: pageWidth,
    });

  doc.end();
};

module.exports = {
  generateCertificatePDF,
};