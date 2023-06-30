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
import { SharedStateConfig } = from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateConfig: config } = kit['aep-mobile'];
  const configEvents = kit.match(
    config.matcher,
    events
  ) as SharedStateConfig[];

  const found = kit.match('payload.metadata."state.data"."edge.configId"', configEvents);

  const validY = kit.search('payload.metadata."state.data"."consent.default".consents.collect.val' , found[0]) == 'y';

  const validN = kit.search('payload.metadata."state.data"."consent.default".consents.collect.val' , found[0]) == 'n';
  
  const validP = kit.search('payload.metadata."state.data"."consent.default".consents.collect.val' , found[0]) == 'p';



  return validY
    ? {
        message: 'Default collect consent level is set to yes',
        events: [],
        result: 'matched'
      }
    : validN
    ? {
        message: 'Default collect consent level is set to no',
        events: [],
        result: 'unknown'
      }
  
    : validP
    ? {
        message: 'Default collect consent is set to pending; events are queued until the settings are changed to yes / no',
        events: [],
        result: 'unknown'
      }
  
    : {
        message: 'Default collect consent settings are not found, check that you install and configure the Consent extension in data collection UI',
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
