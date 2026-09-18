import { QRCodeSVG } from "qrcode.react";
import { downloadCertificate } from "../utils/generateCertificate";
import toast from "react-hot-toast";

export default function CertificateModal({ data, onClose }) {
  const explorerUrl = `https://sepolia.etherscan.io/tx/${data.txHash}`;

  const handleDownload = async () => {
    try {
      await downloadCertificate(
        data,
        `certificate-${data.docHash.slice(2, 10)}.pdf`,
      );
    } catch {
      toast.error("Could not generate certificate PDF");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl">
              ✓
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              Certificate of Registration
            </h3>
            <p className="text-xs text-slate-500">Proof of Existence Notary</p>
          </div>

          <div className="space-y-3 text-sm mb-6">
            <Row
              label="Document Hash"
              value={`${data.docHash.slice(0, 18)}...`}
              mono
            />
            <Row
              label="Registered On"
              value={new Date(data.timestamp * 1000).toLocaleString()}
            />
            <Row
              label="Transaction"
              value={`${data.txHash.slice(0, 14)}...`}
              mono
            />
            <Row label="Network" value="Sepolia Testnet" />
          </div>

          <div className="flex justify-center">
            <QRCodeSVG value={explorerUrl} size={120} />
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Scan to verify on Etherscan
          </p>
        </div>

        <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-medium text-slate-600 py-2 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-slate-900 ${mono ? "font-mono text-xs" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}
