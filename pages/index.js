import styled, { css } from 'styled-components';

const Container = styled.div`
`

const Cushion = styled.div`
  margin-top: 100px;
  margin-left: 100px;
`

const Typography = styled.p`
  ${props => props.header && css`
    padding: 0;
    margin-top: -50px;
    margin-bottom: -75px;
    font-size: 150px; 
    font-weight: 600;
    letter-spacing: -5px;
  `}  
`

export default function Home() {
  return (
    <Container>
      <Cushion>
        <Typography header>Create it.</Typography>
        <Typography header>Mint it.</Typography>
        <Typography header>Share it now.</Typography>
      </Cushion>
    </Container>
  )
}
