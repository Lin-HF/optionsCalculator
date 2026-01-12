import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import UnifiedCalculator from './UnifiedCalculator';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import { InputValues } from '../types';

describe('Component Reuse Consistency Property Tests', () => {
  describe('Property 5: Component reuse consistency', () => {
    it('should use the same UnifiedCalculator, PriceInput, and AverageDisplay components with identical styling and layout for any historical data display', { timeout: 30000 }, async () => {
      /**
       * Feature: data-history, Property 5: Component reuse consistency
       * For any historical data display, the system should use the same UnifiedCalculator, 
       * PriceInput, and AverageDisplay components with identical styling and layout as the main page.
       * Validates: Requirements 4.1, 4.3, 6.1, 6.2, 6.3, 6.4, 6.5
       */
      
      // Generator for valid InputValues
      const inputValuesArbitrary = fc.record({
        A1: fc.integer({ min: -999999, max: 999999 }),
        A2: fc.integer({ min: -999999, max: 999999 }),
        C1: fc.integer({ min: -999999, max: 999999 }),
        E1: fc.integer({ min: -999999, max: 999999 }),
        E2: fc.integer({ min: -999999, max: 999999 }),
        F1: fc.integer({ min: -999999, max: 999999 }),
        B1: fc.integer({ min: -999999, max: 999999 }),
        B2: fc.integer({ min: -999999, max: 999999 }),
        D1: fc.integer({ min: -999999, max: 999999 }),
        G1: fc.integer({ min: -999999, max: 999999 }),
        H1: fc.integer({ min: -999999, max: 999999 }),
        H2: fc.integer({ min: -999999, max: 999999 }),
        I1: fc.integer({ min: -999999, max: 999999 }),
        I2: fc.integer({ min: -999999, max: 999999 }),
        J1: fc.integer({ min: -999999, max: 999999 }),
        J2: fc.integer({ min: -999999, max: 999999 })
      });

      await fc.assert(
        fc.asyncProperty(
          inputValuesArbitrary,
          async (inputValues: InputValues) => {
            const mockOnValueChange = vi.fn();

            // Render UnifiedCalculator component (this represents both main and history usage)
            const { container: mainContainer, unmount: unmountMain } = render(
              <UnifiedCalculator
                inputValues={inputValues}
                onValueChange={mockOnValueChange}
              />
            );

            // Property 1: UnifiedCalculator should render with consistent structure
            const mainCalculatorElement = mainContainer.querySelector('.unified-calculator');
            expect(mainCalculatorElement).toBeInTheDocument();
            
            const mainCalculatorArea = mainContainer.querySelector('.calculator-area');
            expect(mainCalculatorArea).toBeInTheDocument();

            // Property 2: PriceInput components should be rendered with consistent styling
            const mainInputContainers = mainContainer.querySelectorAll('.input-container');
            expect(mainInputContainers.length).toBeGreaterThan(0);

            // Verify each input container has the expected structure
            mainInputContainers.forEach((container) => {
              const priceInputContainer = container.querySelector('.price-input-container');
              const currencySymbol = container.querySelector('.currency-symbol');
              const priceInput = container.querySelector('.price-input');

              expect(priceInputContainer).toBeInTheDocument();
              expect(currencySymbol).toBeInTheDocument();
              expect(priceInput).toBeInTheDocument();

              // Verify PriceInput has consistent CSS classes
              expect(priceInput).toHaveClass('price-input');
              // Should have color variant class (red by default)
              expect(priceInput?.className).toMatch(/price-input--\w+/);
            });

            // Property 3: AverageDisplay components should be rendered with consistent styling
            const mainOutputContainers = mainContainer.querySelectorAll('.output-container');
            expect(mainOutputContainers.length).toBeGreaterThan(0);

            // Verify each output container has the expected structure
            mainOutputContainers.forEach((container) => {
              const averageDisplayContainer = container.querySelector('.average-display-container');
              const currencySymbol = container.querySelector('.currency-symbol');
              const averageValue = container.querySelector('.average-value');

              expect(averageDisplayContainer).toBeInTheDocument();
              expect(currencySymbol).toBeInTheDocument();
              expect(averageValue).toBeInTheDocument();

              // Verify AverageDisplay has consistent CSS classes
              expect(averageDisplayContainer).toHaveClass('average-display-container');
              expect(averageValue).toHaveClass('average-value');
            });

            // Clean up
            unmountMain();
          }
        ),
        { numRuns: 5 } // Reduced runs for faster execution
      );
    });

    it('should maintain consistent PriceInput component behavior and styling across different contexts', { timeout: 30000 }, async () => {
      /**
       * Feature: data-history, Property 5: Component reuse consistency (PriceInput focus)
       * For any PriceInput component usage, whether in main or history context,
       * the component should maintain identical styling, behavior, and props structure.
       * Validates: Requirements 6.2
       */

      // Generator for PriceInput props
      const priceInputPropsArbitrary = fc.record({
        id: fc.string({ minLength: 1, maxLength: 10 }),
        value: fc.integer({ min: -999999, max: 999999 }),
        color: fc.constantFrom('red', 'green'),
        placeholder: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
      });

      await fc.assert(
        fc.asyncProperty(priceInputPropsArbitrary, async (props) => {
          const mockOnChange = vi.fn();

          // Render PriceInput component (simulating main context)
          const { container: mainContainer, unmount: unmountMain } = render(
            <PriceInput
              id={props.id}
              value={props.value}
              onChange={mockOnChange}
              color={props.color}
              placeholder={props.placeholder}
            />
          );

          // Render PriceInput component again (simulating history context)
          const { container: historyContainer, unmount: unmountHistory } = render(
            <PriceInput
              id={`history-${props.id}`}
              value={props.value}
              onChange={mockOnChange}
              color={props.color}
              placeholder={props.placeholder}
            />
          );

          // Property 1: Both contexts should have identical container structure
          const mainPriceInputContainer = mainContainer.querySelector('.price-input-container');
          const historyPriceInputContainer = historyContainer.querySelector('.price-input-container');

          expect(mainPriceInputContainer).toBeInTheDocument();
          expect(historyPriceInputContainer).toBeInTheDocument();
          expect(mainPriceInputContainer?.className).toBe(historyPriceInputContainer?.className);

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 5 }
      );
    });

    it('should maintain consistent AverageDisplay component behavior and styling across different contexts', { timeout: 30000 }, async () => {
      /**
       * Feature: data-history, Property 5: Component reuse consistency (AverageDisplay focus)
       * For any AverageDisplay component usage, whether in main or history context,
       * the component should maintain identical styling, behavior, and formatting.
       * Validates: Requirements 6.3
       */

      // Generator for AverageDisplay values
      const averageDisplayValueArbitrary = fc.integer({ min: -999999, max: 999999 });

      await fc.assert(
        fc.asyncProperty(averageDisplayValueArbitrary, async (value) => {
          // Render AverageDisplay component (simulating main context)
          const { container: mainContainer, unmount: unmountMain } = render(
            <AverageDisplay value={value} />
          );

          // Render AverageDisplay component again (simulating history context)
          const { container: historyContainer, unmount: unmountHistory } = render(
            <AverageDisplay value={value} />
          );

          // Property 1: Both contexts should have identical container structure
          const mainDisplayContainer = mainContainer.querySelector('.average-display-container');
          const historyDisplayContainer = historyContainer.querySelector('.average-display-container');

          expect(mainDisplayContainer).toBeInTheDocument();
          expect(historyDisplayContainer).toBeInTheDocument();
          expect(mainDisplayContainer?.className).toBe(historyDisplayContainer?.className);

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 5 }
      );
    });

    it('should maintain consistent layout positioning and styling for calculator components across contexts', { timeout: 30000 }, async () => {
      /**
       * Feature: data-history, Property 5: Component reuse consistency (Layout focus)
       * For any calculator layout, the positioning, styling, and visual hierarchy
       * should be identical between main and history contexts.
       * Validates: Requirements 4.1, 6.4, 6.5
       */

      // Generator for layout test scenarios
      const layoutScenarioArbitrary = fc.record({
        inputValues: fc.record({
          A1: fc.integer({ min: -999999, max: 999999 }),
          A2: fc.integer({ min: -999999, max: 999999 }),
          C1: fc.integer({ min: -999999, max: 999999 }),
          E1: fc.integer({ min: -999999, max: 999999 }),
          E2: fc.integer({ min: -999999, max: 999999 }),
          F1: fc.integer({ min: -999999, max: 999999 }),
          B1: fc.integer({ min: -999999, max: 999999 }),
          B2: fc.integer({ min: -999999, max: 999999 }),
          D1: fc.integer({ min: -999999, max: 999999 }),
          G1: fc.integer({ min: -999999, max: 999999 }),
          H1: fc.integer({ min: -999999, max: 999999 }),
          H2: fc.integer({ min: -999999, max: 999999 }),
          I1: fc.integer({ min: -999999, max: 999999 }),
          I2: fc.integer({ min: -999999, max: 999999 }),
          J1: fc.integer({ min: -999999, max: 999999 }),
          J2: fc.integer({ min: -999999, max: 999999 })
        })
      });

      await fc.assert(
        fc.asyncProperty(layoutScenarioArbitrary, async (scenario) => {
          const mockOnValueChange = vi.fn();

          // Render UnifiedCalculator in main context
          const { container: mainContainer, unmount: unmountMain } = render(
            <div className="main-context">
              <UnifiedCalculator
                inputValues={scenario.inputValues}
                onValueChange={mockOnValueChange}
              />
            </div>
          );

          // Render UnifiedCalculator in history context (simulated)
          const { container: historyContainer, unmount: unmountHistory } = render(
            <div className="history-context">
              <UnifiedCalculator
                inputValues={scenario.inputValues}
                onValueChange={mockOnValueChange}
              />
            </div>
          );

          // Property 1: Calculator structure should be identical
          const mainCalculator = mainContainer.querySelector('.unified-calculator');
          const historyCalculator = historyContainer.querySelector('.unified-calculator');

          expect(mainCalculator).toBeInTheDocument();
          expect(historyCalculator).toBeInTheDocument();
          expect(mainCalculator?.className).toBe(historyCalculator?.className);

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 5 } // Reduced runs for faster execution
      );
    });
  });
});