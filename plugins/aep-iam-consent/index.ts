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

import {
  Configuration,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { configuration } = kit['aep-mobile'];

  const configurations: Configuration[] = kit.match(
    configuration.matcher,
    events
  );

  const isConsentActive = configurations.some(
    (event) => event.payload.metadata?.['state.data']?.['consent.default']
  );

  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const versionEvents = kit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[];

  const isConsentInstalled = versionEvents.some(
    versions.getExtensionsKey('"com.adobe.edge.consent"')
  );

  if (!isConsentActive && !isConsentInstalled) {
    return {
      message:
        'Consent has not been installed or enabled, it will not be be used by the SDK',
      result: 'unknown',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ]
    };
  }

  if (isConsentActive && !isConsentInstalled) {
    return {
      message:
        'The Consent extension is configured inside Data Collection, but the SDK extension is not registered in your application.',
      result: 'not matched',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ]
    };
  }

  if (!isConsentActive && isConsentInstalled) {
    return {
      message:
        'The Consent SDK extension is registered in your application, but is not configured inside Data Collection.',
      result: 'not matched',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ]
    };
  }

  return {
    message:
      'Consent configuration in Adobe Data Collection and the AEP SDK is valid for your application.',
    result: 'matched'
  };
});
