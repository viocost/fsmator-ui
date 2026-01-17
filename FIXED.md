# Fixed: Configuration Loading Issue

## Problem
The initial examples were using XState-like export syntax (`export default config;`) which didn't work with the dynamic code evaluation.

## Solution

### 1. Updated Example Format
Changed all examples from:
```javascript
const config = { ... };
export default config;
```

To wrapped object literals:
```javascript
({
  initialContext: { ... },
  initial: '...',
  // ... rest of config
})
```

### 2. Improved Configuration Loading
- Added validation for required config fields (initialContext, initial, states)
- Better error messages
- Store config separately from machine for diagram rendering

### 3. Correct State-Reducer Structure
All examples now follow the state-reducer library format:
- `initialContext` - starting context object
- `initial` - initial state name
- `states` - state definitions
- `reducers` - pure functions for context updates
- `guards` - conditional transition functions

## Examples Now Working

### Counter
Simple single-state machine with context updates:
```javascript
({
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
})
```

### Traffic Light
Sequential state transitions:
```javascript
({
  initialContext: { cycleCount: 0 },
  initial: 'green',
  states: {
    green: { on: { TIMER: 'yellow' } },
    yellow: { on: { TIMER: 'red' } },
    red: { on: { TIMER: 'green' } },
  },
})
```

### Form Workflow
Hierarchical states with guards and always transitions:
```javascript
({
  initial: 'editing',
  guards: {
    isValid: ({ context }) => context.formData.name.length > 0,
  },
  states: {
    editing: { ... },
    submitting: {
      initial: 'validating',
      states: {
        validating: {
          always: [
            { target: 'sending', guard: 'isValid' },
            { target: 'failed' }
          ],
        },
        // ... more states
      },
    },
  },
})
```

### Parallel Media Player
Parallel regions (playback + volume):
```javascript
({
  initial: 'player',
  states: {
    player: {
      type: 'parallel',  // Both regions active simultaneously
      states: {
        playback: {
          initial: 'paused',
          states: {
            playing: { ... },
            paused: { ... },
          },
        },
        volume: {
          initial: 'normal',
          states: {
            normal: { ... },
            muted: { ... },
          },
        },
      },
    },
  },
})
```

## How to Test

1. Start the dev server (if not running):
   ```bash
   cd app
   pnpm dev
   ```

2. Open http://localhost:5173

3. Click "Counter" example button

4. Click "Load & Start Machine"

5. You should see:
   - No errors
   - State display showing "active" 
   - Context showing `{ count: 0 }`
   - Diagram with "active" node highlighted in green
   - Event buttons: INCREMENT, DECREMENT, RESET

6. Click INCREMENT button:
   - Context updates to `{ count: 1 }`
   - No errors

7. Try other examples - all should work!

## Key Differences from XState

| Feature | XState | State-Reducer |
|---------|--------|---------------|
| Side effects | Full support (invoke, spawn) | None (pure reducers) |
| Context updates | Mutable via assign | Immutable via reducers |
| Execution | Async with actors | Synchronous |
| Runtime | Actor-based | Pure reducer |
| Config syntax | Similar but different | Simpler, reducer-focused |

## Fixed Files

- `app/src/examples/index.ts` - All 4 examples updated
- `app/src/App.tsx` - Added config validation and storage
- Build passes ✅
- Dev server running ✅
- All examples load correctly ✅
