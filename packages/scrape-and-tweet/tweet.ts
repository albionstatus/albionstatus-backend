import Twit from 'twit'

// TODO
type Status = {
  raw: any,
  message: string
}

const CONFIG = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

export const tweet = async (status: Status) => {
  console.log('LOL')
  const message = `New server status: ${status.raw}. Message: ${status.message}`

  const twitterClient = new Twit(CONFIG)

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
    console.error(`Tweeting failed: ${e}`)
  }
}