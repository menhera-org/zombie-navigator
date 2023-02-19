// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export class ZombieToolbarElement extends HTMLElement {
  private readonly _urlBar: HTMLInputElement;
  private readonly _icon: HTMLDivElement;

  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-toolbar.css';
    this.shadowRoot.appendChild(styleSheet);

    const icon = document.createElement('div');
    icon.classList.add('icon');
    this.shadowRoot.appendChild(icon);
    this._icon = icon;

    const urlBar = document.createElement('input');
    urlBar.classList.add('url-bar');
    urlBar.type = 'text';
    urlBar.readOnly = true;
    this.shadowRoot.appendChild(urlBar);
    this._urlBar = urlBar;
  }

  public set url(url: string) {
    this._urlBar.value = url;
    if (url == 'about:zombie') {
      this._icon.dataset.icon = 'zombie';
    } else {
      try {
        const urlObject = new URL(url);
        if (urlObject.protocol == 'https:') {
          this._icon.dataset.icon = 'https';
        } else {
          this._icon.dataset.icon = 'http';
        }
      } catch (e) {
        this._icon.dataset.icon = 'http';
      }
    }
  }

  public get url(): string {
    return this._urlBar.value;
  }
}

customElements.define('zombie-toolbar', ZombieToolbarElement);
