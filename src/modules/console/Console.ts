// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ConsoleOutput, OutputType } from "./ConsoleOutput";
import { ConsoleConsumer } from "./ConsoleConsumer";
import { ConsoleDefaultConsumer } from "./ConsoleDefaultConsumer";
import { ConsoleFormatter } from "./ConsoleFormatter";

type Counters = { [key: string]: number };
type Timers = { [key: string]: number };

export class Console {
  private _consumer: ConsoleConsumer;
  private readonly _counters: Counters = {};
  private readonly _timers: Timers = {};

  public constructor(consumer?: ConsoleConsumer) {
    if (consumer) {
      this._consumer = consumer;
    } else {
      this._consumer = new ConsoleDefaultConsumer();
    }
  }

  private logWithType(type: OutputType, ...data: unknown[]): void {
    const stack = (new Error().stack ?? '').split('\n').slice(1).join('\n');
    data = [... data]; // prevent accidential mutation
    const formattedData = ConsoleFormatter.format(... data);
    const output = new ConsoleOutput(type, formattedData, data, stack);
    this._consumer.output(output);
  }

  public assert(condition: boolean, ...data: unknown[]): void {
    if (!condition) {
      if (data.length < 1) {
        this.logWithType('error', 'Assertion failed');
        return;
      }
      const firstData = data.shift();
      if (typeof firstData == 'string') {
        this.logWithType('error', `Assertion failed: ${firstData}`, ...data);
        return;
      }
      data.unshift(firstData);
      this.logWithType('error', 'Assertion failed:', ...data);
    }
  }

  public clear(): void {
    this.logWithType('clear');
  }

  public count(label = 'default'): void {
    if (!this._counters[label]) {
      this._counters[label] = 0;
    }
    this._counters[label]++;
    this.logWithType('log', `${label}: ${this._counters[label]}`);
  }

  public countReset(label = 'default'): void {
    delete this._counters[label];
    this.logWithType('log', `${label}: 0`);
  }

  public debug(...data: unknown[]): void {
    this.logWithType('debug', ...data);
  }

  public error(...data: unknown[]): void {
    this.logWithType('error', ...data);
  }

  public exception(...data: unknown[]): void {
    this.logWithType('error', ...data);
  }

  public group(...data: unknown[]): void {
    this.logWithType('group', ...data);
  }

  public groupCollapsed(...data: unknown[]): void {
    this.logWithType('groupCollapsed', ...data);
  }

  public groupEnd(): void {
    this.logWithType('groupEnd');
  }

  public info(...data: unknown[]): void {
    this.logWithType('info', ...data);
  }

  public log(...data: unknown[]): void {
    this.logWithType('log', ...data);
  }

  public warn(...data: unknown[]): void {
    this.logWithType('warn', ...data);
  }

  public dir(obj: unknown): void {
    this.logWithType('log', obj);
  }

  public dirxml(obj: unknown): void {
    this.logWithType('log', obj);
  }

  public profile(): void {
    // TODO
  }

  public profileEnd(): void {
    // TODO
  }

  public table(data: unknown): void {
    // TODO
    this.logWithType('log', data);
  }

  public time(label = 'default'): void {
    this._timers[label] = Date.now();
    this.logWithType('log', `${label}: Timer started`);
  }

  public timeEnd(label = 'default'): void {
    const timer = this._timers[label];
    if ('undefined' == typeof timer) {
      this.logWithType('log', `${label}: Timer not started`);
      return;
    }
    const elapsed = Date.now() - timer;
    this.logWithType('log', `${label}: ${elapsed}ms`);
    delete this._timers[label];
  }

  public timeLog(label = 'default'): void {
    const timer = this._timers[label];
    if ('undefined' == typeof timer) {
      this.logWithType('log', `${label}: Timer not started`);
      return;
    }
    const elapsed = Date.now() - timer;
    this.logWithType('log', `${label}: ${elapsed}ms`);
  }

  public timeStamp(label = 'default'): void {
    this.logWithType('log', `${label}: ${Date.now()}`);
  }

  public trace(...data: unknown[]): void {
    data = [... data]; // prevent accidential mutation
    const trace = (new Error()).stack ?? '[unknown stack]\n';
    const formattedData = [trace, ... ConsoleFormatter.format(... data)];
    const firstData = data.shift();
    if (typeof firstData == 'string') {
      data.unshift(`${firstData}\n${trace}`);
    } else {
      data.unshift(firstData);
      data.unshift(trace);
    }
    this._consumer.output(new ConsoleOutput('log', formattedData, data));
  }
}
