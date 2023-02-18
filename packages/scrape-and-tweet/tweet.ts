import Twit from 'twit'
import { ServerName, Status } from '../shared/types.js'
import { Env } from './types.js'

type TweetArgs = {
  status: Status
  server: ServerName,
  env: Env
}
export const tweet = async ({ status, server, env }: TweetArgs) => {
  const message = `New server status of Albion ${server}: ${status.type}. #albion${server} Message: ${status.message}`

  const twitterClient = new Twit({
    consumer_key: env.TWITTER_CONSUMER_KEY,
    consumer_secret: env.TWITTER_CONSUMER_SECRET,
    access_token: env.TWITTER_ACCESS_TOKEN,
    access_token_secret: env.TWITTER_ACCESS_TOKEN_SECRET
  })

  if (message.length <= 280) {
    await tweetMessage(twitterClient, message)
    return
  }

  const truncatedMessage = `${message.slice(0, 270)}...`
  const reason = `...${message.slice(270)}`

  const messageIdToAnswer = await tweetMessage(twitterClient, truncatedMessage)
  await tweetMessage(twitterClient, reason, messageIdToAnswer)
}

async function tweetMessage (client: Twit, message: string, messageIdToAnswer?: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('Results have been updated! Not tweeting because I am not in production mode')
    return
  }
  console.info('Results have been updated! Tweeting now')

  try {
    const { data } = await client.post('statuses/update', {
      status: message,
      in_reply_to_status_id: messageIdToAnswer,
      auto_populate_reply_metadata: messageIdToAnswer ? true : undefined
    })

    // @ts-expect-error Faulty types
    if (data.errors) {
      console.error('Tweeting failed')
      // @ts-expect-error Faulty types
      console.error(data.errors)
      return
    }

    console.info('Tweeted successfully')
    // @ts-expect-error Faulty types
    return data.id_str as string // String version of ID because of int precision
  } catch (e) {
    console.error('Tweeting failed')
    console.error(e)
  }
}