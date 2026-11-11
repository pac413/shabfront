import {
  clearRefreshToken,
  clearToken,
  setAccessToken,
  setAccessTokenExpiration,
  setRefreshToken,
  TokenKeys,
} from './token'

const { localStorage } = window

enum Keys {
  LogoutRequest = 'logout_request',
}

const sendLogoutToOtherTabs = () => {
  localStorage.setItem(Keys.LogoutRequest, 'true')
  localStorage.removeItem(Keys.LogoutRequest)
}

type AuthenticationPayload = {
  refreshToken: string
  accessToken: string
  accessTokenExpiresAt: string
}

type TokenPayload = {
  accessToken: string
  accessTokenExpiresAt: string
}

export enum SessionEvent {
  AccessToken = 'accessToken',
  Logout = 'logout',
}
class Session {
  constructor() {
    // listen for changes to localStorage
    if (window.addEventListener) {
      window.addEventListener('storage', (e) => this.onStorageEvent(e), false)
    } else {
      // old browser compatibility, legacy code, possibly not necessary
      ;(window as any).attachEvent('onstorage', () => this.onStorageEvent())
    }
  }

  private callbacks: { [k in SessionEvent]: Function[] } = {
    accessToken: [],
    logout: [],
  }

  private onStorageEvent(e?: StorageEvent) {
    // old browser compatibility, legacy code, possibly not necessary
    const event = e || (window.event as StorageEvent)

    // the access token has changed --- login/refresh
    if (event.key === TokenKeys.AccessToken) {
      this.callbacks.accessToken.forEach((c) => c(event.newValue))
    }

    // user has logged out in another tab
    if (event.key === Keys.LogoutRequest && event.newValue !== null) {
      this.callbacks.logout.forEach((c) => c(event.newValue))
    }
  }

  /** Attach a callback to a session event */
  public on(event: SessionEvent, callback: Function) {
    this.callbacks[event].push(callback)
  }

  /**
   * Authenticate session for user
   *
   * Set all tokens and send refresh token to other open tabs
   */
  public authenticate(payload: AuthenticationPayload) {
    setAccessToken(payload.accessToken)
    setAccessTokenExpiration(payload.accessTokenExpiresAt)
    setRefreshToken(payload.refreshToken)
  }

  /**
   * Updates user's access token within this tab
   */
  public updateToken(payload: TokenPayload) {
    setAccessToken(payload.accessToken)
    setAccessTokenExpiration(payload.accessTokenExpiresAt)
  }

  /**
   * Logs user out of session
   *
   * Clears all tokens and sends a request to logout other tabs
   */
  public logout() {
    clearToken()
    clearRefreshToken()
    sendLogoutToOtherTabs()
  }
}

export default new Session()
