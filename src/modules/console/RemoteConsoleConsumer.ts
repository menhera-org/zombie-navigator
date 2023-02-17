// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ConsoleOutput } from "./ConsoleOutput";
import { ConsoleConsumer } from "./ConsoleConsumer";
import { EventSink } from "../events/EventSink";
import { ConsoleStyle } from "./ConsoleStyle";
import { OutputType, ConsoleData, ConsoleDataValue } from "./RemoteConsoleData";

const TypedArray = Object.getPrototypeOf(Uint8Array);

export class ConsoleDefaultConsumer implements ConsoleConsumer {
  public readonly onMessage = new EventSink<ConsoleData>();

  public output(output: ConsoleOutput): void {
    const type: OutputType = output.type;
    const values = output.data;
    const resultValues: ConsoleDataValue[] = [];
    for (const value of values) {
      if ('string' == typeof value) {
        resultValues.push({
          type: 'string',
          value: value,
        });
      } else if (value instanceof ConsoleStyle) {
        resultValues.push({
          type: 'style',
          value: value.style,
        });
      } else {
        const valueType = typeof value;
        switch (valueType) {
          case 'string': {
            throw new Error('Unexpected error');
          }

          case 'symbol': {
            resultValues.push({
              type: 'object',
              objectType: 'symbol',
              value: undefined,
              string: String(value),
            });
            break;
          }

          case 'number':
          case 'boolean':
          case 'bigint':
          case 'undefined': {
            resultValues.push({
              type: 'object',
              objectType: valueType,
              value: value,
              string: String(value),
            });
            break;
          }

          case 'function': {
            if (typeof value != 'function') {
              throw new Error('Unexpected error');
            }
            resultValues.push({
              type: 'object',
              objectType: 'function',
              value: String(value),
              string: value.name,
            });
            break;
          }

          case 'object': {
            if (value === null) {
              resultValues.push({
                type: 'object',
                objectType: 'null',
                value: null,
                string: 'null',
              });
            } else if (value instanceof TypedArray) {
              const typedArr = value as { [Symbol.toStringTag]: string, length: number };
              resultValues.push({
                type: 'object',
                objectType: 'typedarray',
                value: structuredClone(value),
                string: (typedArr == null ? 'TypedArray' : String(typedArr[Symbol.toStringTag])) + `(${typedArr.length})`,
              });
            } else if (Array.isArray(value)) {
              let arr: unknown[];
              try {
                arr = structuredClone(value);
              } catch (e) {
                arr = [];
              }
              resultValues.push({
                type: 'object',
                objectType: 'array',
                value: arr,
                string: `Array(${arr.length})`,
              });
            } else if (value instanceof Set) {
              let set: Set<unknown>;
              try {
                set = structuredClone(value);
              } catch (e) {
                set = new Set();
              }
              resultValues.push({
                type: 'object',
                objectType: 'set',
                value: set,
                string: `Set(${set.size})`,
              });
            } else if (value instanceof Map) {
              let map: Map<unknown, unknown>;
              try {
                map = structuredClone(value);
              } catch (e) {
                map = new Map();
              }
              resultValues.push({
                type: 'object',
                objectType: 'map',
                value: map,
                string: `Map(${map.size})`,
              });
            } else {
              const objValue = value as { [Symbol.toStringTag]?: string , [key: string]: unknown };
              let obj: { [key: string]: unknown };
              try {
                obj = structuredClone(objValue);
              } catch (e) {
                obj = {};
              }
              let string = 'Object';
              try {
                string = String(objValue);
              } catch (e) {
                // ignore
              }
              resultValues.push({
                type: 'object',
                objectType: 'object',
                value: obj,
                string: String(objValue[Symbol.toStringTag]) ?? String(obj.constructor.name) ?? string,
              });
            }
          }
        }
      }
    }

    const consoleData: ConsoleData = {
      type: type,
      values: resultValues,
    };
    this.onMessage.dispatch(consoleData);
  }
}
