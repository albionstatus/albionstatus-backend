# AlbionStatus Backend

The AlbionStatus backend consists of two applications and a database:

* The API microservice running on "micro" which is only fetching status information and acts as data provider
* The Scraper (which was [a python implementation earlier](https://github.com/manniL/albionstatus-scraper-bot/)) that retrieves the status, saves it to the DB and tweets changes
* The MySQL database

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

Be sure to look into the repositories of the [website](https://github.com/manniL/albionstatus-website) too!


### Prerequisites

To install the microservice on your machine, you'll need:

* Docker and docker compose

### Installing

1. Pull the application and switch to the correct branch (mostly `develop`, or `master` if you want to deploy)
2. Run `docker-compose up`

Here you go!

## License

See [LICENSE file](https://github.com/manniL/albionstatus-api/blob/master/LICENSE)
