# Board with Friends
> 2D sidescroller snowboarding game with friends

---
## OpenGameArt Credit
We'd like to acknowledge the use of music and button assets from [OpenGameArt](https://opengameart.org/). The content on OpenGameArt is free of copyright and open source. Thanks goes to the contributors!

---

## Getting started
If you don't already have NodeJS 10.x installed, use `brew install node` to install it on macOS. For other OS's see [this guide](https://nodejs.org/en/download/package-manager/).

1. Clone this repository
2. `cd` into the root of the repository and run `npm install` to install dependencies
3. `npm start` to start development server for the client. (runs on [localhost:1234](http://localhost:1234/))
4. `npm run server` to run the NodeJS game server (run this at the same time as the client to dev)
5. `npm run lint` to run the linter before creating a pull request


---

## Facebook integration

__Local development__
1. `npm run start:fb` - go to https://localhost:1234 and accept the self signed certificate
2. Then go to: https://www.facebook.com/embed/instantgames/270512940269917/player?game_url=https://localhost:1234 to see your app in facebook embed
3. `npm run server` to run the server
4. Note that to get multiplayer working you will need to disable mixed content protection in your browser


__Remote__
1. Go to https://ec2-13-211-203-242.ap-southeast-2.compute.amazonaws.com:8443/ and add the security certificate to your exception list
2. Play game at: https://www.facebook.com/instantgames/270512940269917/


### Deployment
__Client__
1. `npm run build`
2. Upload `dist.zip` to dev console facebook
3. Change production to the new build
4. Test

__Server__
1. `sh upload-server-to-aws.sh`
2. ssh into the server
3. Run `run-server.sh`

---

## Workflow

1. Create a new branch - `git checkout -b my_new_feature`
2. Do all the work
3. Push up branch to GitHub
4. Completed task? Create a Pull Request and add reviewers

---

## Colour palette
The colour palette for the project can be found [here](http://colorpeek.com/#466e85,8fb2c4,d0dde4,ecefed,395123,6e8c52,d91b1e,540f0f,9b1417,fc9b2d,54ded8).

---

## Useful links
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/index.html)
- [Video tutorial to learn Phaser 3](https://youtu.be/T9kOFSFvgKc?t=7m)
- [ES6 Phaser 3 Video Tute](https://www.youtube.com/watch?v=7cpZ5Y7THmo)
- [Top 10 2D Game asset sites](https://www.gamasutra.com/blogs/DavidYing/20151221/262323/Top_10_Best_2D_Game_Asset_sites.php)
- [Making your first Phaser 3 game](https://www.phaser.io/tutorials/making-your-first-phaser-3-game)
- [Random Phaser 3 Game](http://labs.phaser.io/edit.html?src=src\games\mass%20attack\updated.js)
- [How to make parallax backgrounds in Phaser](https://www.joshmorony.com/how-to-create-a-parallax-background-in-phaser/)
