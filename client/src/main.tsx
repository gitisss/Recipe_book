import { createRoot } from 'react-dom/client'
import { styled } from '@mui/material/styles'
import App from './App.tsx'
import './i18n'

// Global styles using styled components
const GlobalStyles = styled('div')(({ theme }) => ({
  '*': {
    boxSizing: 'border-box',
  },
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  html: {
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
  },
  body: {
    margin: 0,
    padding: 0,
    display: 'flex',
    minWidth: '320px',
    minHeight: '100vh',
    height: '100%',
    width: '100%',
    overflowX: 'hidden',
    fontFamily: theme.typography.fontFamily,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  '#root': {
    height: '100%',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  h1: {
    fontSize: '3.2em',
    lineHeight: 1.1,
  },
  button: {
    borderRadius: '8px',
    border: '1px solid transparent',
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
  },
}))

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyles />
    <App />
  </>
)
