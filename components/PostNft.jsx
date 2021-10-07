import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import styled, { css } from 'styled-components';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`

const CardPreview = styled.div`
  margin-left: auto;
  margin-right: auto;

`

const Card = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  border: 1px solid #282828;
  border-radius: 15px;
  height: 350px;
  width: 250px
`

const Image = styled.img`
  border-radius: 10px;
  max-height: 260px; 
  margin: 20px;
`

const Typography = styled.p`
  margin-top: 0;
  
  ${props => props.title && css`
    font-size: 40px;
    font-weight: 800;
  `}

  ${props => props.subtitle && css`
    margin-top: 20px;
    font-size: 20px;
    font-weight: 800; 
  `}
`

const Input = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #282828;
  outline: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  padding-bottom: 10px;
  margin-bottom: 10px;
  ::placeholder {
    color: #484848;
  }  
`

const Button = styled.button`
  width: 200px;
  margin-top: 25px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 25px;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: 0.3s;
  align-items: center;
  text-decoration: none;
  :hover {
    background: white;
    color: black;
  }
`

export default function PostNft () {
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
    <Container>
      <GridContainer>
      <ContentContainer>
        <Typography title>Create a single NFT</Typography>
         <input
          type="file"
          name="Asset"
          onChange={onChange}
        />

        <Typography subtitle>Title</Typography>
       <Input
          placeholder="e.g. My first NFT"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <Typography subtitle>Description</Typography>
        <Input
          placeholder="e.g. This is a one of a kind wonder."
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })} 
        />
        <Typography subtitle>Price in ETH</Typography>
        <Input
          placeholder="Enter a price for one"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })} 
        />
       <Button onClick={createItem}>Submit NFT</Button>
      </ContentContainer>
      <CardPreview>
        <Typography subtitle>Card Preview</Typography>
        <Card>
        {
          fileUrl && (
            <Image src={fileUrl}/>
          )
        }
        </Card>
      </CardPreview>
    </GridContainer>
    </Container>
 )
}