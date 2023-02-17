// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ConsoleOutput } from "./ConsoleOutput";
import { ConsoleConsumer } from "./ConsoleConsumer";

export class ConsoleDefaultConsumer implements ConsoleConsumer {
  public output(output: ConsoleOutput): void {
    const type = output.type;
    if ('clear' == type) {
      console.clear();
      return;
    }
    const data = output.origData;
    console[type](...data);
  }
}
