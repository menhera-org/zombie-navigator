// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import { Console } from '../modules/console/Console';
import { RemoteConsoleConsumer } from '../modules/console/RemoteConsoleConsumer';
import { ConsoleOutputElement } from '../components/console-output';

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

const consumer = new RemoteConsoleConsumer();
const console = new Console(consumer);
const consoleOutput = new ConsoleOutputElement();
consumer.onMessage.addListener((data) => {
  consoleOutput.output(data);
});
document.body.appendChild(consoleOutput);

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

console.time('foo');
setTimeout(() => {
  console.timeEnd('foo');
}, 1000);
