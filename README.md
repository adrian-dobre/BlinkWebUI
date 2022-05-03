# Blink Web UI (front-end)

#### Project
Attempt to build a web portal for Blink (https://blinkforhome.com) products. Currently, the only way to view and 
administer Blink products is via a mobile app. This project is an attempt to build an open source web portal that will 
allow a subset of actions to be performed via a computer browser.

#### Description
This is the front-end component of the portal. It's a simple app written in Typescript, using React. It uses MaterialUI
as design system. Unfortunately Blink does not provide API documentation, as a result everything is a result of 
reverse-engineering the mobile app API calls ([this is the documentation I managed to extract](https://github.com/adrian-dobre/BlinkWebService/blob/master/BlinkForHomeApiDocumentation.md)). I tested the app
only on european servers using a Blink XT2 camera (the only one I own).
The backend can be found here: https://github.com/adrian-dobre/BlinkWebService.

#### Build
In order to build the app, you need NodeJS installed on your computer. Steps to build:
- clone this repo
- run `npm install` inside the root directory
- run `npm run build`

A new build will be outputted in `dist` directory.

#### Releases
You can download a pre-built release from here: https://drive.google.com/drive/folders/1w6ZteA14Bhb52HeKeLxHJfP0sNiNsaM3?usp=sharing

#### Running
For running the app, please see the README.md file of the backed: https://github.com/adrian-dobre/BlinkWebService.

#### Try it out online
You can try a build of the app here: http://blink-web.madtek.ro

Logging level was set to INFO level, it won't log request/response information.

**NOTE**: If there are many people using the demo app at the same time, CloudFront may start blocking requests making the app reply with 401/403 status code. In this case, I suggest you host your own private instance of the app, either locally or on your webserver. You can also try the docker version of the app here built by [@mcmoe](https://github.com/mcmoe) here: https://github.com/mcmoe/blinkwebapp

#### Features
- view the list of recordings
- bulk download recordings
- bulk delete recordings
- play a recording
- view the list of cameras
- enable/disable camera
- view the list of networks
- arm/disarm network
- view the list of blink modules

Note: I was unable to open a live view to the camera, it seems that it uses a proprietary protocol (immis) I could
not figure it out (as stated before, there is no documentation for 3rd party developers).

#### UI Demo
You can see a short [UI Demo here](https://drive.google.com/open?id=1__WDFvufUvQQ_31xT3WVCnsLwtUlsuqz)

#### Roadmap (if there is community interest and time permits)
- (maybe) ability to change settings
- (maybe) UI improvements
- (maybe) cloud (Google Drive) backups of recordings
- others?!


#### Disclaimer
This work represents a personal effort, developed in my spare time and while I have every intention to further develop
this solution, I cannot offer any guarantees. However, anybody can just grab the code and do whatever they want with it
(it is released under GPL v3 license)

If you'd like to support my work you could [buy me a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=E6MU9855FNXYL&source=url).
