// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';

/**
 * A service that modifies the headers of frames to allow them to be
 * loaded in this extension's pages.
 */
export class FramingHeadersService {
  private static readonly _INSTANCE = new FramingHeadersService();

  public static getInstance(): FramingHeadersService {
    return this._INSTANCE;
  }

  private constructor() {
    browser.webRequest.onHeadersReceived.addListener(
      this.onHeadersReceived.bind(this),
      {
        urls: ['<all_urls>'],
        types:  ['sub_frame'],
      },
      ['blocking', 'responseHeaders']
    );

  }

  private setHeader(details: browser.WebRequest.OnHeadersReceivedDetailsType, headerName: string, headerValue: string) {
    let found = false;
    details.responseHeaders?.forEach((header) => {
      if (headerName === header.name.toLowerCase()) {
        header.value = headerValue;
        found = true;
      }
    });
    if (!found) {
      details.responseHeaders?.push({
        name: headerName,
        value: headerValue,
      });
    }
  }

  private removeFrameOptions(details: browser.WebRequest.OnHeadersReceivedDetailsType): boolean {
    let removed = false;
    if (!details.responseHeaders) {
      return removed;
    }
    for (let i = details.responseHeaders.length - 1; i >= 0; i--) {
      const header = details.responseHeaders[i];
      if (!header) continue;
      if (['x-frame-options', 'frame-options'].includes(header.name.toLowerCase())) {
        details.responseHeaders.splice(i, 1);
        removed = true;
      }
    }
    return removed;
  }

  private removeCspFrameAncestors(details: browser.WebRequest.OnHeadersReceivedDetailsType): boolean {
    let removed = false;
    if (!details.responseHeaders) {
      return removed;
    }
    for (let i = details.responseHeaders.length - 1; i >= 0; i--) {
      const header = details.responseHeaders[i];
      if (!header || !header.value) continue;
      if (['content-security-policy', 'content-security-policy-report-only'].includes(header.name.toLowerCase())) {
        const oldHeaderValue = header.value;
        header.value = header.value.replace(/frame-ancestors[^;]*;?/g, '');
        if (oldHeaderValue !== header.value) {
          removed = true;
        }
      }
    }
    return removed;
  }

  private onHeadersReceived(details: browser.WebRequest.OnHeadersReceivedDetailsType) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const frameAncestors = (details as any).frameAncestors as {
      frameId: number;
      url: string;
    }[];
    if (frameAncestors.length < 1) {
      return;
    }

    // if there is any ancestor that is not from this extension, we do not
    // want to do anything
    for (const ancestor of frameAncestors) {
      const url = new URL(ancestor.url);
      if (url.origin !== location.origin) {
        return;
      }
    }

    // only allow framing from our own extension
    const parentUrl = frameAncestors[0]?.url;
    if (this.removeFrameOptions(details)) {
      console.log('removed x-frame-options for %s on %s', details.url, parentUrl);
    }
    if (this.removeCspFrameAncestors(details)) {
      console.log('removed csp frame-ancestors for %s on %s', details.url, parentUrl);
    }
    return { responseHeaders: details.responseHeaders };
  }
}
