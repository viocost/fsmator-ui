# State Machine Simulator

An interactive web application for visualizing and testing state machines built with the [fsmator](https://www.npmjs.com/package/fsmator) library. This app provides a beautiful, real-time interface to explore state machine behavior with instant feedback.

## Features

- **Interactive State Diagram**: Visual representation of state machines using Cytoscape.js with dagre layout
- **Live State Highlighting**: Active states are highlighted in green, halted final states in orange
- **Code Editor**: Monaco editor for writing and editing state machine configurations with example templates
- **Event Controls**: Send events with custom payloads to transition between states
- **Time Travel**: Rewind and fast-forward through state history with visual controls
- **Right-Click Interactions**: 
  - Click edges to send events instantly
  - Right-click edges to send events with custom payloads
  - Right-click nodes to see all available events
- **Event Log**: Track all events sent with expandable details showing payloads and resulting states
- **Example Configurations**: Pre-built examples including counter, traffic light, form workflow, and parallel media player
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preference
- **Real-time Feedback**: Watch the diagram update instantly as events are processed
- **Beautiful UI**: Sleek, modern design with Tailwind CSS

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

### Three-Tab Interface

The app features three main tabs:

#### 1. Controls & State
- View current state and context
- Send events with buttons
- View event log with detailed history
- Use time travel controls to rewind/forward through history

#### 2. Code Editor
- Load example configurations from the header buttons
- Edit state machine configurations in Monaco editor
- Click "Load & Start Machine" to initialize your configuration

#### 3. Interactive Diagram
- Visual representation of your state machine
- **Left-click edges**: Send event immediately
- **Right-click edges**: Send event with custom payload
- **Right-click nodes**: View and send any available event
- **Left-click nodes**: Highlight node and connected edges
- Use zoom controls and fullscreen mode
- Time travel controls are also available here

### Quick Start

1. **Load an Example**: In the Code Editor tab, click one of the example buttons (Counter, Traffic Light, Form Workflow, Media Player)

2. **Start the Machine**: Click "Load & Start Machine" to initialize the state machine

3. **Send Events**: 
   - Switch to "Controls & State" tab to use event buttons
   - Switch to "Interactive Diagram" tab to interact with the visual representation
   - Click on edges to send events
   - Right-click for more options

4. **Explore Time Travel**: Use the ⏪ and ⏩ buttons to navigate through history

5. **Reset**: Click "Reset" to restart the machine from the initial state

## State Machine Configuration

The app uses the fsmator library which follows XState-compatible semantics. Here's a basic example:

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

## Key Features of fsmator Library

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
- **fsmator** - State machine engine (npm package)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── StateMachineDiagram.tsx  # Cytoscape visualization
│   │   ├── CodeEditor.tsx            # Monaco code editor
│   │   ├── StateDisplay.tsx          # Current state display
│   │   ├── EventControls.tsx         # Event sending interface
│   │   └── ...                       # Other UI components
│   ├── examples/
│   │   └── index.ts                  # Pre-built examples
│   ├── contexts/
│   │   └── ThemeContext.tsx          # Dark/light theme management
│   ├── App.tsx                       # Main application
│   └── main.tsx                      # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## License

MIT
