/*!
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */

import {
  ClientInfoAndroid,
  ClientInfoIOS,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from 'types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit } = window.griffon;
  const { clientInfoIos, sharedStateVersions: versions } =
    toolkit['aep-mobile'];
  const clientEvents = toolkit.match(
    toolkit.combineAll([
      'payload.type==`connect`',
      'type==`client`',
      'timestamp'
    ]),
    events
  ) as (ClientInfoAndroid & ClientInfoIOS)[];
  const versionEvents = toolkit.match(
    versions.matcher,
    events
  ) as SharedStateVersions[];

  const uniqueClients: Record<string, ClientInfoAndroid & ClientInfoIOS> = {};
  for (let i = 0; i < clientEvents.length; i++) {
    const clientEvent = clientEvents[i];
    if (!uniqueClients[clientEvent.clientId]) {
      uniqueClients[clientEvent.clientId] = clientEvent;
    }
  }

  const versionRegex = /^(\d+)\.(\d+)\.(\d+)/;

  const isAndroidCompatible = (
    assuranceVersionMatches: string[],
    analyticsVersionMatches: string[]
  ) =>
    (parseInt(assuranceVersionMatches[1], 10) >= 1 &&
      parseInt(analyticsVersionMatches[1], 10) > 1) ||
    (parseInt(analyticsVersionMatches[1], 10) === 1 &&
      (parseInt(analyticsVersionMatches[2], 10) > 2 ||
        (parseInt(analyticsVersionMatches[2], 10) === 2 &&
          parseInt(analyticsVersionMatches[3], 10) >= 6)));

  const isIOSCompatible = (
    assuranceVersionMatches: string[],
    analyticsVersionMatches: string[]
  ) =>
    (parseInt(assuranceVersionMatches[1], 10) >= 1 &&
      parseInt(analyticsVersionMatches[1], 10) > 2) ||
    (parseInt(analyticsVersionMatches[1], 10) === 2 &&
      parseInt(analyticsVersionMatches[2], 10) >= 4);

  let analyticsVersion;
  let assuranceVersion;
  const edgeBridgeVersion = versionEvents.find((version) => {
    const extensions = versions.getExtensions(version);
    return extensions?.['com.adobe.edge.bridge'];
  });
  const compatible = edgeBridgeVersion
    ? true
    : versionEvents.every((event) => {
        const clientEvent = uniqueClients[event.clientId];
        const isCompatible = clientInfoIos.isMatch(clientEvent)
          ? isIOSCompatible
          : isAndroidCompatible;
        const extensions = versions.getExtensions(event);
        assuranceVersion = extensions['com.adobe.assurance']?.version || '';
        analyticsVersion =
          extensions.Analytics?.version ||
          extensions['com.adobe.module.analytics']?.version ||
          '';
        const assuranceVersionMatches =
          assuranceVersion.match(versionRegex) || [];
        const analyticsVersionMatches =
          analyticsVersion.match(versionRegex) || [];
        return isCompatible(assuranceVersionMatches, analyticsVersionMatches);
      });

  return !versionEvents.length
    ? {
        events: [],
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/current-sdk-versions/'
          }
        ],
        message:
          "No version info could be found. Either the Assurance SDK isn't registered or the SDK did not pass in cached events upon activating.",
        result: 'unknown'
      }
    : !compatible
    ? {
        message: `Assurance SDK Version ${assuranceVersion} and Adobe Analytics Extension version ${analyticsVersion} are not compatible!`,
        links: [
          {
            type: 'doc',
            url: 'https://developer.adobe.com/client-sdks/documentation/current-sdk-versions/'
          }
        ],
        events: versionEvents.map((event) => event.uuid),
        result: 'not matched'
      }
    : edgeBridgeVersion
    ? {
        events: [],
        message:
          'The installed Assurance SDK and Analytics Edge Bridge Extensions are compatible.',
        result: 'matched'
      }
    : {
        events: [],
        message:
          'The installed Assurance SDK and Adobe Analytics Extensions are compatible.',
        result: 'matched'
      };
});
