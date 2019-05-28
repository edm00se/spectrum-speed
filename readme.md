# spectrum-speed [![Build Status](https://travis-ci.org/edm00se/spectrum-speed.svg?branch=master)](https://travis-ci.org/edm00se/spectrum-speed)

> Test your download and upload speed using [Spectrum's speed test](https://www.spectrum.com/internet/speed-test)

![](screenshot.gif)


## Install

Ensure you have [Node.js](https://nodejs.org) version 8+ installed. Then run the following:

```
$ npm install --global spectrum-speed
```


## Usage

```
$ spectrum --help

  Usage
    $ spectrum
    $ spectrum > file

  Options
    --upload, -u  Measure upload speed in addition to download speed

  Examples
    $ spectrum --upload > file && cat file
    17 Mbps
    4.4 Mbps
```


##### Upload speed

<img src="screenshot-upload.gif" width="500" height="260">


## Related

- [fast-cli](https://github.com/sindresorhus/fast-cli) - Test your internet connection speed and ping using fast.com
- [speed-test](https://github.com/sindresorhus/speed-test) - Test your internet connection speed and ping using speedtest.net
