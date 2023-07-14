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
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;

  const updateEventfound = kit.match('payload.ACPExtensionEventSource==`com.adobe.eventsource.updateconsent` &&'
	+ 'payload.ACPExtensionEventType==`com.adobe.eventtype.edgeconsent`', events);
  
 
  const consentEvent = updateEventfound[0];
  const valueY = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'y';
  const valueN = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'n';
  const valueP = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'p';

  return valueY
    ? {
        message:'Collect consent level is set to yes. Events are sent to the Edge Network.',
        events: [],
        result: 'matched'
      }
    : valueN
    ? {
        message: 'Collect consent level is set to no. Events are dropped until the status is updated to yes.',
        events: [],
        result: 'unknown'
      }
  
    : valueP
    ? {
        message: 'Collect consent level is set to pending. Events are queued until the status is updated to yes (events are sent) or no (events are dropped). To update the consent status, use the update API from the Consent extension and pass in the preferred collect consent settings. Check the link for more details and code samples.',
        events: [],
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/api-reference/'
          }
        ],
        result: 'unknown'
      }
    : {
      message:
      'The collect consent settings are not set in the Consent extension. Please make sure that the Consent extension is registered and configured correctly.',
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
