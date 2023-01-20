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
  const { sharedStateVersions } = kit['aep-mobile'];
  const found = kit.match(
    sharedStateVersions.matcher,
    events
  ) as SharedStateVersions[];
  const latest = found[0];
  const extensions = sharedStateVersions.getExtensions(latest);

  const identity = extensions['com.adobe.module.identity'];
  const edgeIdentity = extensions['com.adobe.edge.identity'];
  const edge = extensions['com.adobe.edge'];

  const solution =
    extensions['com.adobe.module.analytics'] ||
    extensions['com.adobe.module.media'] ||
    extensions['com.adobe.module.target'] ||
    extensions['com.adobe.module.places'] ||
    extensions['com.adobe.module.campaign'];

  const isIdentityValid = (solution && identity) || !solution;
  const isEdgeIdentityValid = (edge && edgeIdentity) || !edge;

  const isBothIdentityValid = isIdentityValid && isEdgeIdentityValid;

  return {
    message: isBothIdentityValid
      ? 'The Identity extension(s) have been registered correctly.'
      : !isIdentityValid
      ? 'The Identity extension for Experience Cloud ID Service is required for Experience Cloud solution extensions, such as Analytics and Target'
      : 'To use Adobe Experience Platform Edge Network, you need to install and register the Identity for Edge Network extension.',
    events: [latest.uuid],
    links: [
      {
        type: 'doc',
        url: 'https://developer.adobe.com/client-sdks/documentation/identity-for-edge-network/faq/#q-i-am-using-aep-edge-and-adobe-solutions-extensions-which-identity-extension-should-i-install-and-register'
      }
    ],
    result: isBothIdentityValid ? 'matched' : 'not matched'
  };
});
