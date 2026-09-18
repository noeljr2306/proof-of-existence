import { useState } from "react";
import toast from "react-hot-toast";
import { hashFile } from "../utils/hashFile";
import { getReadContract } from "../hooks/useContract";
import { friendlyError } from "../utils/errorMessages";

export default function VerifyTab() {
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleFile = async (f) => {
    if (!f) return;
    setChecking(true);
    setResult(null);
    try {
      const docHash = await hashFile(f);
      const contract = await getReadContract();
      const [timestamp, registrant] = await contract.verifyDoc(docHash);

      setResult({
        found: timestamp > 0n,
        timestamp: Number(timestamp),
        registrant,
        hash: docHash,
      });
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <label className="block border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-brand-400 transition-colors">
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <p className="text-slate-500 text-sm">
          Select a file to verify its authenticity
        </p>
      </label>

      {checking && (
        <p className="text-center text-sm text-slate-400 mt-4">
          Checking blockchain...
        </p>
      )}

      {result && (
        <div
          className={`mt-6 rounded-xl p-5 border text-center ${
            result.found
              ? "bg-emerald-50 border-emerald-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          {result.found ? (
            <>
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold text-emerald-700">
                Document Authentic
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Registered on{" "}
                {new Date(result.timestamp * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-500 font-mono mt-1">
                by {result.registrant.slice(0, 6)}...
                {result.registrant.slice(-4)}
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-semibold text-red-700">
                Document Not Found / Altered
              </p>
              <p className="text-sm text-red-500 mt-1">
                This exact file has no matching record
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
