import { useState } from "react";
import toast from "react-hot-toast";
import { hashFile } from "../utils/hashFile";
import {
  getReadContract,
  getWriteContract,
  getProvider,
} from "../hooks/useContract";
import { friendlyError } from "../utils/errorMessages";
import CertificateModal from "./CertificateModal";

export default function RegisterTab() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [status, setStatus] = useState("idle");
  const [certData, setCertData] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(null); // null | { timestamp, registrant }

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setHash(null);
    setGasEstimate(null);
    setAlreadyRegistered(null);
    setStatus("hashing");

    try {
      const docHash = await hashFile(f);
      setHash(docHash);

      const readContract = await getReadContract();
      const [timestamp, registrant] = await readContract.verifyDoc(docHash);

      if (timestamp > 0n) {
        setAlreadyRegistered({ timestamp: Number(timestamp), registrant });
        setStatus("idle");
        return;
      }

      setStatus("estimating");
      const provider = await getProvider();
      const gas = await readContract.registerDoc.estimateGas(docHash);
      const feeData = await provider.getFeeData();
      const costWei = gas * feeData.gasPrice;
      setGasEstimate((Number(costWei) / 1e18).toFixed(6));
      setStatus("idle");
    } catch (err) {
      toast.error(friendlyError(err));
      setStatus("idle");
    }
  };

  const register = async () => {
    setStatus("pending");
    const toastId = toast.loading("Confirm the transaction in MetaMask...");
    try {
      const contract = await getWriteContract();
      const tx = await contract.registerDoc(hash);
      toast.loading("Waiting for confirmation...", { id: toastId });
      const receipt = await tx.wait();

      toast.success("Document registered on-chain!", { id: toastId });
      setCertData({
        docHash: hash,
        txHash: receipt.hash,
        timestamp: Math.floor(Date.now() / 1000),
      });
      setStatus("done");
    } catch (err) {
      toast.error(friendlyError(err), { id: toastId });
      setStatus("idle");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <label
        className="block border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-brand-400 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <p className="text-slate-500 text-sm">
          {file ? file.name : "Drag & drop a file, or click to select"}
        </p>
      </label>

      {(status === "hashing" || status === "estimating") && (
        <p className="text-center text-sm text-slate-400 mt-4">
          {status === "hashing"
            ? "Computing SHA-256 hash..."
            : "Checking registration status..."}
        </p>
      )}

      {alreadyRegistered && (
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-center">
          <p className="font-medium text-amber-700">
            This document is already registered
          </p>
          <p className="text-amber-600 mt-1">
            on {new Date(alreadyRegistered.timestamp * 1000).toLocaleString()}
          </p>
          <p className="text-xs text-amber-500 font-mono mt-1">
            by {alreadyRegistered.registrant.slice(0, 6)}...
            {alreadyRegistered.registrant.slice(-4)}
          </p>
        </div>
      )}

      {hash && !alreadyRegistered && status === "idle" && gasEstimate && (
        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Document Hash</span>
            <span className="font-mono text-xs text-slate-700">
              {hash.slice(0, 18)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Gas Cost</span>
            <span className="font-medium text-slate-700">
              ~{gasEstimate} ETH
            </span>
          </div>
          <button
            onClick={register}
            disabled={status === "pending"}
            className="w-full mt-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg"
          >
            {status === "pending"
              ? "Registering..."
              : "Confirm & Register on Blockchain"}
          </button>
        </div>
      )}

      {certData && (
        <CertificateModal data={certData} onClose={() => setCertData(null)} />
      )}
    </div>
  );
}
