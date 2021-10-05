import '../styles/globals.css'
import Link from 'next/link';
import styled from 'styled-components';

const Navigation = styled.nav`
  border-bottom: 1px solid white;
` 

const Logo = styled.p`
  font-size: 40px;
  font-weight: 800;
`

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navigation>
        <Logo>My first NFT Marketplace</Logo>
        <div>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/create">
            <a>Sell Digital Asset</a>
          </Link>
          <Link href="/myassets">
            <a>My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a>Creator Dashboard</a>
          </Link>
        </div>
      </Navigation> 
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
