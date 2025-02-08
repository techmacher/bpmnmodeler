import BpmnModdle from 'bpmn-moddle';
import BpmnDi from 'bpmn-moddle/resources/bpmn/json/bpmndi.json';
import OmgDc from 'bpmn-moddle/resources/bpmn/json/dc.json';
import Di from 'bpmn-moddle/resources/bpmn/json/di.json';


export function createCustomBpmnModdle(): BpmnModdle {
  return new BpmnModdle({
    bpmndi: BpmnDi,
    dc: OmgDc,
    di: Di,
  });
}