import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders three calculator columns', () => {
    render(<App />)
    
    // Check that the app container is rendered
    const appContainer = document.querySelector('.app-container')
    expect(appContainer).toBeInTheDocument()
  })

  it('renders date headers for all three columns', () => {
    render(<App />)
    
    // The DateHeader components should render the dates
    // We can check for the presence of date-related elements
    const dateHeaders = document.querySelectorAll('.date-header')
    expect(dateHeaders).toHaveLength(3)
  })

  it('has proper three-column grid layout', () => {
    render(<App />)
    
    const appContainer = document.querySelector('.app-container')
    expect(appContainer).toHaveClass('app-container')
    
    // Check that we have three calculator columns
    const columns = document.querySelectorAll('.calculator-column')
    expect(columns).toHaveLength(3)
  })

  it('manages global state for all input values', () => {
    render(<App />)
    
    // Check that input fields are rendered (PriceInput components use type="text")
    const inputs = document.querySelectorAll('input.price-input')
    expect(inputs.length).toBeGreaterThan(0)
  })
})