import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the price calculator title', () => {
    render(<App />)
    expect(screen.getByText('Price Calculator')).toBeInTheDocument()
  })

  it('renders the placeholder text', () => {
    render(<App />)
    expect(screen.getByText('Price calculator application will be implemented here.')).toBeInTheDocument()
  })
})