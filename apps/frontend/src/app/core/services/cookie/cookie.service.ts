import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {
  /**
   * Returns the value of a cookie
   * @param key name of cookie
   */
  get(key: string): string | null {
    const name = encodeURIComponent(key) + '=';
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookies = decodedCookies.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return null;
  }

  /**
   * Sets Cookie
   * @param key name of cookie
   * @param value value of cookie
   * @param days cookie lifetime
   */
  set(key: string, value: string, days?: number): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expires}; path=/`;
  }

  /**
   * Deletes Cookie
   * @param key Name of Cookie
   */
  delete(key: string): void {
    this.set(key, '', -1);
  }
}
