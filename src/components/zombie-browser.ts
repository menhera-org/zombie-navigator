// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export class ZombieBrowserElement extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-browser.css';
    this.shadowRoot.appendChild(styleSheet);

    const activeTabContainers = document.createElement('div');
    activeTabContainers.classList.add('active-tab-containers');
    this.shadowRoot.appendChild(activeTabContainers);

    const activeTabContainersSlot = document.createElement('slot');
    activeTabContainers.appendChild(activeTabContainersSlot);
    activeTabContainersSlot.name = 'active';

    const inactiveTabContainers = document.createElement('div');
    inactiveTabContainers.classList.add('inactive-tab-containers');
    this.shadowRoot.appendChild(inactiveTabContainers);

    const inactiveTabContainersSlot = document.createElement('slot');
    inactiveTabContainers.appendChild(inactiveTabContainersSlot);
    inactiveTabContainersSlot.name = 'inactive';
  }
}

customElements.define('zombie-browser', ZombieBrowserElement);
