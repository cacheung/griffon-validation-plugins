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

import { SharedStateConfig } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateConfig } = kit['aep-mobile'];
  const configEvents = kit.match(
    sharedStateConfig.matcher,
    events
  ) as SharedStateConfig[];

  const hasEdgeConfigId = window.griffon.toolkit.search('payload.metadata."state.data"."edge.configId"' , configEvents[0]);

  const hasEdgeConfigDomain = window.griffon.toolkit.search('payload.metadata."state.data"."edge.domain"' , configEvents[0]);

  const regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/gi;

  var validEdgeConfigDomain = false;

  //If edge domain is existed, check if it is in the right format
  if (hasEdgeConfigDomain) {
    if (regex.test(hasEdgeConfigDomain) && !hasEdgeConfigDomain.includes("http" || "https")) {
    validEdgeConfigDomain = true;
    } else {
      validEdgeConfigDomain = false;
    }
  }

  return !configEvents.length
  ? {
      events: [],
      message:
        "No configuration info could be found. Either Assurance isn't registered or it did not pass in cached events upon activating.",
      result: 'not matched'
    }
  : hasEdgeConfigId && !hasEdgeConfigDomain
  ? {
      events: [],
      message: 'Did not detect the required Edge Network domain configuration value. It should be configrued in the Data Collection UI.',
      result: 'not matched',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/edge-network/#domain-configuration'
        }
      ],
    }
  : hasEdgeConfigId && validEdgeConfigDomain
  ? {
      events: [],
      message: 'Edge extension was configured correctly',
      result: 'matched'
    }
  : hasEdgeConfigId && !validEdgeConfigDomain
  ? {
      events: [],
      message: 'Edge extension is detected, but Edge Network domain value is not configured properly. The domain name should in the right format and just the domain without any protocol or trailing slash.',
      result: 'not matched',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/edge-network/#domain-configuration'
        }
      ],
    }
  : {
      message:
        'Did not detect the required Edge Network configuration values. You may need to install the Edge Network extension in the Date Collection UI and publish the settings.',
      events: configEvents.map((event) => event.uuid),
      result: 'not matched',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/edge-network/#configure-the-edge-network-extension-in-data-collection-ui'
        }
      ],
    };
});