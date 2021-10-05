import { ethers } from 'ethers';
import { useEffect, useState } from  'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { nftmarketaddress, nftaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Dashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))

    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')
  }
  return (
    <div>
      <div>
        <h2>NFTs Created</h2>
          <div>
            {
              nfts.map((nft, i) => (
                <div>
                  <img src={nft.image} />
                  <div>
                    <p>Price: {nft.price} Matic</p>
                  </div>
                </div>
              ))
            }
          </div>
      </div>

      <div>
        <div>
          <div>
            {
              Boolean(sold.length) && (
                <div>
                  <h2>NFTs Sold</h2>
                  <div className="grid me">
                    {
                      sold.map((nft, i) => (
                        <div>
                          <img src={nft.image} />
                          <div>
                            <p>Price: {nft.price} Matic</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>

    </div>
  )
}