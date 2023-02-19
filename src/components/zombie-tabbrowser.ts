// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ZombieTabBarElement } from "./zombie-tab-bar";
import { ZombieTabElement } from "./zombie-tab";
import { ZombieTabContainerElement } from "./zombie-tab-container";
import { ZombieBrowserElement } from "./zombie-browser";
import { Tab } from "../modules/zombie-browser/Tab";

export class ZombieTabbrowserElement extends HTMLElement {
  public readonly tabBarElement: ZombieTabBarElement;
  public readonly browserElement: ZombieBrowserElement;

  private readonly _tabs = new Map<number, Tab>();
  private _maxTabId = 0;

  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/zombie-tabbrowser.css';
    this.shadowRoot.appendChild(styleSheet);

    const tabBarElement = new ZombieTabBarElement();
    this.shadowRoot.appendChild(tabBarElement);
    this.tabBarElement = tabBarElement;

    const browserElement = new ZombieBrowserElement();
    this.shadowRoot.appendChild(browserElement);
    this.browserElement = browserElement;
  }

  public getTabs(): Tab[] {
    return Array.from(this._tabs.values());
  }

  public getTab(id: number): Tab | undefined {
    return this._tabs.get(id);
  }

  public closeTab(id: number): void {
    this._tabs.get(id)?.close();
  }

  public activateTab(id: number): void {
    const tab = this._tabs.get(id);
    if (!tab) {
      return;
    }

    for (const tab of this._tabs.values()) {
      tab.tabElement.tabActive = false;
      tab.tabContainerElement.slot = 'inactive';
    }
    tab.tabElement.tabActive = true;
    tab.tabContainerElement.slot = 'active';
  }

  public createTab(): Tab {
    const tabId = ++this._maxTabId;
    const tabElement = new ZombieTabElement();
    tabElement.tabActive = false;
    const tabContainerElement = new ZombieTabContainerElement();
    tabContainerElement.slot = 'inactive';
    this.tabBarElement.appendChild(tabElement);
    this.browserElement.appendChild(tabContainerElement);

    tabElement.onCloseButtonClicked.addListener(() => {
      this.closeTab(tabId);
    });

    tabElement.onTabClicked.addListener(() => {
      this.activateTab(tabId);
    });

    const tab = new Tab(tabId, tabElement, tabContainerElement);
    this._tabs.set(tabId, tab);
    if (this._tabs.size == 1) {
      this.activateTab(tab.id);
    }

    tab.onCloseRequested.addListener(() => {
      const wasActive = tab.tabElement.tabActive;
      tabElement.remove();
      tabContainerElement.remove();
      this._tabs.delete(tabId);
      if (wasActive) {
        const tabs = this.getTabs();
        if (tabs[0]) {
          this.activateTab(tabs[0].id);
        } else {
          this.createTab();
        }
      }
    });

    tab.icon = '/images/icon.svg';
    tab.title = 'New Tab';
    return tab;
  }
}

customElements.define('zombie-tabbrowser', ZombieTabbrowserElement);
