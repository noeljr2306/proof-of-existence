import { ShieldCheck } from "lucide-react";
export default function Header({ account, connectWallet, chainOk }) {
  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">
              Proof of Existence
            </h1>
            <p className="text-xs text-slate-500 leading-tight">
              Decentralized Document Notary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {account && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                chainOk
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  chainOk ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {chainOk ? "Sepolia" : "Wrong Network"}
            </span>
          )}

          <button
            onClick={connectWallet}
            className="bg-brand-600 hover:bg-brand-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
          >
            {account ? short(account) : "Connect Wallet"}
          </button>
        </div>
      </div>
    </header>
  );
}
