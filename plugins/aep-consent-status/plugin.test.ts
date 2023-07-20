// @ts-ignore
import plugin from './index';

const collectConsentY = {
  "uuid": "1b3e3e55-da1b-4af8-8289-ee2cfadf6c68",
  "timestamp": 1688158409809,
  "vendor": "com.adobe.griffon.mobile",
  "payload": {
    "ACPExtensionEventName": "Consent State",
    "ACPExtensionEventData": {
      "stateowner": "com.adobe.edge.consent"
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.sharedstate",
    "metadata": {
      "xdm.state.data": {
        "consents": {
          "collect": {
            "val": "y"
          },
        }
      }
    },
    "ACPExtensionEventType": "com.adobe.eventtype.hub"
  },
  "annotations": []
}

const collectConsentN = {
  "uuid": "1b3e3e55-da1b-4af8-8289-ee2cfadf6c68",
  "timestamp": 1688158409809,
  "vendor": "com.adobe.griffon.mobile",
  "payload": {
    "ACPExtensionEventName": "Shared state change",
    "ACPExtensionEventData": {
      "stateowner": "com.adobe.edge.consent"
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.sharedstate",
    "metadata": {
      "xdm.state.data": {
        "consents": {
          "collect": {
            "val": "n"
          },
        }
      }
    },
    "ACPExtensionEventType": "com.adobe.eventtype.hub"
  },
  "annotations": []
}

const collectConsentUnknownValue = {
  "uuid": "1b3e3e55-da1b-4af8-8289-ee2cfadf6c68",
  "timestamp": 1688158409809,
  "vendor": "com.adobe.griffon.mobile",
  "payload": {
    "ACPExtensionEventName": "Shared state change",
    "ACPExtensionEventData": {
      "stateowner": "com.adobe.edge.consent"
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.sharedstate",
    "metadata": {
      "xdm.state.data": {
        "consents": {
          "collect": {
            "val": "someunknownvalue"
          },
        }
      }
    },
    "ACPExtensionEventType": "com.adobe.eventtype.hub"
  },
  "annotations": []
}


const collectConsentP = {
  "uuid": "1b3e3e55-da1b-4af8-8289-ee2cfadf6c68",
  "timestamp": 1688158409809,
  "vendor": "com.adobe.griffon.mobile",
  "payload": {
    "ACPExtensionEventName": "Shared state change (XDM)",
    "ACPExtensionEventData": {
      "stateowner": "com.adobe.edge.consent"
    },
    "ACPExtensionEventSource": "com.adobe.eventsource.sharedstate",
    "metadata": {
      "xdm.state.data": {
        "consents": {
          "collect": {
            "val": "p"
          },
        }
      }
    },
    "ACPExtensionEventType": "com.adobe.eventtype.hub"
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
    "ACPExtensionEventName": "Shared state change (XDM)",
    "ACPExtensionEventSource": "com.adobe.eventsource.sharedstate",
    "ACPExtensionEventType": "com.adobe.eventtype.hub"
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
      message: 'Collect consent level is set to pending. Events are queued until the status is updated to yes (events are sent) or no (events are dropped). To update the consent status, check the default collect consent setting or use the update API from the Consent extension and pass in the preferred collect consent settings. Follow the link for more details and code samples.',
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

  it('collect consent is an unknown value', () => {
    const result = plugin([collectConsentUnknownValue]);
    expect(result).toMatchObject({
      message: 'The collect consent settings are not set in the Consent extension. Please make sure that the Consent extension is registered and configured correctly.',
      events: [],
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
