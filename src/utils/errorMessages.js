export function friendlyError(err) {
  const msg = (err?.reason || err?.message || "").toLowerCase();

  if (!window.ethereum)
    return "MetaMask is not installed. Please install it to continue.";
  if (msg.includes("already registered"))
    return "This document is already registered on-chain.";
  if (msg.includes("user rejected") || err?.code === 4001)
    return "Transaction was rejected in MetaMask.";
  if (msg.includes("insufficient funds"))
    return "Insufficient Sepolia ETH to cover gas fees.";
  if (msg.includes("network"))
    return "Network error — check your connection and try again.";
  if (err?.code === "UNSUPPORTED_OPERATION")
    return "Contract configuration error — check ABI/address.";
  return "Something went wrong. Please try again.";
}
