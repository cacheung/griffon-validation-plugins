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

import { SetPushIdentifier } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event): ValidationPluginResult {
  const {
    toolkit: { match, 'aep-mobile': aepMobile }
  } = window.griffon;

  const pushIdEvents = match(
    aepMobile.setPushIdentifier.matcher,
    events
  ) as SetPushIdentifier[];

  return !pushIdEvents.length
    ? {
        errors: [],
        message: 'No push ID was registered in the app.',
        status: 'invalid'
      }
    : {
        errors: [],
        message: 'Messaging Extension was registered',
        status: 'valid'
      };
});
