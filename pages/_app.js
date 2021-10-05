import '../styles/globals.css'
import Link from 'next/link';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`

const theme = {
  color: {
    primary: 'black',
  }
}

const Navigation = styled.nav`
  border-bottom: 1px solid white;
` 

const Logo = styled.p`
  font-size: 40px;
  font-weight: 800;
  margin: 0;
`

const LinkContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

const Links = styled.a`
  margin-right: 1.5rem;
  cursor: pointer;
`

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navigation>
        <Logo>NFT Marketplace</Logo>
        <LinkContainer>
          <Link href="/">
            <Links>Home</Links>
          </Link>
          <Link href="/create">
            <Links>List NFT</Links>
          </Link>
          <Link href="/myassets">
            <Links>My NFTs</Links>
          </Link>
          <Link href="/dashboard">
            <Links>Dashboard</Links>
          </Link>
        </LinkContainer>
      </Navigation> 
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
