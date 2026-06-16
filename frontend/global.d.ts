declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export {};
