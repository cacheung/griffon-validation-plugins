import {
  edgeRequest,
  EdgeRequest
} from '@adobe/griffon-toolkit-aep-mobile';
import {
  edgeHitReceived,
  EdgeHitReceived
} from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const edgeRequestEvent1 = edgeRequest.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: 'AE3469A9-DA63-466C-98A1-20222614106D',
    ACPExtensionEventType: 'com.adobe.eventtype.edge',
    ACPExtensionEventName: 'AEP Request Event'
    },
}) as EdgeRequest;

const edgeRequestEvent2 = edgeRequest.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: 'AE3469A9-DA63-466C-98A1-120933893029',
    ACPExtensionEventType: 'com.adobe.eventtype.edge',
    ACPExtensionEventName: 'AEP Request Event'
    },
}) as EdgeRequest;

const edgeRequestEvent3 = edgeRequest.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: 'AE3469A9-DA63-466C-98A1-12094567029',
    ACPExtensionEventType: 'com.adobe.eventtype.edge',
    ACPExtensionEventName: 'AEP Request Event'
    },
}) as EdgeRequest;

const edgeHitReceivedEventMatched1 = edgeHitReceived.mock({
  uuid: '3',
  payload: {
    name: 'hitReceived',
    attributes: {
      requestId: '38FEDF0B-8C88-424C-9EBC-2066FFFA893B'
    },
    messages: [
      'Request received by Experience Edge.',
      '{"event":{"xdm":{"_id":"AE3469A9-DA63-466C-98A1-20222614106D"}}}'      
    ],
  },
}) as EdgeHitReceived;

const edgeHitReceivedEventMatched2 = edgeHitReceived.mock({
  uuid: '3',
  payload: {
    name: 'hitReceived',
    attributes: {
      requestId: '38FEDF0B-8C88-424C-9EBC-2066FFFA893C'
    },
    messages: [
      'Request received by Experience Edge.',
      '{"event":{"xdm":{"_id":"AE3469A9-DA63-466C-98A1-120933893029"}}}'    
    ],
  },
}) as EdgeHitReceived;

describe('Edge Mobile Track Hits', () => {
  it('should validate that each track request event has a matching Edge Network hit event', () => {
    const result: ValidationPluginResult = plugin([
      edgeRequestEvent1,
      edgeRequestEvent2,
      edgeHitReceivedEventMatched1,
      edgeHitReceivedEventMatched2
    ]);

    expect(result).toMatchObject({
      events: [],
      message: "All Mobile Track events have an associated Edge Network Hit event.",
      result: 'matched'
    });
  });

  it('should show error that any track request event does not match an Edge Network hit event', () => {
    const result: ValidationPluginResult = plugin([
      edgeRequestEvent1,
      edgeRequestEvent2,
      edgeRequestEvent3,
      edgeHitReceivedEventMatched1,
      edgeHitReceivedEventMatched2,
    ]);

    expect(result).toMatchObject({
      events: ['1'],
      message: "One or more Track events are missing an Edge Network Hit event. The Track Events are generated from the client(website or mobile app) and reported directly to assurance. The Edge Network Hit event comes from Adobe services through the request channel separately to provide confirmation that the hit was received. This may indicate that the hit was not processed. If you think this is in error, please contact client care with information about your usage, an Assurance session id and any other details that can help investigate the issue.",
      result: 'not matched'
    });
  });
});