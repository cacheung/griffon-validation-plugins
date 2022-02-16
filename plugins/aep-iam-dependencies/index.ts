/*
  Copyright 2022 Adobe. All rights reserved.
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

  if (!versionEvents.length) {
    return {
      message:
        "Unable to detect any version events. Either Griffon isn't registered or it did not pass in cached events upon activating.",
      events: [],
      result: 'not matches'
    };
  }

  const isIAMInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.marketing.mobile"')
  );

  const isOptimizeInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.optimize"')
  );

  const isEdgeInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.edge"')
  );

  const isMessagingInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.messaging"')
  );

  const isCoreInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.core"')
  );

  const isValid =
    isIAMInstalled &&
    isOptimizeInstalled &&
    isEdgeInstalled &&
    isMessagingInstalled &&
    isCoreInstalled;

  const generateInvalidMessage = () => {
    const missingExtensions = [
      { name: 'IAM', value: isIAMInstalled },
      { name: 'Core', value: isCoreInstalled },
      { name: 'Optimize', value: isOptimizeInstalled },
      { name: 'Edge', value: isEdgeInstalled },
      { name: 'Messaging', value: isMessagingInstalled }
    ].filter((extension) => !extension.value);

    return missingExtensions.map((extension) => extension.name).join(', ');
  };

  return isValid
    ? {
        message: 'All IAM dependencies have been installed',
        events: [],
        result: 'matched'
      }
    : {
        message: `Missing required extensions for IAM. Please ensure the following extensions are installed: ${generateInvalidMessage()}`,
        events: [],
        result: 'not matched'
      };
});
