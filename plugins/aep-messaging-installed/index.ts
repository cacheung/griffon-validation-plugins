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

  return !versionEvents.length
    ? {
        message:
          "No version info could be found. Either Griffon isn't registered or it did not pass in cached events upon activating.",
        errors: [],
        result: 'not matched'
      }
    : versionEvents.some(versions.getExtensionsKey('"com.adobe.messaging"'))
    ? {
        message: 'Messaging Extension was registered',
        errors: [],
        result: 'not matched'
      }
    : {
        message: 'Did not detect initialization of the Messaging Extension',
        errors: versionEvents.map((event) => event.uuid),
        result: 'matched'
      };
});
