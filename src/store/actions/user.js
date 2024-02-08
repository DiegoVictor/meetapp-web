export function signInRequest(email, password) {
  return {
    type: '@user/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signUpRequest(email, name, password) {
  return {
    type: '@user/SIGN_UP_REQUEST',
    payload: { email, name, password },
  };
}

export function updateProfileRequest(payload) {
  return {
    type: '@user/UPDATE_PROFILE_REQUEST',
    payload,
  };
}
