declare module 'bpmnlint' {
  export function lint(xml: string, config: any): Promise<{
    errors: Array<{ message: string; elementId?: string; rule: string }>;
    warnings: string[];
  }>;
}