# AlbionStatus microservice

This NodeJS microservice is used as API between the AlbionStatus MySQL
backend, where the status information is saved, and the AlbionStatus website.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

Be sure to look into the repositories of the [website](https://github.com/manniL/albionstatus-website)
and the [scraper and twitter bot](https://github.com/manniL/albionstatus-scraper-bot/)!


### Prerequisites

To install the microservice on your machine, you'll need:

* A web server (I've tested it with Apache2)
* A MySQL database where the status information is present
* [NodeJS and NPM](https://nodejs.org/)

Okay, you got these? Great, let's continue!

### Installing

1. Pull the application and switch to the correct branch (mostly `develop`, or `master` if you want to deploy)
2. Get all dependencies by using `npm install`
3. Grab a copy of the config.example.json file, enter the needed information
and save it as config.json
4. If you are ready to serve, use `npm start` to start the microservice

Here you go!

## Deployment

Deployment works similar to installation. Just go for `master` instead of `develop`.

## Possible errors and there solutions

None known by now

## Built With

* [NodeJS and NPM](https://nodejs.org/) - Backend javascript and dependency
management
* [Micro](https://github.com/zeit/micro) - Awesome and tiny microservice
framework

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, take a look in [our repository](https://github.com/manniL/albionstatus-api).

## Authors

* **Alexander Lichter** - *Main work on the project* - [Website](http://developmint.de) - [BitBucket](https://bitbucket.org/manniL/) - [Github](https://github.com/manniL) - [StackOverflow](http://stackoverflow.com/users/3975480/mannil)

See also the [list of contributors](https://github.com/manniL/albionstatus-api/contributors) who participated in this project.

## License

See [LICENSE file](https://github.com/manniL/albionstatus-api/blob/master/LICENSE)