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
import { GenericTrack } from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const { genericTrack: track } = kit['aep-mobile'];
  const versionEvents = kit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[];

  const analyticsTrackEvents = kit.match(
    track.matcher,
    events
  ) as GenericTrack[];
  
  return analyticsTrackEvents.length > 0 && versionEvents.some(versions.getExtensionsKey('"com.adobe.edge.bridge"'))
  ? {
      message: 'Edge Bridge Extension is registered to handle Track events. Please make sure the Edge Extension validation passes as well.',
      events: [],
      result: 'matched'
    }
  : analyticsTrackEvents.length > 0 && versionEvents.some(versions.getExtensionsKey('"com.adobe.module.analytics"'))
  ? {
      message: 'Analytics Extension is registered to handle Track events',
      events: [],
      result: 'matched'
    }
  : analyticsTrackEvents.length > 0
  ? {
      message: 'A track event has been detacted but none of the extensions registered handle it right now. Check the link for latest extensions supported for Adobe Analytics.',
      events: [],
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/adobe-analytics/migrate-to-edge-network/'
        }
      ],
      result: 'not matched'
    }
    :{
      message: 'No track event is detacted in this session, nothing to validate.',
      events: [],
      result: 'matched'
    };
});
