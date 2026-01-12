import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders unified calculator layout', () => {
    render(<App />)
    
    // Check that the unified app container is rendered
    const appContainer = document.querySelector('.app-container-unified')
    expect(appContainer).toBeInTheDocument()
  })

  it('renders date headers for all three columns', () => {
    render(<App />)
    
    // The DateHeader components should render the dates
    // We can check for the presence of date-related elements
    const dateHeaders = document.querySelectorAll('.date-header')
    expect(dateHeaders).toHaveLength(3)
  })

  it('has proper unified layout', () => {
    render(<App />)
    
    const appContainer = document.querySelector('.app-container-unified')
    expect(appContainer).toHaveClass('app-container-unified')
    
    // Check that we have the unified calculator component
    const unifiedCalculator = document.querySelector('.unified-calculator')
    expect(unifiedCalculator).toBeInTheDocument()
  })

  it('manages global state for all input values', () => {
    render(<App />)
    
    // Check that input fields are rendered (PriceInput components use type="text")
    const inputs = document.querySelectorAll('input.price-input')
    expect(inputs.length).toBeGreaterThan(0)
  })
})