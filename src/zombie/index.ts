// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import { ZombieTabbrowserElement } from '../components/zombie-tabbrowser';
import { ZombiePanelElement } from '../components/zombie-panel';

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

const zombieBrowser = new ZombieTabbrowserElement();
document.body.appendChild(zombieBrowser);

const tab1 = zombieBrowser.createTab();
tab1.icon = '/images/icon.svg';
tab1.closable = false;

const zombiePanel = new ZombiePanelElement();
tab1.setTabContent(zombiePanel);
const console = zombiePanel.console;

const tab2 = zombieBrowser.createTab();
tab2.loadUrl('https://www.google.com/');

const tab3 = zombieBrowser.createTab();
tab3.loadUrl('https://www.wikipedia.org/');

console.log('Hello, world!');

console.log('foo %o %bar', {foo: 'bar'}, 'baz');

console.log('%.4d, %.2f', 12, 12.345678);

console.error(new Error('foo'));

console.info(new Map([['foo', 'bar']]));
console.warn(new Set(['foo', 'bar']));

console.debug(/./);
console.log(1,2,3);

console.count();
console.count();
console.countReset();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();
console.count();

console.time('foo');
setTimeout(() => {
  console.timeLog('foo');
}, 500);

setTimeout(() => {
  console.timeEnd('foo');
}, 1000);
