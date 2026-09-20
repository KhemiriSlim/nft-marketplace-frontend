
import './App.css'
import { ethers } from "ethers";
import { useState } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";
function App() {

  const [account,setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenUri, setTokenUri] = useState<string | null>(null);
  async function handleConnect(){
    if(!window.ethereum) {
      alert("Please install MetaMask to use this app");
      return;
    }
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    }
    catch (error) {
      console.error(error);
    }
  }


  async function handleMint() {
    if(!contract) {
      alert("Please connect your wallet first");
      return;
    }
    try{
      const tx = await contract.safeMint(account,"ipfs://placeholder");
      await tx.wait();
    }
    catch (error) {
      console.error(error);
    }
  }

  async function handleCheckToken(){
    if(!contract) {
      alert("Please connect your wallet first");
      return;
    }
    try{
      const tx = await contract.tokenURI(0);
      setTokenUri(tx);
    }catch(error){
      console.error(error);
    }
  }



  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      {account && <p>Connected: {account}</p>}
      {contract && <button onClick={handleMint}>Mint NFT</button>}
      {contract && <button onClick={handleCheckToken}>Check Token URI</button>}
      {tokenUri && <p>Token URI: {tokenUri}</p>}
    </div>
  )
}

export default App
