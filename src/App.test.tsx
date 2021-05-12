import { render, screen } from '@testing-library/react'
import App from './App'

test('renders page', () => {
  render(<App />)
  const pageElement = screen.getByTestId('app')
  expect(pageElement).toBeInTheDocument()
})
