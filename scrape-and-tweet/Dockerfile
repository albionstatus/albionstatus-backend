FROM node:12-alpine

WORKDIR /app

COPY ./src/package.json .

COPY ./src/yarn.lock .

RUN yarn install --frozen-lockfile

COPY ./src .

# Add crontab file in the cron directory
ADD ./scrape-and-tweet/crontab /etc/cron.d/check-albion-status

# Give execution rights on the cron job
RUN chmod +x /etc/cron.d/check-albion-status

# Apply cron job
RUN crontab /etc/cron.d/check-albion-status

CMD crond -f -L /dev/stdout


