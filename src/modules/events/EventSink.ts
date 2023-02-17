// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Event listeners should handle exceptions themselves.
 */
export type EventListener<T> = (details: T) => void;

export class EventSink<T> {
  private readonly _listeners = new Set<EventListener<T>>();

  public addListener(listener: EventListener<T>): void {
    this._listeners.add(listener);
  }

  public removeListener(listener: EventListener<T>): void {
    this._listeners.delete(listener);
  }

  public hasListener(listener: EventListener<T>): boolean {
    return this._listeners.has(listener);
  }

  public dispatch(details: T): void {
    for (const listener of this._listeners) {
      listener(details);
    }
  }
}
