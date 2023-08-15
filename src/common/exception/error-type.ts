export const ErrorType = {
  // User & Auth
  UnauthorizedUser: { 
    code: 401, 
    name: 'UnauthorizedUser', 
    message: '인증되지 않은 사용자입니다.', 
  },

  TokenHasExpired: {
    code: 401,
    name: 'TokenHasExpired',
    message: '만료되거나 유효하지 않은 토큰입니다.',
  },

  UserNotExist: {
    code: 404,
    name: 'UserNotExist',
    message: '해당 사용자를 찾을 수 없습니다.',
  }
 
}