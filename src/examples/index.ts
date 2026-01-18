export const examples = {
  counter: `// Counter Example
({
  initialContext: { count: 0 },
  initial: 'active',
  timeTravel: true,
  
  reducers: {
    increment: ({ context }) => {
      return { count: context.count + 1 };
    },
    decrement: ({ context }) => {
      return { count: context.count - 1 };
    },
    reset: () => {
      return { count: 0 };
    },
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
  timeTravel: true,
  
  reducers: {
    incrementCycle: ({ context }) => {
      return { 
        cycleCount: context.cycleCount + 1,
        timestamp: Date.now()
      };
    },
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
  timeTravel: true,
  
  guards: {
    isValid: ({ context }) => 
      context.formData.name.length > 0 && 
      context.formData.email.includes('@'),
  },
  
  reducers: {
    incrementAttempts: ({ context }) => {
      return { 
        submitAttempts: context.submitAttempts + 1 
      };
    },
    setErrors: ({ context, event }) => {
      return {
        errors: event.payload?.errors || ['Validation failed']
      };
    },
    clearErrors: () => {
      return { errors: [] };
    },
    updateForm: ({ context, event }) => {
      console.log('Updating form with:', event.payload);
      return {
        formData: { ...context.formData, ...event.payload }
      };
   },
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

  parallelMedia: `// Advanced Parallel Media Player Example
({
  initialContext: { 
    volume: 50, 
    isPlaying: false,
    currentTime: 0,
    isPoweredOn: false,
    bufferLevel: 100,
    networkQuality: 'good',
    subtitlesEnabled: false,
    quality: 'HD'
  },
  initial: 'off',
  timeTravel: true,
  
  reducers: {
    powerOn: () => {
      return { 
        isPoweredOn: true,
        bufferLevel: 100,
        networkQuality: 'good'
      };
    },
    powerOff: () => {
      return { 
        isPoweredOn: false, 
        isPlaying: false,
        bufferLevel: 0
      };
    },
    play: () => {
      return { isPlaying: true };
    },
    pause: () => {
      return { isPlaying: false };
    },
    volumeUp: ({ context }) => {
      return { 
        volume: Math.min(100, context.volume + 10) 
      };
    },
    volumeDown: ({ context }) => {
      return { 
        volume: Math.max(0, context.volume - 10) 
      };
    },
    mute: () => {
      return { volume: 0 };
    },
    unmute: () => {
      return { volume: 50 };
    },
    startBuffering: ({ context }) => {
      return { 
        bufferLevel: Math.max(0, context.bufferLevel - 20) 
      };
    },
    finishBuffering: () => {
      return { bufferLevel: 100 };
    },
    networkDegraded: () => {
      return { networkQuality: 'poor' };
    },
    networkRestored: () => {
      return { networkQuality: 'good' };
    },
    enableSubtitles: () => {
      return { subtitlesEnabled: true };
    },
    disableSubtitles: () => {
      return { subtitlesEnabled: false };
    },
    setSD: () => {
      return { quality: 'SD' };
    },
    setHD: () => {
      return { quality: 'HD' };
    },
    set4K: () => {
      return { quality: '4K' };
    },
  },
  
  states: {
    off: {
      on: {
        POWER_ON: { target: 'on', assign: 'powerOn' },
      },
    },
    
    on: {
      type: 'parallel',
      onExit: ['powerOff'],
      
      on: {
        POWER_OFF: 'off',
      },
      
      states: {
        // Playback control
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
        
        // Volume control
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
        
        // Buffer status
        buffer: {
          initial: 'ready',
          states: {
            ready: {
              on: {
                BUFFER_LOW: { target: 'buffering', assign: 'startBuffering' },
              },
            },
            buffering: {
              on: {
                BUFFER_COMPLETE: { target: 'ready', assign: 'finishBuffering' },
              },
            },
          },
        },
        
        // Network status
        network: {
          initial: 'connected',
          states: {
            connected: {
              on: {
                CONNECTION_LOST: { target: 'disconnected', assign: 'networkDegraded' },
              },
            },
            disconnected: {
              on: {
                CONNECTION_RESTORED: { target: 'connected', assign: 'networkRestored' },
              },
            },
          },
        },
        
        // Subtitle control
        subtitles: {
          initial: 'hidden',
          states: {
            hidden: {
              on: {
                SHOW_SUBTITLES: { target: 'visible', assign: 'enableSubtitles' },
              },
            },
            visible: {
              on: {
                HIDE_SUBTITLES: { target: 'hidden', assign: 'disableSubtitles' },
              },
            },
          },
        },
        
        // Quality control
        quality: {
          initial: 'hd',
          states: {
            sd: {
              on: {
                SET_HD: { target: 'hd', assign: 'setHD' },
                SET_4K: { target: 'uhd', assign: 'set4K' },
              },
            },
            hd: {
              on: {
                SET_SD: { target: 'sd', assign: 'setSD' },
                SET_4K: { target: 'uhd', assign: 'set4K' },
              },
            },
            uhd: {
              on: {
                SET_SD: { target: 'sd', assign: 'setSD' },
                SET_HD: { target: 'hd', assign: 'setHD' },
              },
            },
          },
        },
      },
    },
  },
})`,
};
