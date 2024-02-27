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
import { SharedStateConfig } from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { sharedStateConfig, sharedStateVersions } = kit['aep-mobile'];
  const configurationEvents = kit.match(
    sharedStateConfig.matcher,
    events
  ) as SharedStateConfig[];
  const versionEvents = kit.match(
    sharedStateVersions.matcher,
    events
  ) as SharedStateVersions[];

  const valid = configurationEvents.some((event) => {
    const rsids =
      event.payload.ACPExtensionEventData['analytics.rsids'] ||
      event.payload.metadata?.['state.data']?.['analytics.rsids'];
    const server =
      event.payload.ACPExtensionEventData['analytics.server'] ||
      event.payload.metadata?.['state.data']?.['analytics.server'];
    return rsids && server;
  });

  return valid
  ? {
      message: 'Valid! Adobe Analytics Extension has been configured!',
      events: [],
      result: 'matched'
    }
  : !valid && versionEvents.some(sharedStateVersions.getExtensionsKey('"com.adobe.module.analytics"'))
  ? {
      message: 'Missing required configuration for Adobe Analytics.',
      events: [],
      result: 'not matched'
    }
    :{
      message: 'no Analytics extension is detected, nothing to validate.',
      events: [],
      result: 'unknown'
    };
});
