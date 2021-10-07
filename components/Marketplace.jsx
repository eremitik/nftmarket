import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config.js';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { messagePrefix } from '@ethersproject/hash';
import styled, { css } from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const GridContainer = styled.div`
  display: grid;
  // grid-template-columns: repeat(5, 1fr);
  grid-template-columns: auto auto auto auto auto;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: auto;
    display: flex;
  }

  @media (max-width: 1024px) {
    // grid-template-columns: repeat(2, 1fr);
    grid-template-columns auto auto:
  }
`

const PriceContainer = styled.div`
  display: flex;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #282828;
  border-radius: 15px;
  height: 350px;
  width: 250px;
`

const ContentContainer = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
`

const Image = styled.img`
  border-radius: 10px;
  max-height: 260px; 
  margin: 20px;
`

const Typography = styled.p`
  font-weight: 800;
  margin-left: 20px;
  margin-top: 0;
  margin-bottom: 0;

  ${props => props.description && css`
    color: #484848;
  `}  

`

const Button = styled.button`
  display: inline;
  margin-left: 90px;
  border: none;
  font-weight: 800;
  color: #3366ff;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: #282828;
    border-radius: 5px;
  }
`

export default function Marketplace() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNfts()
  }, [])
  console.log('hello')

  async function loadNfts() {
    // const provider = new ethers.providers.JsonRpcProvider("") // for local deploy
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/558ead9aa1a1492ba930710831a96e14") // mumbai testnet
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
    console.log('pushed')
    console.log('nft', nft)
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

      const transaction = await contract.createMarketSales(nftaddress, nft.tokenId, {
        value: price
      })
      await transaction.wait()
      loadNfts()
  }


  if (loadingState === 'loaded' && !nfts.length) return (
    <h1>No items in marketplace!</h1>
  )

  return (
    <Container>
      <GridContainer>
        {
          nfts.map((nft, i) => (
            <CardContainer>
              <Image src={nft.image}/>
              <ContentContainer>
                <div>
                  <Typography>{nft.name}</Typography>
                </div>
                <div>
                  <Typography description>{nft.description}</Typography>
                </div>
                <PriceContainer>
                  <Typography>{nft.price} Matic</Typography>
                  <Button onClick={() => buyNft(nft)}>Buy</Button>
                </PriceContainer>
              </ContentContainer>
            </CardContainer>
          ))
        }
      </GridContainer>
   </Container>
  )
}