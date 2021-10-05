import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config.js';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { messagePrefix } from '@ethersproject/hash';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const GridContainer = styled.div`
  grid-column: 4;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 640px) {
    grid-column: 1;
  }

  @media (max-width: 1024px) {
    grid-column: 2;
  }

`

export default function Home() {
  const [nfts, setNfts] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])
  console.log('hello')

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    console.log('items', items)
    setNfts(items)
    setLoadingState('loaded')
  }

  console.log('yoyo', nfts)

  async function buyNft(nft) {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
        value: price
      })
      await transaction.wait()
      loadNFTs()
  }


  if (loadingState === 'loaded' && !nfts.length) return (
    <h1>No items in marketplace!</h1>
  )

  return (
    <Container>
      <GridContainer>
        {
          nfts.map((nft, i) => (
            <div>
              <img src={nft.image}/>
              <div>
                <p>{nft.name}</p>
              </div>
              <div>
                <p>{nft.description}</p>
              </div>
              <div>
                <p>{nft.price} Matic</p>
                <button>Buy</button>
              </div>
            </div>
          ))
        }
      </GridContainer>
   </Container>
  )
}
