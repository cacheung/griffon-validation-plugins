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
      result: 'not matched'
    };
  }

  const isCoreInstalled = versionEvents.some(
    (version) => versions.getSdkVersion(version) >= '3.4.2'
  );

  const isEdgeInstalled = versionEvents.some((version) => {
    const installed = versions.getExtensionsKey('"com.adobe.edge"')(version);
    return installed && installed >= '1.3.0';
  });

  const isEdgeConsentInstalled = versionEvents.some((version) => {
    const installed = versions.getExtensionsKey('"com.adobe.edge.consent"')(
      version
    );
    return installed && installed >= '1.0.0';
  });

  const isEdgeIdentityInstalled = versionEvents.some((version) => {
    const installed = versions.getExtensionsKey('"com.adobe.edge.identity"')(
      version
    );
    return installed && installed >= '1.0.1';
  });

  const isMessagingInstalled = versionEvents.some((version) => {
    const installed = versions.getExtensionsKey('"com.adobe.messaging"')(
      version
    );
    return installed && installed >= '1.1.0';
  });

  const isOptimizeInstalled = versionEvents.some((version) => {
    const installed = versions.getExtensionsKey('"com.adobe.optimize"')(
      version
    );
    return installed && installed >= '1.0.0';
  });

  const isValid =
    isCoreInstalled &&
    isEdgeInstalled &&
    isEdgeConsentInstalled &&
    isEdgeIdentityInstalled &&
    isMessagingInstalled &&
    isOptimizeInstalled;

  return isValid
    ? {
        message: 'All In App Messaging dependencies have been installed',
        events: [],
        result: 'matched'
      }
    : {
        message: `Missing required extensions for In App Messaging. Please ensure the following extensions are installed: AEP Core >= 3.4.2, AEP Edge >= 1.3.0, AEP Edge Consent >= 1.0.0, AEP Edge Identity >= 1.0.1, AEP Messaging >= 1.1.0, and AEP Optimize >= 1.0.0`,
        events: [],
        result: 'not matched'
      };
});
