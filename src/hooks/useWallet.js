import { useState, useEffect, useCallback } from "react";
import { SEPOLIA_CHAIN_ID } from "../constants/contract";
import toast from "react-hot-toast";

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainOk, setChainOk] = useState(true);

  const checkChain = useCallback(async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setChainOk(chainId === SEPOLIA_CHAIN_ID);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      await checkChain();
    } catch (err) {
      toast.error("Wallet connection rejected");
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accs) =>
      setAccount(accs[0] || null),
    );
    window.ethereum.on("chainChanged", checkChain);
  }, [checkChain]);

  return { account, chainOk, connectWallet };
}
