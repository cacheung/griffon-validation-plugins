/*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { Event } from '@adobe/griffon-toolkit-common';
import { EdgeRequest } from '@adobe/griffon-toolkit-aep-mobile';
import { EdgeHitReceived } from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit } = window.griffon;
  const aepMobile = toolkit['aep-mobile'];
  const trackEvents = toolkit.match(
    aepMobile.edgeRequest.matcher,
    events
  ) as EdgeRequest[];
  const edgeHits = toolkit.match(
    toolkit.edge.edgeHitReceived.matcher,
    events
  ) as EdgeHitReceived[];
  const errors: string[] = [];

  for (let i = 0; i < trackEvents.length; i++) {
    let linked = false;
    const trackEvent = trackEvents[i];
    const identifier: string = aepMobile.mobileEvent.getEventId(trackEvent);

    for (let j = 0; j < edgeHits.length; j++) {
      const edgeHit = edgeHits[j];
      const messages = toolkit.edge.edgeEvent.getMessages(edgeHit);
      let data;
      try {
        data = messages ? JSON.parse(messages[1]) : val.payload;
      } catch {
        data = val.payload;
      }

      if (data.indexOf(identifier) > -1) {
        linked = true;
        break;
      }
    }

    if (!linked) {
      errors.push(trackEvent.uuid);
    }
  }

  const message = errors.length
    ? 'One or more AEP Track events are missing an AEP Edge Hit event. The AEP Track Events are generated from the client(website or mobile app) and reported directly to assurance. The AEP Edge Hit event comes from Adobe services through the request channel separately to provide confirmation that the hit was received. This may indicate that the hit was not processed. If you think this is in error, please contact client care with information about your usage, an Assurance session id and any other details that can help investigate the issue.'
    : 'PASSED!';

  return {
    events: errors,
    message,
    result: !errors.length ? 'matched' : 'not matched'
  };
});
