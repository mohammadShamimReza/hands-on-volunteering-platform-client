import jsPDF from "jspdf";

export const generateCertificate = async ({
  fullName,
  hours,
  eventTitle,
}: {
  fullName: string;
  hours: number;
  eventTitle: string;
}) => {
  const doc = new jsPDF("landscape");

  // Add a title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Certificate of Volunteering", 105, 40, { align: "center" });

  // Add a description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(`This certificate is awarded to`, 105, 60, { align: "center" });

  // Add the recipient's name
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.text(fullName, 105, 80, { align: "center" });

  // Add event details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(
    `For volunteering ${hours} hours in the event "${eventTitle}".`,
    105,
    100,
    { align: "center" }
  );

  // Add a signature
  doc.setFont("helvetica", "italic");
  doc.text("Organizer", 50, 150);
  doc.text("Date: " + new Date().toDateString(), 200, 150);

  // Save as PDF
  doc.save(`Certificate_${fullName}_${hours}h.pdf`);
};
