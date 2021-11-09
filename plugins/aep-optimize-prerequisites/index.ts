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

import { SharedStateVersions } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const versionEvents = kit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[];

  const isOptimizeInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.optimize"')
  );
  const isEdgeInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.edge"')
  );
  const isEdgeIdentityInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.edge.identity"')
  );
  const isTargetInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.target"')
  );
  const isOffersInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.offers"')
  );

  const isValid = isOptimizeInstalled
    ? !!(
        isEdgeInstalled &&
        isEdgeIdentityInstalled &&
        (isTargetInstalled || isOffersInstalled)
      )
    : false;

  return isValid
    ? {
        events: [],
        message: 'Optimize Prerequisites are installed',
        result: 'matched',
        status: 'valid'
      }
    : {
        events: [],
        message:
          'Missing required extensions for optimize. Please ensure either target or offers extensions are installed',
        result: 'not matched',
        status: 'invalid'
      };
});
