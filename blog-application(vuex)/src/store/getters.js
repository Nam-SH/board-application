// 현재 로그인여부를 판단하는 것이다.
export default {
  isAuthorized (state) {
    return state.accessToken.length > 0 && !!state.me
  }
}