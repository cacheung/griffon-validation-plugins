import {
  sharedStateVersions,
  SharedStateVersions,
  GenericTrack,
  genericTrack,
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const analyticsVersionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '4.0.0'
          }
        },
        version: '4.0.0'
      }
    }
  }
}) as SharedStateVersions;

const edgeBridgeVersionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.edge.bridge': {
            version: '4.0.0'
          }
        },
        version: '4.0.0'
      }
    }
  }
}) as SharedStateVersions;

const genericTrackEvent = genericTrack.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: '1',
    ACPExtensionEventData: {
      requestEventIdentifier: '1'
    }
  }
}) as GenericTrack;

describe('Analytics trackevent handling', () => {
  it('should return Edge Bridge extension is registered message', () => {
    const result = plugin([genericTrackEvent, edgeBridgeVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge Bridge extension is registered to handle Track events through Edge Network. Please make sure the Edge Network extension validation passes as well.',
      result: 'matched'
    });
  });

  it('should return Analytics extension is registered message', () => {
    const result = plugin([genericTrackEvent, analyticsVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Analytics extension is registered to handle Track events.',
      result: 'matched'
    });
  });

  it('should return an error that no extension is registered handling track event.', () => {
    const result = plugin([genericTrackEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'A track event has been detected but none of the extensions registered handle it right now. Check the link for latest extensions supported for Adobe Analytics.',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/adobe-analytics/migrate-to-edge-network/'
        }
      ],
      result: 'not matched'
    });
  });

  it('should return no track event is detected, nothing to validate', () => {
    const result = plugin([analyticsVersionEvent, edgeBridgeVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      message:
          "No track event is detected in this session, nothing to validate.",
      result: 'matched'
    });
  });

  it('should return not matched message when both Analytics and Edge Bridge are installed', () => {
    const result = plugin([genericTrackEvent, analyticsVersionEvent, edgeBridgeVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/adobe-analytics/migrate-to-edge-network/'
        } 
      ],
      message:
          "Both Analytics and Edge Bridge extensions are registered to handle Track events, please ensure this is the intended setup.",
      result: 'not matched'
    });
  });
});