import Link from 'next/link';
import styled from 'styled-components';

const Navigation = styled.nav`
  // border-bottom: 1px solid white;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  backdrop-filter: blur(10px);
  height: 100px;

` 

const Logo = styled.p`
  display: inline;
  font-size: 40px;
  font-weight: 800;
  margin: 0;
`

const LinkContainer = styled.div`
  display: inline;
  float: right;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

const Links = styled.a`
  margin-right: 1.5rem;
  cursor: pointer;
`

export default function Nav({ Component, pageProps }) {
  return (
    <div>
      <Navigation>
        <Logo><Link href="/">NFTeee</Link></Logo>
        <LinkContainer>
          <Link href="/nftmarket">
            <Links>Market</Links>
          </Link>
          <Link href="/createitem">
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
    </div>
  )
}