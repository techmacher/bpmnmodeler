declare module 'bpmn-moddle' {
  import type { BPMN } from 'bpmn-types';
  
  class Moddle {
    constructor(packages?: Record<string, unknown>);
    create<T extends BPMN.BaseElement>(type: string, properties?: Partial<T>): T;
    toXML(element: BPMN.BaseElement): Promise<{ xml: string }>;
    fromXML(xml: string): Promise<{ rootElement: BPMN.BaseElement }>;
  }
  
  export = Moddle;
}