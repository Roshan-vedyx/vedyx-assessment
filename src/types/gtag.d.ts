// src/types/gtag.d.ts

// Extend the Window interface to include gtag
declare global {
    interface Window {
      gtag: (
        command: 'event' | 'config' | 'consent' | 'get',
        targetId: string,
        parameters?: {
          event_category?: string
          event_label?: string
          value?: number
          custom_parameter?: string
          primary_style?: string
          [key: string]: any
        }
      ) => void
    }
  }
  
  // This export makes this file a module, required for global augmentation
  export {}