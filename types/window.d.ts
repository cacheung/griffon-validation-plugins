declare module 'griffon-window' {
  global {
    interface Window {
      griffon: {
        toolkit: import('./toolkit').GriffonToolkit;
        schema?: any;
        expect?: any;
      };
    }
  }
}