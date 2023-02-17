// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export type OutputType =
  'debug'
  | 'log'
  | 'info'
  | 'warn'
  | 'error'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'clear'
;

export type ConsoleDataStyle = {
  type: 'style',
  value: string,
};

export type ConsoleDataObject = {
  type: 'object',
  string: string, // value[Symbol.toStringTag] if applicable, otherwise value.constructor.name if applicable, otherwise String(value)
  value: unknown,
  objectType: 'string' | 'number' | 'boolean' | 'undefined' | 'symbol' | 'function' | 'object' | 'array' | 'typedarray' | 'map' | 'set' | 'regexp' | 'null' | 'bigint',
};

export type ConsoleDataString = {
  type: 'string',
  value: string,
};

export type ConsoleDataValue = ConsoleDataStyle | ConsoleDataObject | ConsoleDataString;

export type ConsoleData = {
  type: OutputType,
  values: ConsoleDataValue[],
};
