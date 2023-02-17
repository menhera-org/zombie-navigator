// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.


export class ZombieTabBarElement extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-tab-bar.css';
    this.shadowRoot.appendChild(styleSheet);

    const tabsElement = document.createElement('div');
    tabsElement.classList.add('tabs');
    this.shadowRoot.appendChild(tabsElement);
  }
}

customElements.define('zombie-tab-bar', ZombieTabBarElement);
