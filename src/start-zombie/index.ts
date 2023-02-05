// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import { DataEncoder } from '../modules/DataEncoder';

const SCHEME = 'ext+zombie:';

const createId = () => {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return DataEncoder.encodeHex(bytes);
};

const startZombie = async (url: URL) => {
  const ZOMBIE_URL = browser.runtime.getURL('zombie.html');
  const params = new URLSearchParams();
  params.set('url', url.href);
  const id = createId();
  params.set('id', id);
  const zombieUrl = new URL(ZOMBIE_URL);
  zombieUrl.search = params.toString();
  await browser.windows.create({
    url: zombieUrl.toString(),
    type: 'popup',
    state: 'fullscreen',
  });
  window.close();
};

try {
  const params = new URLSearchParams(location.search);
  const zombieUrl = params.get('url');
  if (!zombieUrl) {
    throw new Error('No URL');
  }
  if (!zombieUrl.startsWith(SCHEME)) {
    throw new Error('Invalid URL');
  }
  const httpUrl = zombieUrl.slice(SCHEME.length);
  const url = new URL(httpUrl);
  startZombie(url).catch((e) => console.error(e));
} catch (e) {
  console.error('Invalid URL');
}
