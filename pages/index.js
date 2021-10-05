import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config.js';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {
  const [nfts, setNfts] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')

  return (
    <div>
      <h1>home</h1>
   </div>
  )
}
