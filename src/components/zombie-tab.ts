// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { EventSink } from "../modules/events/EventSink";

export class ZombieTabElement extends HTMLElement {
  public readonly onCloseButtonClicked = new EventSink<void>();
  public readonly onTabClicked = new EventSink<void>();

  private readonly _tabElement: HTMLDivElement;
  private readonly _tabIconElement: HTMLDivElement;
  private readonly _tabTitleElement: HTMLDivElement;
  private readonly _tabCloseButton: HTMLButtonElement;

  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-tab.css';
    this.shadowRoot.appendChild(styleSheet);

    const tabElement = document.createElement('div');
    tabElement.classList.add('tab');
    this.shadowRoot.appendChild(tabElement);
    this._tabElement = tabElement;
    tabElement.addEventListener('click', () => {
      this.onTabClicked.dispatch();
    });

    const tabIconElement = document.createElement('div');
    tabIconElement.classList.add('tab-icon');
    tabElement.appendChild(tabIconElement);
    this._tabIconElement = tabIconElement;

    const tabTitleElement = document.createElement('div');
    tabTitleElement.classList.add('tab-title');
    tabElement.appendChild(tabTitleElement);
    this._tabTitleElement = tabTitleElement;

    const tabCloseButton = document.createElement('button');
    tabCloseButton.classList.add('tab-close-button');
    tabElement.appendChild(tabCloseButton);
    tabCloseButton.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.onCloseButtonClicked.dispatch();
    });
    this._tabCloseButton = tabCloseButton;
  }

  public set tabIcon(iconUrl: string) {
    this._tabIconElement.style.backgroundImage = `url(${iconUrl})`;
    this._tabIconElement.dataset.icon = iconUrl;
  }

  public get tabIcon(): string {
    return this._tabIconElement.dataset.icon || '';
  }

  public set tabTitle(title: string) {
    this._tabTitleElement.textContent = title;
  }

  public get tabTitle(): string {
    return this._tabTitleElement.textContent || '';
  }

  public set tabActive(active: boolean) {
    if (active) {
      this._tabElement.classList.add('active');
    } else {
      this._tabElement.classList.remove('active');
    }
  }

  public get tabActive(): boolean {
    return this._tabElement.classList.contains('active');
  }

  public set tabClosable(closable: boolean) {
    this._tabCloseButton.disabled = !closable;
  }

  public get tabClosable(): boolean {
    return !this._tabCloseButton.disabled;
  }
}

customElements.define('zombie-tab', ZombieTabElement);
