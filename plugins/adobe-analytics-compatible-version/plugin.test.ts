import {
  clientInfoAndroid,
  ClientInfoAndroid,
  clientInfoIos,
  ClientInfoIOS,
  configuration,
  Configuration,
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const configurationEvent = configuration.mock({
  uuid: '1'
}) as Configuration;

const versionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.assurance': {
            version: '3.0.0'
          },
          'com.adobe.module.analytics': {
            version: '3.0.0'
          }
        },
        version: '3.0.0'
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
          'com.adobe.assurance': {
            version: '3.0.0'
          },
          'com.adobe.edge.bridge': {
            version: '1.0.0'
          }
        },
        version: '3.0.0'
      }
    }
  }
}) as SharedStateVersions;


const noAnalyticsVersion = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.assurance': {
            version: '3.0.0'
          },
        },
        version: '3.0.0'
      }
    }
  }
}) as SharedStateVersions;

const invalidVersionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.assurance': {
            version: '1.0.0'
          },
          'com.adobe.module.analytics': {
            version: '1.0.0'
          }
        },
        version: '1.0.0'
      }
    }
  }
}) as SharedStateVersions;

const iosClientInfo = clientInfoIos.mock({
  uuid: '1',
  payload: {
    deviceInfo: {
      'Canonical platform name': 'iOS',
      'Device name': 'My Device',
      Model: 'IPhone X'
    }
  }
}) as ClientInfoIOS;

const iosClientInfoTwo = clientInfoIos.mock({
  uuid: '2',
  payload: {
    deviceInfo: {
      'Canonical platform name': 'iOS',
      'Device name': 'My Device',
      Model: 'IPhone X'
    }
  }
}) as ClientInfoIOS;

const androidClientInfo = clientInfoAndroid.mock({
  uuid: '1',
  payload: {
    deviceInfo: {
      'Canonical platform name': 'Android'
    }
  }
}) as ClientInfoAndroid;

describe('Adobe Analytics Compatible Version', () => {
  it('should successfully validate for IOS when versions are compatible', () => {
    const result = plugin([versionEvent, iosClientInfo, iosClientInfoTwo]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return a validation error when IOS versions are not correct', () => {
    const result = plugin([invalidVersionEvent, iosClientInfo]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });

  it('should successfully validate for Android when versions are compatible', () => {
    const result = plugin([versionEvent, androidClientInfo]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return a validation error when Android versions are not correct', () => {
    const result = plugin([invalidVersionEvent, androidClientInfo]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });

  it('should return an invalid response when no version events are found', () => {
    const result = plugin([configurationEvent]);

    expect(result).toMatchObject({
      events: [],
      message:  "No version info could be found. Either the Assurance SDK isn't registered or the SDK did not pass in cached events upon activating.",
      result: 'unknown'
    });
  });

  it('should return unknown when no analytics version is found in the shared state', () => {
    const result = plugin([noAnalyticsVersion]);

    expect(result).toMatchObject({
      message: 'The compatibility versions between Adobe Analytics and Assurance SDK cannot be determined as the Adobe Analytics extension is not installed.',
      events: [],
      result: 'unknown'
    });
  });

  it('should return valid when edge bridge is being used', () => {
    const result = plugin([edgeBridgeVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });
});
