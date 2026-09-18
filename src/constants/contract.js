export const CONTRACT_ADDRESS = "0x34717597F69CEe6C09279cCd9c7339710e6e877B";
export const DEPLOY_BLOCK = 11730885;
export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "docHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "registrant",
        type: "address",
      },
    ],
    name: "DocumentRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "docHash",
        type: "string",
      },
    ],
    name: "registerDoc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "docHash",
        type: "string",
      },
    ],
    name: "verifyDoc",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
