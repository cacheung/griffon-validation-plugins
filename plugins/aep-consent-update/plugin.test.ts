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
  it('collect consent is yes', () => {
    const result = plugin([collectConsentY]);
    expect(result).toMatchObject({
      message:'Collect consent is set to yes',
      events: [],
      result: 'matched'
    });
  });

  it('collect consent is no', () => {
    const result = plugin([collectConsentN]);
    expect(result).toMatchObject({
      message: 'Collect consent is set to no, events are dropped and are not sent to Edge Network',
      events: [],
      result: 'unknown'
    });
  });

  it('collect consent is pending', () => {
    const result = plugin([collectConsentP]);
    expect(result).toMatchObject({
      message: 'Collect consent is set to pending, events are queued and the state should change to yes for the queue to be unblocked',
      events: [],
      result: 'unknown'
    });
  });

  it('should show no collect consent message', () => {
    const result = plugin([collectConsentNotExist]);
    expect(result).toMatchObject({
      message: 'Collect consent is not set. Using default consent for the an Edge workflow',
      events: [],
      result: 'unknown'
    });
  });
});
