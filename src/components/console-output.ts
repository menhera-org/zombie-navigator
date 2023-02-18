// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ConsoleData } from "../modules/console/RemoteConsoleData";

export class ConsoleOutputElement extends HTMLElement {
  private readonly _outputElement: HTMLDivElement;

  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      throw new Error('Shadow root is null');
    }

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/console-output.css';
    this.shadowRoot.appendChild(styleSheet);

    const outputElement = document.createElement('div');
    outputElement.classList.add('output');
    this.shadowRoot.appendChild(outputElement);
    this._outputElement = outputElement;
  }

  public clear(): void {
    this._outputElement.textContent = '';
  }

  public output(data: ConsoleData): void {
    const type = data.type;
    if ('clear' == type) {
      this.clear();
      return;
    }

    const outputElement = this._outputElement;

    const dataOuterElement = document.createElement('div');
    dataOuterElement.classList.add('data');
    dataOuterElement.classList.add(type);
    outputElement.appendChild(dataOuterElement);

    const dataElement = document.createElement('div');
    dataElement.classList.add('data-inner');
    dataOuterElement.appendChild(dataElement);

    const stack = data.stack.split('\n')[0] as string;
    const trimmedStack = stack.replace(/^[^@]*@.*\//, '');
    const stackElement = document.createElement('div');
    stackElement.classList.add('data-stack');
    stackElement.textContent = trimmedStack;
    dataOuterElement.appendChild(stackElement);

    let style = '';
    for (const value of data.values) {
      const valueElement = document.createElement('div');
      valueElement.classList.add(`value-${value.type}`);
      dataElement.appendChild(valueElement);
      switch (value.type) {
        case 'string': {
          valueElement.textContent = value.value;
          const element = valueElement as unknown as { style: string; };
          element.style = style;
          break;
        }

        case 'style': {
          style = value.value;
          break;
        }

        case 'object': {
          const object = value.value;
          const objectElement = document.createElement('div');
          objectElement.classList.add('object');
          objectElement.classList.add(`object-${value.objectType}`);
          valueElement.appendChild(objectElement);
          switch (value.objectType) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined':
            case 'null':
            case 'symbol':
            case 'bigint': {
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              objectValue.textContent = value.string;
              objectElement.appendChild(objectValue);
              break;
            }

            case 'regexp':
            case 'function': {
              const objectLabel = document.createElement('span');
              objectLabel.classList.add('object-label');
              objectLabel.textContent = value.string;
              objectElement.appendChild(objectLabel);
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              objectValue.textContent = String(object);
              objectElement.appendChild(objectValue);
              break;
            }

            case 'array':
            case 'typedarray': {
              const objectLabel = document.createElement('span');
              objectLabel.classList.add('object-label');
              objectLabel.textContent = value.string;
              objectElement.appendChild(objectLabel);
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              objectValue.textContent = `[${String(object)}]`;
              objectElement.appendChild(objectValue);
              break;
            }

            case 'map': {
              const objectLabel = document.createElement('span');
              objectLabel.classList.add('object-label');
              objectLabel.textContent = value.string;
              objectElement.appendChild(objectLabel);
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              let strValue = '';
              const entries = (object as Map<unknown, unknown>).entries();
              for (const [key, value] of entries) {
                strValue += `${key} -> ${value}, `;
              }
              objectValue.textContent = `{ ${strValue} }`;
              objectElement.appendChild(objectValue);
              break;
            }

            case 'set': {
              const objectLabel = document.createElement('span');
              objectLabel.classList.add('object-label');
              objectLabel.textContent = value.string;
              objectElement.appendChild(objectLabel);
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              objectValue.textContent = `{ ${[... (object as Set<unknown>)].join(', ')} }`;
              objectElement.appendChild(objectValue);
              break;
            }

            default: {
              if (object instanceof DOMException || object instanceof Error) {
                const objectLabel = document.createElement('span');
                objectLabel.classList.add('object-label');
                objectLabel.textContent = `${value.string}:`;
                objectElement.appendChild(objectLabel);
                const objectValue = document.createElement('span');
                objectValue.classList.add('object-value');
                objectValue.textContent = `${String(object)}\n${object.stack ?? ''}`;
                objectElement.appendChild(objectValue);
                break;
              }

              let jsonValue = '(unknown)';
              try {
                jsonValue = JSON.stringify(object);
              } catch (e) {
                // ignore
              }
              const objectLabel = document.createElement('span');
              objectLabel.classList.add('object-label');
              objectLabel.textContent = value.string;
              objectElement.appendChild(objectLabel);
              const objectValue = document.createElement('span');
              objectValue.classList.add('object-value');
              objectValue.textContent = jsonValue;
              objectElement.appendChild(objectValue);
              break;
            }
          }
          break;
        }
      }
    }
  }
}

customElements.define('console-output', ConsoleOutputElement);
