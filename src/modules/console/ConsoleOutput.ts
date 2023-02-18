// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { OutputType } from "./RemoteConsoleData";
export { OutputType };

export class ConsoleOutput {
  public readonly type: OutputType;
  public readonly data: unknown[];
  public readonly origData: unknown[];
  public readonly stack: string;

  public constructor(type: OutputType, data: unknown[] = [], origData: unknown[] = [], stack = '') {
    this.type = type;
    this.data = data;
    this.origData = origData;
    this.stack = stack;
  }
}
