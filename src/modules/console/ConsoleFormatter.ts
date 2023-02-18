// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ConsoleStyle } from "./ConsoleStyle";

export class ConsoleFormatter {
  public static tokenize(text: string): string[] {
    return text.match(/%%|%[oO]|%s|%(?:.[0-9]+)?[dif]|%c|.+?/g) ?? [text];
  }

  public static format(...args: unknown[]): unknown[] {
    if (args.length < 1) {
      return args;
    }
    const firstArg = args.shift();
    if ('string' != typeof firstArg) {
      return [firstArg, ... args];
    } else {
      const tokens = ConsoleFormatter.tokenize(firstArg);
      const results: unknown[] = [];
      let strBuffer = '';
      let matches: string[] | null = null;
      for (const token of tokens) {
        if (token == '%%') {
          strBuffer += '%';
        } else if (token == '%o' || token == '%O') {
          if (strBuffer != '') {
            results.push(strBuffer);
            strBuffer = '';
          }
          if (args.length > 0) {
            results.push(args.shift());
          }
        } else if ((matches = token.match(/^%(.[0-9]+)?([dif])$/))) {
          if (args.length < 1) {
            continue;
          }
          const [, modifier, formatter] = matches;
          if (null == formatter) {
            throw new Error('Unexpected error');
          }
          const precision = null == modifier ? null : parseInt(modifier.slice(1), 10);
          const value = args.shift();
          let number = 'bigint' == typeof value ? value : Number(value);
          if (formatter != 'f' && 'number' == typeof number) {
            number = Math.trunc(number);
          }
          if (null == precision) {
            strBuffer += String(number);
          } else if ('bigint' == typeof number) {
            if (formatter != 'f') {
              strBuffer += number.toString().padStart(precision, '0');
            } else {
              strBuffer += number.toString();
            }
          } else if (isNaN(number)) {
            strBuffer += 'NaN';
          } else if (formatter != 'f') {
            strBuffer += String(number).padStart(precision, '0');
          } else {
            strBuffer += number.toFixed(precision);
          }
        } else if (token == '%s') {
          if (args.length < 1) {
            continue;
          }
          const value = args.shift();
          const string = String(value);
          strBuffer += string;
        } else if ('%c' == token) {
          if (args.length < 1) {
            continue;
          }
          const value = args.shift();
          if ('string' != typeof value) {
            continue;
          }
          if (strBuffer != '') {
            results.push(strBuffer);
            strBuffer = '';
          }
          results.push(new ConsoleStyle(value));
        } else {
          strBuffer += token;
        }
      }
      if (strBuffer != '') {
        results.push(strBuffer);
      }
      for (const arg of args) {
        results.push(arg);
      }
      return results;
    }
  }
}
