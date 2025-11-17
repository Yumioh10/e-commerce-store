export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpire: '7d' as const,
  nodeEnv: process.env.NODE_ENV
};