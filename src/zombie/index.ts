// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';

browser.tabs.getCurrent().then((browserTab) => {
  if (!browserTab || !browserTab.id) {
    return;
  }
  const {cookieStoreId} = browserTab;
  if (!cookieStoreId) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const url = params.get('url');
  const id = params.get('id');
  if (!url || !id) {
    return;
  }
});
