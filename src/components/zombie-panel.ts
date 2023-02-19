// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Console } from "../modules/console/Console";
import { RemoteConsoleConsumer } from '../modules/console/RemoteConsoleConsumer';
import { ConsoleOutputElement } from '../components/console-output';

export class ZombiePanelElement extends HTMLElement {
  public readonly console: Console;

  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-panel.css';
    this.shadowRoot.appendChild(styleSheet);

    const header = document.createElement('div');
    header.classList.add('header');
    this.shadowRoot.appendChild(header);

    const heading = document.createElement('h1');
    heading.classList.add('heading');
    header.appendChild(heading);
    heading.textContent = 'Zombie Navigator';

    const headerSlot = document.createElement('slot');
    header.appendChild(headerSlot);

    const content = document.createElement('div');
    content.classList.add('content');
    this.shadowRoot.appendChild(content);

    const consumer = new RemoteConsoleConsumer();
    this.console = new Console(consumer);
    const consoleOutput = new ConsoleOutputElement();
    consumer.onMessage.addListener((data) => {
      consoleOutput.output(data);
    });

    content.appendChild(consoleOutput);
  }
}

customElements.define('zombie-panel', ZombiePanelElement);
