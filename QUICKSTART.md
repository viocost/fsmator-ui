# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install and Run
```bash
cd app
pnpm install  # if not already done
pnpm dev
```

Open `http://localhost:5173` in your browser.

### 2. Load an Example
Click one of the colorful example buttons at the top:
- **Counter** (Blue) - Simple increment/decrement
- **Traffic Light** (Green) - Sequential transitions
- **Form Workflow** (Purple) - Complex nested states
- **Media Player** (Orange) - Parallel states

### 3. Start Simulating
- Click **"Load & Start Machine"** to initialize
- The diagram appears showing your state machine
- Active states glow **green**
- Click **event buttons** or **diagram edges** to send events
- Watch the state machine react in real-time!

## 💡 Pro Tips

### Sending Events
- **Quick**: Click any event button in the "Send Events" panel
- **Interactive**: Click on edges in the diagram
- **Advanced**: Use "Custom Event" section to send events with JSON payloads

### Exploring the Diagram
- **Zoom**: Use +/- buttons or mouse wheel
- **Reset View**: Click "Reset" button to fit diagram
- **Fullscreen**: Click "Fullscreen" for immersive view
- **Select**: Click nodes to highlight connections
- **Click Edges**: Click on transition arrows to send that event

### Editing Configurations
The Monaco editor supports:
- Syntax highlighting
- Auto-completion
- Multi-line editing
- Undo/redo (Ctrl+Z / Ctrl+Y)

### Understanding the Visualization
- **Blue nodes**: Inactive states
- **Green nodes**: Currently active states
- **Small black circles**: Start nodes (initial state markers)
- **Arrows with labels**: Transitions triggered by events
- **Boxes around nodes**: Parent/compound states

## 📝 Example: Creating Your Own Machine

```javascript
const config = {
  // Initial context (extended state)
  initialContext: { count: 0 },
  
  // Starting state
  initial: 'idle',
  
  // Pure functions that update context
  reducers: {
    increment: ({ context }) => ({ 
      count: context.count + 1 
    }),
  },
  
  // State definitions
  states: {
    idle: {
      on: {
        START: 'active',  // Transition to 'active' on START event
      },
    },
    active: {
      on: {
        INCREMENT: { assign: 'increment' },  // Update context
        STOP: 'idle',  // Go back to idle
      },
    },
  },
};

export default config;
```

## 🎯 Common Patterns

### Conditional Transitions (Guards)
```javascript
guards: {
  isValid: ({ context }) => context.value > 0,
},
states: {
  checking: {
    on: {
      SUBMIT: [
        { target: 'success', guard: 'isValid' },
        { target: 'error' }  // Fallback
      ],
    },
  },
}
```

### Automatic Transitions (Always)
```javascript
states: {
  validating: {
    always: [
      { target: 'valid', guard: 'isValid' },
      { target: 'invalid' }
    ],
  },
}
```

### Nested States
```javascript
states: {
  form: {
    initial: 'editing',  // Start in this child state
    states: {
      editing: { /* ... */ },
      submitting: { /* ... */ },
    },
  },
}
```

### Parallel States
```javascript
states: {
  app: {
    type: 'parallel',  // All children active simultaneously
    states: {
      audio: { /* ... */ },
      video: { /* ... */ },
    },
  },
}
```

## 🐛 Troubleshooting

**Configuration Error?**
- Check the error message in the red box
- Ensure your config exports a valid object
- Use `export default config;` at the end

**Diagram Not Showing?**
- Make sure you clicked "Load & Start Machine"
- Check browser console for errors
- Try one of the working examples first

**Events Not Working?**
- Verify the event name matches what's in the config
- Check if machine is halted (shows red badge)
- Click "Reset" to restart the machine

## 🎨 Customization

Want to modify the styling? The app uses Tailwind CSS. Key files:
- `src/App.tsx` - Main layout
- `src/components/*.tsx` - Individual components
- `src/index.css` - Global styles

## 📚 Learn More

- [State-Reducer README](../references/state-reducer/README.md)
- [XState Documentation](https://xstate.js.org/) (similar concepts)
- [Cytoscape.js Docs](https://js.cytoscape.org/)

Enjoy simulating! 🎉
