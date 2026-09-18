<div align="center">

# Proof of Existence

### A private document fingerprint, notarized on Ethereum.

Hash a file in your browser, anchor its fingerprint on-chain, and verify the original later without uploading the document itself.

![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Ethereum Sepolia](https://img.shields.io/badge/network-Ethereum%20Sepolia-627EEA?style=flat-square&logo=ethereum&logoColor=white)
![License](https://img.shields.io/badge/license-private-lightgrey?style=flat-square)

</div>

## Why it exists

Important files often need a trustworthy timestamp: a draft, design, research note, contract, or other digital artifact. **Proof of Existence** creates that timestamp without sending the file to a server.

The app computes a SHA-256 fingerprint locally, stores only that fingerprint and its registration metadata on the Ethereum Sepolia testnet, and later compares a file against the permanent record.

> The blockchain sees the fingerprint, not the document.

## What you can do

- **Register a document** - drop in a file, review its hash and estimated gas, then confirm the transaction in MetaMask.
- **Verify a document** - select a file to check whether its exact bytes match an on-chain registration.
- **Review your history** - browse registrations made by the connected wallet and open each transaction in Etherscan.
- **Generate a certificate** - after confirmation, view the registration details and keep a shareable proof of the transaction.
- **Stay in control of the file** - hashing happens in the browser; the document itself is never sent to the app or contract.

## How it works

```mermaid
flowchart LR
    A[Select a file] --> B[SHA-256 in browser]
    B --> C{Already registered?}
    C -->|Yes| D[Show existing proof]
    C -->|No| E[Estimate gas]
```

### Verification Flow
Verification follows the same first step:
1. **Hash the selected file** locally in the browser.
2. **Call `verifyDoc`** on the smart contract.
3. **Report** whether an exact match exists.

*Note: Because of how cryptographic hashing works, even a one-byte change in the file produces an entirely different fingerprint.*


## Quick start

### Prerequisites

- Node.js 18 or newer
- npm
- [MetaMask](https://metamask.io/) installed in your browser
- Sepolia ETH for registration transactions

### Run locally

```bash
git clone <your-repository-url>
cd proof-of-existence
npm install
npm run dev
````

```bash
npm run build
npm run preview
```

## Smart contract

The frontend is currently configured for this deployed contract on Ethereum Sepolia:

| Detail    | Value                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Network   | Ethereum Sepolia                                                                                                                |
| Chain ID  | `11155111` (`0xaa36a7`)                                                                                                         |
| Contract  | [`0x34717597F69CEe6C09279cCd9c7339710e6e877B`](https://sepolia.etherscan.io/address/0x34717597F69CEe6C09279cCd9c7339710e6e877B) |
| Etherscan | [View contract](https://sepolia.etherscan.io/address/0x34717597F69CEe6C09279cCd9c7339710e6e877B)                                |

The contract interface used by the app exposes:

```solidity
function registerDoc(string calldata docHash) external;
function verifyDoc(string calldata docHash)
	external
	view
	returns (uint256 timestamp, address registrant);
```

The frontend reads registration events from the configured deployment block to populate wallet history.

## Privacy and trust model

### What stays local

- The selected file contents
- The browser-side SHA-256 operation
- The original document itself

### What becomes public

- The SHA-256 fingerprint
- The registration timestamp
- The registering wallet address
- The transaction data and history on Sepolia

Anyone with the same file can calculate the same fingerprint. Do not register a document if revealing its fingerprint could expose sensitive information, and remember that Sepolia is a public test network rather than a production archive.

## Tech stack

- [Ethers v6](https://docs.ethers.org/v6/) for wallet and contract access
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for interface icons

````text
src/
├── components/       UI tabs, wallet header, history, certificate modal
├── constants/        Contract ABI, address, network, deployment block
## Available scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Create a production build            |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across the project        |

## Notes for contributors

The contract address, ABI, Sepolia chain ID, and deployment block live in [`src/constants/contract.js`](src/constants/contract.js). If you point the UI at a different deployment, update those values together so reads, writes, and event history remain aligned.

Before opening a pull request:

```bash
npm run lint
npm run build
````

<div align="center">

Built for documents that deserve a timestamp.

</div>
