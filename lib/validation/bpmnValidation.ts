import { lint } from 'bpmnlint';
import type { BPMN } from 'bpmn-types';
import Moddle from 'bpmn-moddle';

export class BpmnValidator {
  private readonly config: any;
  private moddle: Moddle;
  private elementCache = new Map<string, any>();

  constructor(moddle?: Moddle) {
    this.config = require('../../.bpmnlintrc');
    this.moddle = moddle || new Moddle();
  }

  async validate(process: BPMN.Process): Promise<ValidationResult> {
    try {
      const xml = await this.serializeToXml(process);
      const results = await lint(xml, this.config);
      
      return {
        isValid: results.errors.length === 0,
        errors: results.errors.map(err => ({
          message: err.message,
          elementId: err.elementId,
          rule: err.rule
        })),
        warnings: results.warnings
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          rule: 'validation-system'
        }],
        warnings: []
      };
    }
  }

  private async serializeToXml(process: BPMN.Process): Promise<string> {
    this.elementCache.clear();
    
    const definitions = this.moddle.create<BPMN.Definitions>('bpmn:Definitions', {
      $type: 'bpmn:Definitions',
      id: `Definitions_${Date.now()}`,
      targetNamespace: 'http://bpmn.io/schema/bpmn',
      process: [
        this.moddle.create<BPMN.Process>('bpmn:Process', {
          $type: 'bpmn:Process',
          id: process.id,
          isExecutable: process.isExecutable,
          flowElements: process.flowElements.map((el: BPMN.FlowElement) => this.createElement(el) as BPMN.FlowElement)
        })
      ]
    });

    const { xml } = await this.moddle.toXML(definitions);
    return xml;
  }

  private createElement(element: BPMN.FlowElement): BPMN.FlowElement {
    if (this.elementCache.has(element.id)) {
      return this.elementCache.get(element.id) as BPMN.FlowElement;
    }

    const baseProps = {
      id: element.id,
      $type: element.$type,
      name: element.name,
      documentation: element.documentation,
      incoming: [] as BPMN.SequenceFlow[],
      outgoing: [] as BPMN.SequenceFlow[]
    };

    let createdElement: BPMN.FlowElement;
    
    switch (element.$type) {
      case 'bpmn:UserTask': {
        const task = element as BPMN.UserTask;
        createdElement = this.moddle.create<BPMN.UserTask>('bpmn:UserTask', {
          ...baseProps,
          $type: 'bpmn:UserTask',
          assignee: task.assignee,
          incoming: [],
          outgoing: []
        });
        break;
      }
        
      case 'bpmn:ServiceTask': {
        const task = element as BPMN.ServiceTask;
        createdElement = this.moddle.create<BPMN.ServiceTask>('bpmn:ServiceTask', {
          ...baseProps,
          $type: 'bpmn:ServiceTask',
          topic: task.topic,
          incoming: [],
          outgoing: []
        });
        break;
      }
        
      case 'bpmn:SequenceFlow': {
        const flow = element as BPMN.SequenceFlow;
        const sourceRef = this.createElement(flow.sourceRef) as BPMN.FlowNode;
        const targetRef = this.createElement(flow.targetRef) as BPMN.FlowNode;
        
        createdElement = this.moddle.create<BPMN.SequenceFlow>('bpmn:SequenceFlow', {
          ...baseProps,
          $type: 'bpmn:SequenceFlow',
          sourceRef,
          targetRef
        });
        break;
      }
        
      default:
        createdElement = this.moddle.create<BPMN.BaseElement>(element.$type, baseProps);
    }

    const result = createdElement as BPMN.FlowElement;
    this.elementCache.set(element.id, result);
    return result;
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

interface ValidationError {
  message: string;
  elementId?: string;
  rule: string;
}