import '../styles/globals.css'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Nav from '../components/Nav.jsx';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  width: 1600px;
`

const theme = {
  color: {
    primary: 'black',
  }
}

const Container = styled.div`
  padding-top: 100px;
  padding-left: 10px;
`

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Nav />
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
