import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import CalculatorColumn from './CalculatorColumn';
import PriceInput from './PriceInput';
import AverageDisplay from './AverageDisplay';
import { InputValues } from '../types';

describe('Component Reuse Consistency Property Tests', () => {
  describe('Property 5: Component reuse consistency', () => {
    it('should use the same CalculatorColumn, PriceInput, and AverageDisplay components with identical styling and layout for any historical data display', { timeout: 30000 }, async () => {
      /**
       * Feature: data-history, Property 5: Component reuse consistency
       * For any historical data display, the system should use the same CalculatorColumn, 
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

      // Generator for column indices (0, 1, 2 for left, middle, right columns)
      const columnIndexArbitrary = fc.integer({ min: 0, max: 2 });

      // Generator for week offsets
      const weekOffsetArbitrary = fc.integer({ min: 0, max: 2 });

      await fc.assert(
        fc.asyncProperty(
          inputValuesArbitrary,
          columnIndexArbitrary,
          weekOffsetArbitrary,
          async (inputValues: InputValues, columnIndex: number, weekOffset: number) => {
            const mockOnValueChange = vi.fn();

            // Render CalculatorColumn component (this represents both main and history usage)
            const { container: mainContainer, unmount: unmountMain } = render(
              <CalculatorColumn
                weekOffset={weekOffset}
                columnIndex={columnIndex}
                inputValues={inputValues}
                onValueChange={mockOnValueChange}
              />
            );

            // Property 1: CalculatorColumn should render with consistent structure
            const mainColumnElement = mainContainer.querySelector('.calculator-column');
            expect(mainColumnElement).toBeInTheDocument();
            
            const mainCalculatorArea = mainContainer.querySelector('.calculator-area');
            expect(mainCalculatorArea).toBeInTheDocument();

            // Property 2: PriceInput components should be rendered with consistent styling
            const mainInputContainers = mainContainer.querySelectorAll('.input-container');
            expect(mainInputContainers.length).toBeGreaterThan(0);

            // Verify each input container has the expected structure
            mainInputContainers.forEach((container) => {
              const label = container.querySelector('.input-label');
              const priceInputContainer = container.querySelector('.price-input-container');
              const currencySymbol = container.querySelector('.currency-symbol');
              const priceInput = container.querySelector('.price-input');

              expect(label).toBeInTheDocument();
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

            // Property 4: Component structure should be identical regardless of input values
            // Render the same component with different input values to verify structural consistency
            const differentInputValues: InputValues = {
              A1: inputValues.A1 + 1000,
              A2: inputValues.A2 + 1000,
              C1: inputValues.C1 + 1000,
              E1: inputValues.E1 + 1000,
              E2: inputValues.E2 + 1000,
              F1: inputValues.F1 + 1000,
              B1: inputValues.B1 + 1000,
              B2: inputValues.B2 + 1000,
              D1: inputValues.D1 + 1000,
              G1: inputValues.G1 + 1000,
              H1: inputValues.H1 + 1000,
              H2: inputValues.H2 + 1000,
              I1: inputValues.I1 + 1000,
              I2: inputValues.I2 + 1000,
              J1: inputValues.J1 + 1000,
              J2: inputValues.J2 + 1000
            };

            const { container: secondContainer, unmount: unmountSecond } = render(
              <CalculatorColumn
                weekOffset={weekOffset}
                columnIndex={columnIndex}
                inputValues={differentInputValues}
                onValueChange={mockOnValueChange}
              />
            );

            // Verify structural consistency between different input values
            const secondColumnElement = secondContainer.querySelector('.calculator-column');
            const secondCalculatorArea = secondContainer.querySelector('.calculator-area');
            const secondInputContainers = secondContainer.querySelectorAll('.input-container');
            const secondOutputContainers = secondContainer.querySelectorAll('.output-container');

            expect(secondColumnElement).toBeInTheDocument();
            expect(secondCalculatorArea).toBeInTheDocument();
            expect(secondInputContainers.length).toBe(mainInputContainers.length);
            expect(secondOutputContainers.length).toBe(mainOutputContainers.length);

            // Property 5: CSS classes should be identical regardless of data
            expect(secondColumnElement?.className).toBe(mainColumnElement?.className);
            expect(secondCalculatorArea?.className).toBe(mainCalculatorArea?.className);

            // Verify input containers have identical structure and classes
            for (let i = 0; i < mainInputContainers.length; i++) {
              const mainInput = mainInputContainers[i].querySelector('.price-input');
              const secondInput = secondInputContainers[i].querySelector('.price-input');
              
              expect(mainInput?.className).toBe(secondInput?.className);
            }

            // Verify output containers have identical structure and classes
            for (let i = 0; i < mainOutputContainers.length; i++) {
              const mainOutput = mainOutputContainers[i].querySelector('.average-display-container');
              const secondOutput = secondOutputContainers[i].querySelector('.average-display-container');
              
              expect(mainOutput?.className).toBe(secondOutput?.className);
            }

            // Clean up
            unmountMain();
            unmountSecond();
          }
        ),
        { numRuns: 20 } // Run 20 iterations for reasonable execution time
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

          // Property 2: Currency symbols should be identical
          const mainCurrencySymbol = mainContainer.querySelector('.currency-symbol');
          const historyCurrencySymbol = historyContainer.querySelector('.currency-symbol');

          expect(mainCurrencySymbol).toBeInTheDocument();
          expect(historyCurrencySymbol).toBeInTheDocument();
          expect(mainCurrencySymbol?.className).toBe(historyCurrencySymbol?.className);
          expect(mainCurrencySymbol?.textContent).toBe(historyCurrencySymbol?.textContent);

          // Property 3: Input elements should have identical styling and attributes
          const mainInput = mainContainer.querySelector('.price-input') as HTMLInputElement;
          const historyInput = historyContainer.querySelector('.price-input') as HTMLInputElement;

          expect(mainInput).toBeInTheDocument();
          expect(historyInput).toBeInTheDocument();

          // Verify CSS classes are identical (except for ID-specific differences)
          const mainClasses = mainInput.className.split(' ').sort();
          const historyClasses = historyInput.className.split(' ').sort();
          expect(mainClasses).toEqual(historyClasses);

          // Verify attributes are consistent
          expect(mainInput.getAttribute('inputMode')).toBe(historyInput.getAttribute('inputMode'));
          expect(mainInput.getAttribute('autoComplete')).toBe(historyInput.getAttribute('autoComplete'));
          expect(mainInput.getAttribute('placeholder')).toBe(historyInput.getAttribute('placeholder'));

          // Property 4: Values should be displayed consistently
          expect(mainInput.value).toBe(historyInput.value);

          // Property 5: Color variants should be applied consistently
          if (props.color === 'red') {
            expect(mainInput).toHaveClass('price-input--red');
            expect(historyInput).toHaveClass('price-input--red');
            expect(mainCurrencySymbol).toHaveClass('currency-symbol--red');
            expect(historyCurrencySymbol).toHaveClass('currency-symbol--red');
          } else if (props.color === 'green') {
            expect(mainInput).toHaveClass('price-input--green');
            expect(historyInput).toHaveClass('price-input--green');
            expect(mainCurrencySymbol).toHaveClass('currency-symbol--green');
            expect(historyCurrencySymbol).toHaveClass('currency-symbol--green');
          }

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 20 }
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

          // Property 2: Currency symbols should be identical
          const mainCurrencySymbol = mainContainer.querySelector('.currency-symbol');
          const historyCurrencySymbol = historyContainer.querySelector('.currency-symbol');

          expect(mainCurrencySymbol).toBeInTheDocument();
          expect(historyCurrencySymbol).toBeInTheDocument();
          expect(mainCurrencySymbol?.className).toBe(historyCurrencySymbol?.className);
          expect(mainCurrencySymbol?.textContent).toBe(historyCurrencySymbol?.textContent);

          // Property 3: Value elements should have identical styling and content
          const mainValueElement = mainContainer.querySelector('.average-value');
          const historyValueElement = historyContainer.querySelector('.average-value');

          expect(mainValueElement).toBeInTheDocument();
          expect(historyValueElement).toBeInTheDocument();
          expect(mainValueElement?.className).toBe(historyValueElement?.className);
          expect(mainValueElement?.textContent).toBe(historyValueElement?.textContent);

          // Property 4: Value formatting should be consistent
          // Both should format the same value identically
          const expectedFormattedValue = mainValueElement?.textContent;
          expect(historyValueElement?.textContent).toBe(expectedFormattedValue);

          // Property 5: DOM structure should be identical
          expect(mainContainer.innerHTML).toBe(historyContainer.innerHTML);

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 20 }
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
        columnIndex: fc.integer({ min: 0, max: 2 }),
        weekOffset: fc.integer({ min: 0, max: 2 }),
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

          // Render CalculatorColumn in main context
          const { container: mainContainer, unmount: unmountMain } = render(
            <div className="main-context">
              <CalculatorColumn
                weekOffset={scenario.weekOffset}
                columnIndex={scenario.columnIndex}
                inputValues={scenario.inputValues}
                onValueChange={mockOnValueChange}
              />
            </div>
          );

          // Render CalculatorColumn in history context (simulated)
          const { container: historyContainer, unmount: unmountHistory } = render(
            <div className="history-context">
              <CalculatorColumn
                weekOffset={scenario.weekOffset}
                columnIndex={scenario.columnIndex}
                inputValues={scenario.inputValues}
                onValueChange={mockOnValueChange}
              />
            </div>
          );

          // Property 1: Calculator column structure should be identical
          const mainColumn = mainContainer.querySelector('.calculator-column');
          const historyColumn = historyContainer.querySelector('.calculator-column');

          expect(mainColumn).toBeInTheDocument();
          expect(historyColumn).toBeInTheDocument();
          expect(mainColumn?.className).toBe(historyColumn?.className);

          // Property 2: Calculator area should have identical structure
          const mainArea = mainContainer.querySelector('.calculator-area');
          const historyArea = historyContainer.querySelector('.calculator-area');

          expect(mainArea).toBeInTheDocument();
          expect(historyArea).toBeInTheDocument();
          expect(mainArea?.className).toBe(historyArea?.className);

          // Property 3: Input containers should have identical positioning and styling
          const mainInputContainers = mainContainer.querySelectorAll('.input-container');
          const historyInputContainers = historyContainer.querySelectorAll('.input-container');

          expect(mainInputContainers.length).toBe(historyInputContainers.length);

          for (let i = 0; i < mainInputContainers.length; i++) {
            const mainInputContainer = mainInputContainers[i] as HTMLElement;
            const historyInputContainer = historyInputContainers[i] as HTMLElement;

            // Verify positioning styles are identical
            expect(mainInputContainer.style.position).toBe(historyInputContainer.style.position);
            expect(mainInputContainer.style.left).toBe(historyInputContainer.style.left);
            expect(mainInputContainer.style.top).toBe(historyInputContainer.style.top);
            expect(mainInputContainer.className).toBe(historyInputContainer.className);
          }

          // Property 4: Output containers should have identical positioning and styling
          const mainOutputContainers = mainContainer.querySelectorAll('.output-container');
          const historyOutputContainers = historyContainer.querySelectorAll('.output-container');

          expect(mainOutputContainers.length).toBe(historyOutputContainers.length);

          for (let i = 0; i < mainOutputContainers.length; i++) {
            const mainOutputContainer = mainOutputContainers[i] as HTMLElement;
            const historyOutputContainer = historyOutputContainers[i] as HTMLElement;

            // Verify positioning styles are identical
            expect(mainOutputContainer.style.position).toBe(historyOutputContainer.style.position);
            expect(mainOutputContainer.style.left).toBe(historyOutputContainer.style.left);
            expect(mainOutputContainer.style.top).toBe(historyOutputContainer.style.top);
            expect(mainOutputContainer.className).toBe(historyOutputContainer.className);
          }

          // Property 5: Connection lines (SVG) should be identical
          const mainSvg = mainContainer.querySelector('.connection-lines');
          const historySvg = historyContainer.querySelector('.connection-lines');

          if (mainSvg && historySvg) {
            expect(mainSvg.className.baseVal).toBe(historySvg.className.baseVal);
            expect(mainSvg.getAttribute('width')).toBe(historySvg.getAttribute('width'));
            expect(mainSvg.getAttribute('height')).toBe(historySvg.getAttribute('height'));
            
            // Verify line elements are identical
            const mainLines = mainSvg.querySelectorAll('line');
            const historyLines = historySvg.querySelectorAll('line');
            expect(mainLines.length).toBe(historyLines.length);

            for (let i = 0; i < mainLines.length; i++) {
              const mainLine = mainLines[i];
              const historyLine = historyLines[i];
              
              expect(mainLine.getAttribute('x1')).toBe(historyLine.getAttribute('x1'));
              expect(mainLine.getAttribute('y1')).toBe(historyLine.getAttribute('y1'));
              expect(mainLine.getAttribute('x2')).toBe(historyLine.getAttribute('x2'));
              expect(mainLine.getAttribute('y2')).toBe(historyLine.getAttribute('y2'));
              expect(mainLine.getAttribute('stroke')).toBe(historyLine.getAttribute('stroke'));
              expect(mainLine.getAttribute('strokeWidth')).toBe(historyLine.getAttribute('strokeWidth'));
            }
          }

          // Property 6: Middle column special styling should be consistent
          if (scenario.columnIndex === 1) {
            expect(mainColumn).toHaveClass('calculator-column--middle');
            expect(historyColumn).toHaveClass('calculator-column--middle');
          } else {
            expect(mainColumn).not.toHaveClass('calculator-column--middle');
            expect(historyColumn).not.toHaveClass('calculator-column--middle');
          }

          // Clean up
          unmountMain();
          unmountHistory();
        }),
        { numRuns: 15 } // Slightly fewer runs due to complexity
      );
    });
  });
});