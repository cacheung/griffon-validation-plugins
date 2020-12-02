/*!
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */
(function (events) {
  const { toolkit: kit } = window.griffon;
  const { configuration } = kit['aep-mobile'];
  const configEvents = kit.match(configuration.matcher, events);

  const hasAllConfig = event => (
    configuration.getEventDataKey('"edge.configId"', event)
  );

  return !configEvents.length ? {
    errors: [],
    message: 'No configuration info could be found. Either Griffon isn\'t registered or it did not pass in cached events upon activating.',
    status: 'help'
  } : configEvents.some(hasAllConfig) ? {
    errors: [],
    message: 'Edge extension was configured correctly',
    status: 'valid'
  } : {
    message: 'Did not detect the required configuration values. You may need to install the extension in launch and publish those settings.',
    errors: configEvents.map(event => event.uuid),
    status: 'invalid'
  };
});
