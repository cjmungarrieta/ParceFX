// Google Analytics gtag type definitions
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        [key: string]: any;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}

export {};
