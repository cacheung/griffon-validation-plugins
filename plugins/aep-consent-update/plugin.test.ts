// @ts-ignore
import plugin from './index';

const collectConsentY = {
  "uuid": "b63f00ca-c884-42d1-8cfc-c1b7c353755a",
  "payload": {
    "ACPExtensionEventData": {
      "consents": {
        "collect": {
          "val": "y"
        }
      }
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.updateconsent",
    "ACPExtensionEventType": "com.adobe.eventtype.edgeconsent"
  },
  "annotations": []
}

const collectConsentN = {
  "uuid": "b63f00ca-c884-42d1-8cfc-c1b7c353755a",
  "payload": {
    "ACPExtensionEventData": {
      "consents": {
        "collect": {
          "val": "n"
        }
      }
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.updateconsent",
    "ACPExtensionEventType": "com.adobe.eventtype.edgeconsent"
  },
  "annotations": []
}


const collectConsentP = {
  "uuid": "b63f00ca-c884-42d1-8cfc-c1b7c353755a",
  "payload": {
    "ACPExtensionEventData": {
      "consents": {
        "collect": {
          "val": "p"
        }
      }
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.updateconsent",
    "ACPExtensionEventType": "com.adobe.eventtype.edgeconsent"
  },
  "annotations": []
}


const collectConsentNotExist = {
  "uuid": "b63f00ca-c884-42d1-8cfc-c1b7c353755a",
  "eventNumber": 40,
  "clientId": "7f353deb-a537-4170-86d9-f310e27948cf",
  "timestamp": 1687745402175,
  "vendor": "com.adobe.griffon.mobile",
  "type": "generic",
  "payload": {
    "ACPExtensionEventUniqueIdentifier": "3a28338d-9f75-4c75-93d0-232aecac88c3",
    "ACPExtensionEventName": "Consent Update Request",
    "ACPExtensionEventSource": "com.adobe.eventsource.updateconsent",
    "ACPExtensionEventType": "com.adobe.eventtype.edgeconsent"
  },
  "annotations": []
}

describe('Update Collect Consent', () => {
  it('collect consent is set to yes', () => {
    const result = plugin([collectConsentY]);
    expect(result).toMatchObject({
      message:'Collect consent level is set to yes. Events are sent to the Edge Network.',
      events: [],
      result: 'matched'
    });
  });

  it('collect consent is no', () => {
    const result = plugin([collectConsentN]);
    expect(result).toMatchObject({
      message: 'Collect consent level is set to no. Events are dropped until the status is updated to yes.',
      events: [],
      result: 'unknown'
    });
  });

  it('collect consent is pending', () => {
    const result = plugin([collectConsentP]);
    expect(result).toMatchObject({
      message: 'Collect consent level is set to pending. Events are queued until the status is updated to yes (events are sent) or no (events are dropped). To update the consent status, use the update API from the Consent extension and pass in the preferred collect consent settings. Check the link for more details and code samples.',
      events: [],
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/api-reference/'
        }
      ],
      result: 'unknown'
    });
  });

  it('should show no collect consent message', () => {
    const result = plugin([collectConsentNotExist]);
    expect(result).toMatchObject({
      message: 'The collect consent settings are not set in the Consent extension. Please make sure that the Consent extension is registered and configured correctly.',
      events: [],
      result: 'unknown'
    });
  });
});
