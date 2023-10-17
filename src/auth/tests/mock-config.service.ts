import { 
  JWT_ACCESS_TOKEN_EXPIRATION_TIME, 
  JWT_ACCESS_TOKEN_SECRET, 
  JWT_REFRESH_TOKEN_EXPIRATION_TIME, 
  JWT_REFRESH_TOKEN_SECRET 
} from "src/common/constants/config.constant";

export const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === JWT_ACCESS_TOKEN_EXPIRATION_TIME) {
      return '30m';
    } else if (key === JWT_ACCESS_TOKEN_SECRET) {
      return 'JwtAccessTokenSecret'
    } else if (key === JWT_REFRESH_TOKEN_EXPIRATION_TIME) {
      return '14d';
    } else if (key === JWT_REFRESH_TOKEN_SECRET) {
      return 'JwtRefreshTokenSecret';
    }

    return null;
  })
}