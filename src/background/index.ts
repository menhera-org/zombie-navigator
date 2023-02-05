// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import '../modules/FramingHeadersService';

// Cleanup zombie containers
browser.tabs.onRemoved.addListener(async () => {
  const tabs = await browser.tabs.query({});
  const contextualIdentities = await browser.contextualIdentities.query({});
  const containers = new Map(contextualIdentities.map((c) => [c.cookieStoreId, c]));
  for (const tab of tabs) {
    if (!tab.cookieStoreId) continue;
    containers.delete(tab.cookieStoreId);
  }
  for (const container of containers.values()) {
    if (!container.name.match(/^Zombie \d+$/)) continue;
    await browser.contextualIdentities.remove(container.cookieStoreId);
  }
});
