import { lint } from 'bpmnlint';
import type BPMN from '../types/bpmn-types';
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
      // Events
      case 'bpmn:StartEvent':
      case 'bpmn:EndEvent':
      case 'bpmn:IntermediateThrowEvent':
      case 'bpmn:IntermediateCatchEvent': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: []
        });
        break;
      }

      // Tasks
      case 'bpmn:Task': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: []
        });
        break;
      }
      case 'bpmn:UserTask': {
        const task = element as BPMN.UserTask;
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: [],
          assignee: task.assignee
        });
        break;
      }
      case 'bpmn:ServiceTask': {
        const task = element as BPMN.ServiceTask;
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: [],
          topic: task.topic
        });
        break;
      }
      case 'bpmn:ScriptTask': {
        const task = element as BPMN.ScriptTask;
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: [],
          scriptFormat: task.scriptFormat,
          script: task.script
        });
        break;
      }
      case 'bpmn:BusinessRuleTask': {
        const task = element as BPMN.BusinessRuleTask;
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: [],
          implementation: task.implementation
        });
        break;
      }
      case 'bpmn:ManualTask':
      case 'bpmn:ReceiveTask':
      case 'bpmn:SendTask': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: []
        });
        break;
      }

      // Gateways
      case 'bpmn:ExclusiveGateway':
      case 'bpmn:ParallelGateway':
      case 'bpmn:InclusiveGateway':
      case 'bpmn:EventBasedGateway':
      case 'bpmn:ComplexGateway': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          incoming: [],
          outgoing: []
        });
        break;
      }

      // Data
      case 'bpmn:DataObject':
      case 'bpmn:DataStore': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          isCollection: (element as any).isCollection
        });
        break;
      }

      // Containers
      case 'bpmn:Pool':
      case 'bpmn:Lane': {
        createdElement = this.moddle.create(element.$type, {
          ...baseProps,
          flowNodeRefs: (element as any).flowNodeRefs || []
        });
        break;
      }

      // Flows
      case 'bpmn:SequenceFlow': {
        const flow = element as BPMN.SequenceFlow;
        const sourceRef = this.createElement(flow.sourceRef) as BPMN.FlowNode;
        const targetRef = this.createElement(flow.targetRef) as BPMN.FlowNode;
        
        createdElement = this.moddle.create('bpmn:SequenceFlow', {
          ...baseProps,
          sourceRef,
          targetRef
        });
        break;
      }

      case 'bpmn:MessageFlow': {
        const flow = element as BPMN.MessageFlow;
        const sourceRef = flow.sourceRef;
        const targetRef = flow.targetRef;
        
        createdElement = this.moddle.create('bpmn:MessageFlow', {
          ...baseProps,
          sourceRef: this.elementCache.get(sourceRef.id) || sourceRef,
          targetRef: this.elementCache.get(targetRef.id) || targetRef,
          messageRef: flow.messageRef
        });
        break;
      }

      case 'bpmn:Association': {
        const association = element as BPMN.Association;
        const sourceRef = association.sourceRef;
        const targetRef = association.targetRef;
        
        createdElement = this.moddle.create('bpmn:Association', {
          ...baseProps,
          sourceRef: this.elementCache.get(sourceRef.id) || sourceRef,
          targetRef: this.elementCache.get(targetRef.id) || targetRef,
          associationDirection: association.associationDirection
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
