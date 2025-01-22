declare module 'bpmn-js/dist/bpmn-modeler.production.min.js' {
  import { BpmnModeler } from 'bpmn-js';
  export = BpmnModeler;
}

declare module 'bpmn-js' {
  interface BpmnModeler {
    attachTo(element: HTMLElement): void;
    detach(): void;
    importXML(xml: string): Promise<{ warnings: string[] }>;
    saveXML(options?: { format?: boolean }): Promise<{ xml: string }>;
    saveSVG(): Promise<{ svg: string }>;
    on(event: string, callback: (event: any) => void): void;
    off(event: string, callback?: (event: any) => void): void;
    destroy(): void;
    get(serviceName: string): any;
    invoke<T>(serviceName: string): T;
  }
}
