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

  const found = kit.match('payload.ACPExtensionEventSource==`com.adobe.eventsource.updateconsent` &&'
	+ 'payload.ACPExtensionEventType==`com.adobe.eventtype.edgeconsent`', events);
  
 
  const consentEvent = found[0];
  const validY = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'y';
  const validN = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'n';
  const validP = kit.search('payload.ACPExtensionEventData.consents.collect.val', consentEvent) == 'p';

  return validY
    ? {
        message:'Collect consent is set to yes',
        events: [],
        result: 'matched'
      }
    : validN
    ? {
        message: 'Collect consent is set to no, events are dropped and are not sent to Edge Network',
        events: [],
        result: 'unknown'
      }
  
    : validP
    ? {
        message: 'Collect consent is set to pending, events are queued and the state should change to yes for the queue to be unblocked',
        events: [],
        result: 'unknown'
      }
  
    : {
        message:
        'Collect consent is not set. Default consent is being used for an Edge workflow',
        events: [],
        result: 'unknown'
      };
});
