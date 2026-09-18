import { useEffect, useState } from "react";
import { getReadContract } from "../hooks/useContract";
import { DEPLOY_BLOCK } from "../constants/contract";

export default function HistoryDashboard({ account }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const contract = await getReadContract();
        const filter = contract.filters.DocumentRegistered(null, null, account);
        const events = await contract.queryFilter(
          filter,
          Number(DEPLOY_BLOCK),
          "latest",
        );
        if (!cancelled) setRecords(events.reverse());
      } catch (err) {
        console.error("History fetch failed:", err);
        if (!cancelled)
          setError("Could not load history. See console for details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [account]);

  if (loading)
    return (
      <p className="text-center text-slate-400 py-16">Loading history...</p>
    );
  if (error) return <p className="text-center text-red-500 py-16">{error}</p>;
  if (records.length === 0)
    return (
      <p className="text-center text-slate-400 py-16">
        No documents registered yet
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-2 font-medium">Document Hash</th>
            <th className="py-2 font-medium">Timestamp</th>
            <th className="py-2 font-medium">Transaction</th>
          </tr>
        </thead>
        <tbody>
          {records.map((e) => (
            <tr key={e.transactionHash} className="border-b border-slate-100">
              <td className="py-3 font-mono text-xs text-slate-700">
                {e.args.docHash.slice(0, 18)}...
              </td>
              <td className="py-3 text-slate-600">
                {new Date(Number(e.args.timestamp) * 1000).toLocaleString()}
              </td>
              <td className="py-3">
                <a
                  href={`https://sepolia.etherscan.io/tx/${e.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  View ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
