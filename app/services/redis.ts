import { createClient } from 'redis'

export const redis = await createClient({
  url: process.env.REDIS_SERVER,
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()
