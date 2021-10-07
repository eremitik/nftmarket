import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateItem () {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch(e) {
      console.log(e)
    }
  }

  async function createItem() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (e) {
      console.log('Error uploading file: ', e)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()

    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(
      nftaddress, tokenId, price, { value: listingPrice }
    )
    await transaction.wait()
    router.push('/')
  }

  return (
    <div>
      <div>
        <input
          placeholder="Name"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })} 
        />
        <input
          placeholder="Price in Matic"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })} 
        />
        {
          fileUrl && (
            <img src={fileUrl}/>
          )
        }
        <input
          type="file"
          name="Asset"
          onChange={onChange}
        />
        <button onClick={createItem}>Submit NFT</button>

      </div>
    </div>
  )
}