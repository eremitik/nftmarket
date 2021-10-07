import Link from 'next/link';
import styled from 'styled-components';

const Navigation = styled.nav`
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  backdrop-filter: blur(30px);
  height: 100px;

` 

const Logo = styled.p`
  display: inline;
  font-size: 40px;
  font-weight: 900;
  margin: 0;
`

const LinkContainer = styled.div`
  display: inline;
  float: right;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

const Links = styled.a`
  font-weight: 900;
  font-size: 1rem;
  margin-right: 1.5rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: grey;
  }
`

export default function Nav({ Component, pageProps }) {
  return (
    <div>
      <Navigation>
        <Logo><Link href="/">Looot</Link></Logo>
        <LinkContainer>
          <Link href="/nftmarket">
            <Links>Market</Links>
          </Link>
          <Link href="/create">
            <Links>Create</Links>
          </Link>
          <Link href="/collection">
            <Links>Collection</Links>
          </Link>
          <Link href="/dashboard">
            <Links>Dashboard</Links>
          </Link>
        </LinkContainer>
      </Navigation> 
    </div>
  )
}