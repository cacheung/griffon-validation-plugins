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
  const { sharedState } = kit['aep-mobile'];
  const stateEvents = kit.match(
    sharedState.matcher, 
    events);
    let consentEvent = null;
  
    for (let i = 0; i < stateEvents.length; i++) {
      const found = stateEvents[i];
      if (sharedState.getStateOwner(found) === 'com.adobe.edge.consent') {
         consentEvent = stateEvents[i];
         //Got the latest consent event, stop searching 
         break;
      }
    }
    
    const consentUpdateState = sharedState.getXdm(consentEvent);
     
    const valueY = kit.search('consents.collect.val', consentUpdateState) == 'y';
    const valueN = kit.search('consents.collect.val', consentUpdateState) == 'n';
    const valueP = kit.search('consents.collect.val', consentUpdateState) == 'p';
    
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
        message: 'Collect consent level is set to pending. Events are queued until the status is updated to yes (events are sent) or no (events are dropped). To update the consent status, check the default collect consent setting or use the update API from the Consent extension and pass in the preferred collect consent settings. Follow the link for more details and code samples.',
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
        'The collect consent settings are not set. Please make sure that the Consent extension is registered and configured correctly.',
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
