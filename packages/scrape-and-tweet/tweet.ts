import { $fetch } from 'ofetch'
import OAuth from 'oauth-1.0a'
import HmacSHA1 from 'crypto-js/hmac-sha1.js'
import Base64 from 'crypto-js/enc-base64.js'
import { ServerName, Status } from '../shared/types.js'
import { Env } from './types.js'

type TweetArgs = {
  status: Status
  server: ServerName,
  env: Env
}
export const tweet = async ({ status, server, env }: TweetArgs) => {
  const message = `New server status of Albion ${server}: ${status.type}. #albion${server} Message: ${status.message}`

  const config = {
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    access_token: env.TWITTER_ACCESS_TOKEN,
    access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
  }
  await sendTweet(message, config)
}

type TwitterKeys = {
  consumer_key: string
  consumer_secret: string
  access_token: string
  access_token_secret: string
}

export async function sendTweet (tweet: string, keys: TwitterKeys) {
  const oauth = new OAuth({
    consumer: { key: keys.consumer_key, secret: keys.consumer_secret },
    signature_method: 'HMAC-SHA1',
    hash_function (baseString: string, key: string) {
      return HmacSHA1(baseString, key).toString(Base64)
    },
  });

  const oauthToken = {
    key: keys.access_token,
    secret: keys.access_token_secret,
  };

  const requestData = {
    url: 'https://api.twitter.com/1.1/statuses/update.json',
    method: 'POST',
    data: { status: `${tweet.slice(0, 235)}${tweet.length > 235 ? '...' : ''}` },
  };

  try {
    const response = await $fetch(requestData.url, {
      headers: {
        ...oauth.toHeader(oauth.authorize(requestData, oauthToken)),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestData.data),
      method: requestData.method
    });

    return {
      data: response
    }
  } catch (e) {
    console.error('Error during tweeting')
    console.error(e)
  }
}
