export const examples = {
  counter: `// Counter Example
({
  initialContext: { count: 0 },
  initial: 'active',
  
  reducers: {
    increment: ({ context }) => ({ count: context.count + 1 }),
    decrement: ({ context }) => ({ count: context.count - 1 }),
    reset: () => ({ count: 0 }),
  },
  
  states: {
    active: {
      on: {
        INCREMENT: { assign: 'increment' },
        DECREMENT: { assign: 'decrement' },
        RESET: { assign: 'reset' },
      },
    },
  },
})`,

  trafficLight: `// Traffic Light Example
({
  initialContext: { 
    cycleCount: 0,
    timestamp: Date.now()
  },
  initial: 'green',
  
  reducers: {
    incrementCycle: ({ context }) => ({ 
      cycleCount: context.cycleCount + 1,
      timestamp: Date.now()
    }),
  },
  
  states: {
    green: {
      on: {
        TIMER: { target: 'yellow', assign: 'incrementCycle' },
      },
    },
    yellow: {
      on: {
        TIMER: 'red',
      },
    },
    red: {
      on: {
        TIMER: 'green',
      },
    },
  },
})`,

  formWorkflow: `// Form Workflow Example
({
  initialContext: {
    formData: { name: '', email: '' },
    errors: [],
    submitAttempts: 0,
  },
  initial: 'editing',
  
  guards: {
    isValid: ({ context }) => 
      context.formData.name.length > 0 && 
      context.formData.email.includes('@'),
  },
  
  reducers: {
    incrementAttempts: ({ context }) => ({ 
      submitAttempts: context.submitAttempts + 1 
    }),
    setErrors: ({ context, event }) => ({
      errors: event.errors || ['Validation failed']
    }),
    clearErrors: () => ({ errors: [] }),
    updateForm: ({ context, event }) => ({
      formData: { ...context.formData, ...event.data }
    }),
  },
  
  states: {
    editing: {
      on: {
        UPDATE: { assign: 'updateForm' },
        SUBMIT: 'submitting',
      },
    },
    
    submitting: {
      initial: 'validating',
      onEntry: ['incrementAttempts'],
      
      states: {
        validating: {
          always: [
            { target: 'sending', guard: 'isValid' },
            { target: 'failed' }
          ],
        },
        
        sending: {
          on: {
            SUCCESS: 'success',
            ERROR: { target: 'failed', assign: 'setErrors' },
          },
        },
        
        failed: {
          on: {
            RETRY: { target: 'editing', assign: 'clearErrors' },
          },
        },
        
        success: {
          type: 'final',
        },
      },
    },
  },
})`,

  parallelMedia: `// Parallel Media Player Example
({
  initialContext: { 
    volume: 50, 
    isPlaying: false,
    currentTime: 0
  },
  initial: 'player',
  
  reducers: {
    play: () => ({ isPlaying: true }),
    pause: () => ({ isPlaying: false }),
    volumeUp: ({ context }) => ({ 
      volume: Math.min(100, context.volume + 10) 
    }),
    volumeDown: ({ context }) => ({ 
      volume: Math.max(0, context.volume - 10) 
    }),
    mute: () => ({ volume: 0 }),
    unmute: () => ({ volume: 50 }),
  },
  
  states: {
    player: {
      type: 'parallel',
      states: {
        playback: {
          initial: 'paused',
          states: {
            playing: {
              on: { 
                PAUSE: { target: 'paused', assign: 'pause' } 
              },
            },
            paused: {
              on: { 
                PLAY: { target: 'playing', assign: 'play' } 
              },
            },
          },
        },
        
        volume: {
          initial: 'normal',
          states: {
            normal: {
              on: {
                VOLUME_UP: { assign: 'volumeUp' },
                VOLUME_DOWN: { assign: 'volumeDown' },
                MUTE: { target: 'muted', assign: 'mute' },
              },
            },
            muted: {
              on: {
                UNMUTE: { target: 'normal', assign: 'unmute' },
              },
            },
          },
        },
      },
    },
  },
})`,
};
