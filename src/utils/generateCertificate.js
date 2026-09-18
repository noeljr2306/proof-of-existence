import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function downloadCertificate(data, filename = "certificate.pdf") {
  const explorerUrl = `https://sepolia.etherscan.io/tx/${data.txHash}`;
  const qrDataUrl = await QRCode.toDataURL(explorerUrl, {
    margin: 1,
    width: 240,
  });

  const pdf = new jsPDF({ unit: "pt", format: [400, 560] });

  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, 400, 90, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text("Certificate of Registration", 200, 45, { align: "center" });
  pdf.setFontSize(10);
  pdf.text("Proof of Existence Notary", 200, 65, { align: "center" });

  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(11);
  const rows = [
    ["Document Hash", data.docHash],
    ["Registered On", new Date(data.timestamp * 1000).toLocaleString()],
    ["Transaction Hash", data.txHash],
    ["Network", "Sepolia Testnet"],
  ];

  let y = 130;
  rows.forEach(([label, value]) => {
    pdf.setFont(undefined, "bold");
    pdf.text(label, 40, y);
    pdf.setFont(undefined, "normal");
    const wrapped = pdf.splitTextToSize(value, 320);
    pdf.text(wrapped, 40, y + 16);
    y += 16 * wrapped.length + 24;
  });

  pdf.addImage(qrDataUrl, "PNG", 130, y + 10, 140, 140);
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Scan to verify on Etherscan", 200, y + 165, { align: "center" });

  pdf.save(filename);
}
