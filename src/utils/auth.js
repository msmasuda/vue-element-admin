import Cookies from 'js-cookie'

const TokenKey = 'access-token'
const ClientKey = 'client'
const UidKey = 'uid'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getClient() {
  return Cookies.get(ClientKey)
}
export function setClient(client) {
  return Cookies.set(ClientKey, client)
}
export function removeClient() {
  return Cookies.remove(ClientKey)
}

export function getUid() {
  return Cookies.get(UidKey)
}
export function setUid(uid) {
  return Cookies.set(UidKey, uid)
}
export function removeUid() {
  return Cookies.remove(UidKey)
}
