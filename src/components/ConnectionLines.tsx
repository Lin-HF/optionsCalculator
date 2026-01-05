import React, { useEffect, useRef, useState } from 'react';
import './ConnectionLines.css';

interface ConnectionLinesProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

interface LineConnection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  id: string;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ containerRef }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<LineConnection[]>([]);

  const calculateConnections = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newConnections: LineConnection[] = [];

    // Define the connection mappings (input pairs to their averages)
    const connectionMappings = [
      { inputs: ['A1', 'A2'], output: 'A3' },
      { inputs: ['B1', 'B2'], output: 'B3' },
      { inputs: ['I1', 'I2'], output: 'I3' },
      { inputs: ['C1'], output: 'C2' }, // Single input connections
      { inputs: ['D1'], output: 'D2' },
      { inputs: ['E1', 'E2'], output: 'E3' },
      { inputs: ['F1'], output: 'F2' },
      { inputs: ['G1'], output: 'G2' },
      { inputs: ['H1', 'H2'], output: 'H3' },
      { inputs: ['J1', 'J2'], output: 'J3' },
    ];

    connectionMappings.forEach(({ inputs, output }) => {
      // Find input elements
      const inputElements = inputs.map(id => 
        container.querySelector(`[data-input-id="${id}"]`) as HTMLElement
      ).filter(Boolean);

      // Find output element
      const outputElement = container.querySelector(`[data-output-id="${output}"]`) as HTMLElement;

      if (inputElements.length > 0 && outputElement) {
        // Calculate center point of inputs
        let inputCenterX = 0;
        let inputCenterY = 0;

        inputElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          inputCenterX += rect.left + rect.width / 2 - containerRect.left;
          inputCenterY += rect.top + rect.height / 2 - containerRect.top;
        });

        inputCenterX /= inputElements.length;
        inputCenterY /= inputElements.length;

        // Calculate output center
        const outputRect = outputElement.getBoundingClientRect();
        const outputCenterX = outputRect.left + outputRect.width / 2 - containerRect.left;
        const outputCenterY = outputRect.top + outputRect.height / 2 - containerRect.top;

        newConnections.push({
          from: { x: inputCenterX, y: inputCenterY },
          to: { x: outputCenterX, y: outputCenterY },
          id: `${inputs.join('-')}-to-${output}`
        });
      }
    });

    setConnections(newConnections);
  };

  useEffect(() => {
    const handleResize = () => {
      setTimeout(calculateConnections, 100); // Small delay to ensure layout is complete
    };

    // Initial calculation
    setTimeout(calculateConnections, 500);

    // Recalculate on window resize
    window.addEventListener('resize', handleResize);

    // Recalculate when container changes (using MutationObserver)
    if (containerRef.current) {
      const observer = new MutationObserver(handleResize);
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  if (!containerRef.current) return null;

  return (
    <svg
      ref={svgRef}
      className="connection-lines"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#666"
          />
        </marker>
      </defs>
      
      {connections.map((connection) => (
        <line
          key={connection.id}
          x1={connection.from.x}
          y1={connection.from.y}
          x2={connection.to.x}
          y2={connection.to.y}
          stroke="#666"
          strokeWidth="2"
          strokeDasharray="5,5"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />
      ))}
    </svg>
  );
};

export default ConnectionLines;