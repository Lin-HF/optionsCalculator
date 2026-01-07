import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Integration Tests', () => {
  describe('Complete Input-to-Output Flow', () => {
    it('should calculate and display averages when inputs are provided', async () => {
      render(<App />);
      
      // Test left column calculation: A1 + A2 = A3
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Input values
      fireEvent.change(a1Input, { target: { value: '10' } });
      fireEvent.change(a2Input, { target: { value: '20' } });
      
      // Check that A3 displays the correct average
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('15'); // (10 + 20) / 2 = 15
      });
    });

    it('should handle cross-column input dependencies', async () => {
      render(<App />);
      
      // Test cross-column calculation: A2 + C1 = C2
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      const c1Input = document.getElementById('C1') as HTMLInputElement;
      
      // Input values
      fireEvent.change(a2Input, { target: { value: '30' } });
      fireEvent.change(c1Input, { target: { value: '50' } });
      
      // Check that C2 displays the correct average
      await waitFor(() => {
        const c2Output = screen.getByTestId('output-C2');
        const c2Value = c2Output.querySelector('.average-value');
        expect(c2Value).toHaveTextContent('40'); // (30 + 50) / 2 = 40
      });
    });

    it('should handle multiple calculations from same input', async () => {
      render(<App />);
      
      // E1 is used in both E3 (E1+E2) and F2 (E1+F1) calculations
      const e1Input = document.getElementById('E1') as HTMLInputElement;
      const e2Input = document.getElementById('E2') as HTMLInputElement;
      const f1Input = document.getElementById('F1') as HTMLInputElement;
      
      // Input values
      fireEvent.change(e1Input, { target: { value: '100' } });
      fireEvent.change(e2Input, { target: { value: '200' } });
      fireEvent.change(f1Input, { target: { value: '300' } });
      
      // Check both calculations update correctly
      await waitFor(() => {
        const e3Output = screen.getByTestId('output-E3');
        const f2Output = screen.getByTestId('output-F2');
        const e3Value = e3Output.querySelector('.average-value');
        const f2Value = f2Output.querySelector('.average-value');
        
        expect(e3Value).toHaveTextContent('150'); // (100 + 200) / 2 = 150
        expect(f2Value).toHaveTextContent('200'); // (100 + 300) / 2 = 200
      });
    });
  });

  describe('State Management Correctness', () => {
    it('should immediately update calculations when input values change (Requirement 2.5)', async () => {
      render(<App />);
      
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Initial calculation
      fireEvent.change(a1Input, { target: { value: '10' } });
      fireEvent.change(a2Input, { target: { value: '20' } });
      
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('15');
      });
      
      // Change one input and verify immediate update
      fireEvent.change(a1Input, { target: { value: '30' } });
      
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('25'); // (30 + 20) / 2 = 25
      });
    });

    it('should immediately update calculations when input values change (Requirement 3.5)', async () => {
      render(<App />);
      
      const b1Input = document.getElementById('B1') as HTMLInputElement;
      const b2Input = document.getElementById('B2') as HTMLInputElement;
      
      // Initial calculation
      fireEvent.change(b1Input, { target: { value: '40' } });
      fireEvent.change(b2Input, { target: { value: '60' } });
      
      await waitFor(() => {
        const b3Output = screen.getByTestId('output-B3');
        const b3Value = b3Output.querySelector('.average-value');
        expect(b3Value).toHaveTextContent('50');
      });
      
      // Change one input and verify immediate update
      fireEvent.change(b2Input, { target: { value: '80' } });
      
      await waitFor(() => {
        const b3Output = screen.getByTestId('output-B3');
        const b3Value = b3Output.querySelector('.average-value');
        expect(b3Value).toHaveTextContent('60'); // (40 + 80) / 2 = 60
      });
    });

    it('should immediately update calculations when input values change (Requirement 4.5)', async () => {
      render(<App />);
      
      const i1Input = document.getElementById('I1') as HTMLInputElement;
      const i2Input = document.getElementById('I2') as HTMLInputElement;
      
      // Initial calculation
      fireEvent.change(i1Input, { target: { value: '70' } });
      fireEvent.change(i2Input, { target: { value: '90' } });
      
      await waitFor(() => {
        const i3Output = screen.getByTestId('output-I3');
        const i3Value = i3Output.querySelector('.average-value');
        expect(i3Value).toHaveTextContent('80');
      });
      
      // Change one input and verify immediate update
      fireEvent.change(i1Input, { target: { value: '110' } });
      
      await waitFor(() => {
        const i3Output = screen.getByTestId('output-I3');
        const i3Value = i3Output.querySelector('.average-value');
        expect(i3Value).toHaveTextContent('100'); // (110 + 90) / 2 = 100
      });
    });

    it('should maintain state consistency across all columns', async () => {
      render(<App />);
      
      // Set values in all columns
      const inputs = [
        { id: 'A1', value: '10' },
        { id: 'A2', value: '20' },
        { id: 'B1', value: '30' },
        { id: 'B2', value: '40' },
        { id: 'I1', value: '50' },
        { id: 'I2', value: '60' }
      ];
      
      // Input all values
      inputs.forEach(({ id, value }) => {
        const input = document.getElementById(id) as HTMLInputElement;
        fireEvent.change(input, { target: { value } });
      });
      
      // Verify all calculations are correct
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const b3Output = screen.getByTestId('output-B3');
        const i3Output = screen.getByTestId('output-I3');
        
        const a3Value = a3Output.querySelector('.average-value');
        const b3Value = b3Output.querySelector('.average-value');
        const i3Value = i3Output.querySelector('.average-value');
        
        expect(a3Value).toHaveTextContent('15'); // (10+20)/2
        expect(b3Value).toHaveTextContent('35'); // (30+40)/2
        expect(i3Value).toHaveTextContent('55'); // (50+60)/2
      });
    });

    it('should handle empty inputs as zero values', async () => {
      render(<App />);
      
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Set one input, leave other empty
      fireEvent.change(a1Input, { target: { value: '20' } });
      fireEvent.change(a2Input, { target: { value: '' } }); // Empty should be treated as 0
      
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('10'); // (20 + 0) / 2 = 10
      });
    });

    it('should handle decimal calculations correctly', async () => {
      render(<App />);
      
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Input decimal values
      fireEvent.change(a1Input, { target: { value: '10.5' } });
      fireEvent.change(a2Input, { target: { value: '20.3' } });
      
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('15.4'); // (10.5 + 20.3) / 2 = 15.4
      });
    });

    it('should handle negative numbers correctly', async () => {
      render(<App />);
      
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Input negative values
      fireEvent.change(a1Input, { target: { value: '-10' } });
      fireEvent.change(a2Input, { target: { value: '30' } });
      
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('10'); // (-10 + 30) / 2 = 10
      });
    });
  });

  describe('Complete System Integration', () => {
    it('should maintain calculation accuracy with complex interdependencies', async () => {
      render(<App />);
      
      // Test complex scenario where one input affects multiple outputs
      // E1 affects both E3 and F2 calculations
      const e1Input = document.getElementById('E1') as HTMLInputElement;
      const e2Input = document.getElementById('E2') as HTMLInputElement;
      const f1Input = document.getElementById('F1') as HTMLInputElement;
      
      // Set initial values
      fireEvent.change(e1Input, { target: { value: '100' } });
      fireEvent.change(e2Input, { target: { value: '200' } });
      fireEvent.change(f1Input, { target: { value: '300' } });
      
      // Verify initial calculations
      await waitFor(() => {
        const e3Output = screen.getByTestId('output-E3');
        const f2Output = screen.getByTestId('output-F2');
        const e3Value = e3Output.querySelector('.average-value');
        const f2Value = f2Output.querySelector('.average-value');
        
        expect(e3Value).toHaveTextContent('150'); // (100+200)/2
        expect(f2Value).toHaveTextContent('200'); // (100+300)/2
      });
      
      // Change E1 and verify both dependent calculations update
      fireEvent.change(e1Input, { target: { value: '400' } });
      
      await waitFor(() => {
        const e3Output = screen.getByTestId('output-E3');
        const f2Output = screen.getByTestId('output-F2');
        const e3Value = e3Output.querySelector('.average-value');
        const f2Value = f2Output.querySelector('.average-value');
        
        expect(e3Value).toHaveTextContent('300'); // (400+200)/2
        expect(f2Value).toHaveTextContent('350'); // (400+300)/2
      });
    });

    it('should handle rapid input changes without state corruption', async () => {
      render(<App />);
      
      const a1Input = document.getElementById('A1') as HTMLInputElement;
      const a2Input = document.getElementById('A2') as HTMLInputElement;
      
      // Rapid sequence of changes
      const values = ['10', '20', '30', '40', '50'];
      
      for (const value of values) {
        fireEvent.change(a1Input, { target: { value } });
        fireEvent.change(a2Input, { target: { value: '100' } });
      }
      
      // Final state should be correct
      await waitFor(() => {
        const a3Output = screen.getByTestId('output-A3');
        const a3Value = a3Output.querySelector('.average-value');
        expect(a3Value).toHaveTextContent('75'); // (50 + 100) / 2 = 75
      });
    });
  });
});