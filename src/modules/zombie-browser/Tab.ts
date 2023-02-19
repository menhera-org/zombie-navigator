// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { EventSink } from "../events/EventSink";
import { ZombieTabElement } from "../../components/zombie-tab";
import { ZombieTabContainerElement } from "../../components/zombie-tab-container";

export class Tab {
  public readonly id: number;
  public readonly tabElement: ZombieTabElement;
  public readonly tabContainerElement: ZombieTabContainerElement;

  public readonly onTitleChanged = new EventSink<string>();
  public readonly onIconChanged = new EventSink<string>();
  public readonly onCloseRequested = new EventSink<void>();

  public constructor(id: number, tabElement: ZombieTabElement, tabContainerElement: ZombieTabContainerElement) {
    this.id = id;
    this.tabElement = tabElement;
    this.tabContainerElement = tabContainerElement;
  }

  public get title(): string {
    return this.tabElement.tabTitle;
  }

  public set title(title: string) {
    this.tabElement.tabTitle = title;
    this.onTitleChanged.dispatch(title);
  }

  public get icon(): string {
    return this.tabElement.tabIcon;
  }

  public set icon(iconUrl: string) {
    this.tabElement.tabIcon = iconUrl;
    this.onIconChanged.dispatch(iconUrl);
  }

  public setTabContent(tabContent: HTMLElement): void {
    this.tabContainerElement.textContent = '';
    this.tabContainerElement.appendChild(tabContent);
  }

  public getTabContent(): HTMLElement | null {
    return this.tabContainerElement.firstElementChild as HTMLElement | null;
  }

  public close(): void {
    if (this.closable) {
      this.onCloseRequested.dispatch();
    }
  }

  public get closable(): boolean {
    return this.tabElement.tabClosable;
  }

  public set closable(closable: boolean) {
    this.tabElement.tabClosable = closable;
  }
}
