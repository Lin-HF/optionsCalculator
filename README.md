# Price Calculator

A responsive React TypeScript application for calculating price averages across different time periods.

## Features

- Three-column layout for different weeks (本周五, 下周五, 下下周五)
- Real-time price calculation and average display
- Responsive design for desktop and mobile devices
- Property-based testing for correctness validation

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── components/     # React components
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── test/          # Test files
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Technology Stack

- React 18+ with TypeScript
- Vite for build tooling
- Vitest for testing
- fast-check for property-based testing
- CSS for styling