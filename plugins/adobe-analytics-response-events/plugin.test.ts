import {
  analyticsResponse,
  AnalyticsResponse,
  configuration,
  genericTrack,
  GenericTrack,
  lifecycleStart,
  LifecycleStart,
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const genericTrackEvent = genericTrack.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: '1',
    ACPExtensionEventData: {
      requestEventIdentifier: '1'
    }
  }
}) as GenericTrack;

const lifecycleStartEvent = lifecycleStart.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventUniqueIdentifier: '2',
    ACPExtensionEventData: {
      requestEventIdentifier: '2'
    }
  }
}) as LifecycleStart;

const genericTrackTwo = genericTrack.mock({
  uuid: '3',
  payload: {
    ACPExtensionEventUniqueIdentifier: '3',
    ACPExtensionEventData: {
      requestEventIdentifier: '3'
    }
  }
}) as GenericTrack;

const lifecycleStartTwo = lifecycleStart.mock({
  uuid: '4',
  payload: {
    ACPExtensionEventUniqueIdentifier: '4',
    ACPExtensionEventData: {
      requestEventIdentifier: '4'
    }
  }
}) as LifecycleStart;

const analyticsResponseEvent = analyticsResponse.mock({
  uuid: '5',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '1',
      hitUrl: 'somethingp.&debug=true&.psomething',
      headers: {
        ETag: '1'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseTwo = analyticsResponse.mock({
  uuid: '6',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '2',
      hitUrl: 'somethingp.&debug=true&.psomething',
      headers: {
        ETag: '2'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseThree = analyticsResponse.mock({
  uuid: '7',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '50',
      hitUrl: 'test',
      headers: {
        ETag: '3'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseFour = analyticsResponse.mock({
  uuid: '8',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '100',
      hitUrl: 'test',
      headers: {
        ETag: '4'
      }
    }
  }
}) as AnalyticsResponse;

const configurationOptedOutEvent = configuration.mock({
  uuid: '0',
  payload: {
    ACPExtensionEventData: {
      'global.privacy': 'optedout'
    }
  }
});

const configurationAlternateFormat = configuration.mock({
  uuid: '0',
  payload: {
    metadata: {
      'state.data': {
        'global.privacy': 'optedout'
      }
    }
  }
});

const analyticsRegistered = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '4.0.0'
          }
        },
        version: '4.2.0'
      }
    }
  }
}) as SharedStateVersions;


describe('Adobe Analytics Response Events', () => {
  it('should return a valid response when all events has a matching response event', () => {
    const result = plugin([
      genericTrackEvent,
      lifecycleStartEvent,
      analyticsResponseEvent,
      analyticsResponseTwo
    ]);

    expect(result).toMatchObject({
      events: [],
      "message": "All Analytics events have a corresponding AnalyticsResponse event with the debug flag!",
      result: 'matched'
    });
  });

  it('should return an error with link when any requests are missing a response and privacy is not optedin', () => {
    //case with no Analytics extension registered
    const result = plugin([
      configurationOptedOutEvent,
      genericTrackEvent,
      lifecycleStartEvent,
      genericTrackTwo,
      lifecycleStartTwo,
      analyticsResponseEvent,
      analyticsResponseTwo,
      analyticsResponseThree,
      analyticsResponseFour
    ]);

    expect(result).toMatchObject({
      events: ['3', '4'],
      "message": "Missing an AnalyticsResponse event! If your report suite is not timestamp enabled, hits are discarded until the privacy status changes to `optedin`. If you are not using the Analytics Extension or if you follow an Edge Bridge workflow, you can disregard this validation error.",
      result: 'not matched'
    });

    expect(result.links.length).toBeGreaterThan(0);

    const result2 = plugin([
      configurationAlternateFormat,
      genericTrackEvent,
      lifecycleStartEvent,
      genericTrackTwo,
      lifecycleStartTwo,
      analyticsResponseEvent,
      analyticsResponseTwo,
      analyticsResponseThree,
      analyticsResponseFour
    ]);

    expect(result2).toMatchObject({
      events: ['3', '4'],
      "message": "Missing an AnalyticsResponse event! If your report suite is not timestamp enabled, hits are discarded until the privacy status changes to `optedin`. If you are not using the Analytics Extension or if you follow an Edge Bridge workflow, you can disregard this validation error.",
      result: 'not matched'
    });

    expect(result2.links.length).toBeGreaterThan(0);

    //case with Analytics extension registered
    const result3 = plugin([
      configurationOptedOutEvent,
      analyticsRegistered,
      genericTrackEvent,
      lifecycleStartEvent,
      genericTrackTwo,
      lifecycleStartTwo,
      analyticsResponseEvent,
      analyticsResponseTwo,
      analyticsResponseThree,
      analyticsResponseFour
    ]);

    expect(result3).toMatchObject({
      events: ['3', '4'],
      "message": "Missing an AnalyticsResponse event! If your report suite is not timestamp enabled, hits are discarded until the privacy status changes to `optedin`.",
      result: 'not matched'
    });

    expect(result3.links.length).toBeGreaterThan(0);
  });

  it('should return a Missing Response error with explaination of disregard it if no Analyitcs extension or use Edge Bridge workflow', () => {
    //case with no Analytics extension registered
    const result = plugin([
      genericTrackEvent,
      lifecycleStartEvent,
      genericTrackTwo,
      lifecycleStartTwo,
      analyticsResponseEvent,
      analyticsResponseTwo,
      analyticsResponseThree,
      analyticsResponseFour
    ]);

    expect(result).toMatchObject({
      events: ['3', '4'],
      "message": "Missing an AnalyticsResponse event! If you are not using the Analytics Extension or if you follow an Edge Bridge workflow, you can disregard this validation error.",
      result: 'not matched'
    });
  });
});
