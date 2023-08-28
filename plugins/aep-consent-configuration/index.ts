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

import { Event } from '@adobe/griffon-toolkit-common';
import { SharedStateVersions } from '@adobe/griffon-toolkit-aep-mobile';
import { SharedStateConfig } from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const { sharedStateConfig: config } = kit['aep-mobile'];
  const versionEvents = kit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[]
  const configEvents = kit.match(
    config.matcher,
    events
  ) as SharedStateConfig[];

  const consentSDKRegistered= versionEvents.some(versions.getExtensionsKey('"com.adobe.edge.consent"'));

  const consentTagInstalled = configEvents.some((event) => {
		return window.griffon.toolkit.search('payload.metadata."state.data"."consent.default"' , event);
  });

  const consentDefaultEvents = kit.match('payload.metadata."state.data"."consent.default"', configEvents);

  const consentDefaultValue = kit.search('payload.metadata."state.data"."consent.default".consents.collect.val' , consentDefaultEvents[0]);

  return consentDefaultValue === 'y' 
    ? {
        message: 'Default collect consent level is set to yes.',
        events: [],
        result: 'matched'
      }
    : consentDefaultValue === 'n' 
    ? {
        message: 'Default collect consent level is set to no. Events are dropped until the status is updated to yes or pending.',
        events: [],
        result: 'unknown'
      }
  
    : consentDefaultValue === 'p' 
    ? {
        message: 'Default collect consent level is set to pending. Events are queued until the status is updated to yes or no.',
        events: [],
        result: 'unknown'
      }
    : !consentTagInstalled && consentSDKRegistered
    ? {
        message: 'Default collect consent level is not set, but the Consent SDK extension is registered. This is a required setting, and events may be blocked on the device by the Edge SDK extension until the collect consent level is specified.  Please follow the steps in the link to configure the Consent extension in Data Collection UI then reload this validator.',
        events: [],
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
          }
        ],
        result: 'not matched'
      }
    : {
        message: 'Default collect consent level is not set. By default the collect consent settings used for Edge Network events is yes, events are sent. If you intended to use the Consent extension to control these settings, please follow the steps in the link then reload this validator.',
        events: [],
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
          }
        ],
        result: 'unknown'
      };
});
