import { render, screen, fireEvent } from '@testing-library/react'
import { DomParser } from 'domParser'

test('renders parser, enter website, clicks the button, clears imput value', () => {
  render(<DomParser />)
  const pageElement = screen.getByTestId('dom-parser')
  expect(pageElement).toBeInTheDocument()
  const inputElement = screen.getByPlaceholderText('Enter the URL of a website here!')
  expect(inputElement).toBeInTheDocument()
  fireEvent.input(inputElement, 'www.somewebsite.com')
  fireEvent.click(screen.getByText('Analyze'))
  expect(inputElement).toHaveValue('')
})
