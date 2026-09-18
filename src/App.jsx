import { useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import NetworkGuard from "./components/NetworkGuard";
import RegisterTab from "./components/RegisterTab";
import VerifyTab from "./components/VerifyTab";
import HistoryDashboard from "./components/HistoryDashboard";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const [active, setActive] = useState("Register");
  const { account, chainOk, connectWallet } = useWallet();

  return (
    <div className="min-h-screen">
      <Header
        account={account}
        connectWallet={connectWallet}
        chainOk={chainOk}
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Notarize any file on-chain
          </h2>
          <p className="text-slate-500 mt-1 max-w-lg mx-auto">
            Generate a cryptographic fingerprint of your document and timestamp
            it permanently on the Ethereum blockchain — without ever uploading
            the file itself.
          </p>
        </div>

        <Tabs active={active} setActive={setActive} />

        {!account ? (
          <div className="text-center text-slate-400 py-20 border border-dashed border-slate-200 rounded-xl">
            Connect your wallet to get started
          </div>
        ) : !chainOk ? (
          <NetworkGuard />
        ) : (
          <>
            {active === "Register" && <RegisterTab account={account} />}
            {active === "Verify" && <VerifyTab />}
            {active === "History" && <HistoryDashboard account={account} />}
          </>
        )}
      </main>
    </div>
  );
}
