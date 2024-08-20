import type { ElysiaApp } from '@/.'
import type { JWTPayloadSpec } from '@elysiajs/jwt'

export const jwtHandler = (app: ElysiaApp) =>
  app
    .guard({
      beforeHandle: async ({ set, cookie: { accessToken }, jwt }) => {
        const profile = await jwt.verify(accessToken.value)
        if (!profile) {
          set.status = 401
          return 'Unauthorized'
        }
      },
    })
    .derive(async ({ jwt, cookie: { accessToken } }) => {
      const profile = await jwt.verify(accessToken.value)
      return {
        profile: profile as JWTPayloadSpec,
      }
    })
