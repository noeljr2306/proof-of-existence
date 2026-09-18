import toast from "react-hot-toast";
import { SEPOLIA_CHAIN_ID } from "../constants/contract";

export default function NetworkGuard() {
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch {
          toast.error("Could not add Sepolia network");
        }
      } else {
        toast.error("Network switch rejected");
      }
    }
  };

  return (
    <div className="text-center py-16 border border-red-100 bg-red-50 rounded-xl">
      <p className="text-red-700 font-medium">You're on the wrong network</p>
      <p className="text-red-500 text-sm mt-1 mb-4">
        This app runs on the Sepolia testnet
      </p>
      <button
        onClick={switchNetwork}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        Switch to Sepolia
      </button>
    </div>
  );
}
