/*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { SharedStateVersions } from '@adobe/griffon-toolkit-aep-mobile';
import { SharedStateConfig } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const { sharedStateConfig: configVersions } = kit['aep-mobile'];
  const versionEvents = kit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[];

  const configEvents = kit.match(
    configVersions.matcher,
    events
  ) as SharedStateConfig[];

  const consentSDKRegistered = versionEvents.some(versions.getExtensionsKey('"com.adobe.edge.consent"'));
 
  const consentTagInstalled = configEvents.some((event) => {
		return kit.search('payload.metadata."state.data"."consent.default"' , event);
	});

  return !versionEvents.length
    ? {
        events: [],
        message:
          "No version info could be found. Either Assurance isn't registered or it did not pass in cached events upon activating.",
        result: 'not matched'
      }
      : !consentSDKRegistered && consentTagInstalled ?
      {
        events: [],
        message: 'Default collect consent settings were detected, but the Consent extension is either not installed or not registered with the Mobile Core. Please follow the link for instructions.',
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
          }
        ],

        result: 'not matched'
      }
      : !consentSDKRegistered && !consentTagInstalled?
      {
        events: [],
        message: 'Consent extension is not installed or registered with the Mobile Core. By default the collect consent settings used for Edge Network events is yes. If you intended to use the Consent extension to control these settings, please follow the steps in the link then reload this validator.',
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
          }
        ],

        result: 'unknown'
      }
      : consentSDKRegistered && !consentTagInstalled?
      {
        events: [],
        message: 'Consent Extension was registered. Make sure default consent is also set up in the Data Collection UI.',
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
          }
        ],

        result: 'not matched'
      }
      : {
        events: [],
        message: 'Consent Extension was registered.',
        result: 'matched'
      };
});