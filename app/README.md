# State Machine Simulator

An interactive web application for visualizing and testing state machines built with the state-reducer library. This app provides a beautiful, real-time interface to explore state machine behavior with instant feedback.

## Features

- **Interactive State Diagram**: Visual representation of state machines using Cytoscape.js with dagre layout
- **Live State Highlighting**: Active states are highlighted in green, making it easy to track the current machine state
- **Code Editor**: Monaco editor for writing and editing state machine configurations
- **Event Controls**: Send events with custom payloads to transition between states
- **Example Configurations**: Pre-built examples including counter, traffic light, form workflow, and parallel media player
- **Real-time Feedback**: Watch the diagram update instantly as events are processed
- **Beautiful UI**: Sleek, modern design with Tailwind CSS and a dark theme

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
pnpm build
pnpm preview
```

## How to Use

1. **Load an Example**: Click one of the example buttons (Counter, Traffic Light, Form Workflow, Media Player) to load a pre-built configuration

2. **Edit Configuration**: Modify the configuration in the code editor. The configuration should export a valid state machine config object

3. **Load & Start**: Click "Load & Start Machine" to initialize the state machine with your configuration

4. **Send Events**: 
   - Click on available event buttons to send events
   - Click on edges in the diagram to trigger transitions
   - Use the custom event section to send events with custom payloads

5. **Watch the Diagram**: The diagram updates in real-time, highlighting active states in green

6. **Reset**: Click "Reset" to restart the machine with the same configuration

## State Machine Configuration

The app uses the state-reducer library which follows XState-compatible semantics. Here's a basic example:

```javascript
const config = {
  initialContext: { count: 0 },
  initial: 'active',
  
  reducers: {
    increment: ({ context }) => ({ count: context.count + 1 }),
  },
  
  states: {
    active: {
      on: {
        INCREMENT: { assign: 'increment' },
      },
    },
  },
};

export default config;
```

## Key Features of State-Reducer Library

- **Pure Reducer-Based**: No side effects, perfect for deterministic state management
- **Hierarchical States**: Support for nested and parallel states
- **Guards**: Conditional transitions based on context
- **Entry/Exit Actions**: Execute reducers when entering/exiting states
- **Always Transitions**: Eventless transitions for automatic routing
- **Final States**: Mark terminal states that halt the machine
- **Time Travel**: Rewind and fast-forward through state history (when enabled)

## Architecture

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Cytoscape.js** - Graph visualization
- **Cytoscape Dagre** - Hierarchical layout
- **Monaco Editor** - Code editing
- **State-Reducer** - State machine engine

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── StateMachineDiagram.tsx  # Cytoscape visualization
│   │   ├── CodeEditor.tsx            # Monaco code editor
│   │   ├── StateDisplay.tsx          # Current state display
│   │   └── EventControls.tsx         # Event sending interface
│   ├── examples/
│   │   └── index.ts                  # Pre-built examples
│   ├── lib/
│   │   └── state-machine/            # State-reducer library
│   ├── App.tsx                       # Main application
│   └── main.tsx                      # Entry point
```

## License

MIT
