# Last.fm Auth Server Discord
Server for connecting a Last.fm account to a Discord user

I basically use this for the /musicrate command in [Andrew Bot](https://github.com/SpookedDoor/Andrew-Discord-Bot).
Refer to ``musicrate.js`` in that repo to see how that works.

## The Setup
I recommend using [Cloudflared](https://github.com/TheDragonary/Lastfm-Auth-Server-Discord/edit/main/README.md#hosting-locally-with-cloudflared) for a local setup but if you would prefer to host it online, then use a service such as [Railway](https://railway.com) (30 day free trial) or [Render](https://render.com) (freemium).

There is one problem with using Render and that is the fact that it turns off when inactive for too long. This will cause the /musicrate command to crash the bot. Give it a minute and /musicrate will be safe to run again. It's recommended to run the bot with PM2 so you don't need to manually restart the bot when it crashes.

Anyways, here's how to set it up:

```
git clone https://github.com/TheDragonary/Lastfm-Auth-Server-Discord.git
```

Make sure you have Node.js installed too and then run this command in the folder:
```
npm install
```
This installs all of the dependencies you need but a service like Render would automatically handle that for you.

Most importantly, you need a ``.env`` file. Here's how it should look like:
```dotenv
LASTFM_API_KEY=0
LASTFM_API_SECRET=0
DATABASE_URL=postgresql://
```
On Render, you would find this in the Environment section.

Once that's done, run the server:
```
npm run start
```
On Render, you would go to settings, then stick that into "Start Command". But wait, that's not all, you still have to set up the database too!

## The Database
This server uses PostgreSQL to store the Last.fm data, that being your Discord ID and Last.fm username, nothing more, nothing less. While you can install PostgreSQL locally and handle everything there, I personally use a service like [Neon](https://neon.com) which is free and easy to use.

Once you create your database on Neon, click Connect and it will show you a long string that starts with ``postgresql://``. Yes it is everything within the apostrophes, please do not copy "psql". This string needs to go in your ``.env`` like so:
```dotenv
DATABASE_URL=postgresql://neondb_owner:....neon.tech/neondb?sslmode=require&channel_binding=require
```

## Hosting Locally with Cloudflared
Make sure to install Cloudflared of course. You can download it from [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/). You can also install it through Winget, Scoop, Chocolatey or NPM, whichever installation method you go with, it will all work the same in the end anyways.

After that's done, here's how to get it running with your auth server:
```
cloudflared tunnel --url http://localhost:3001
```
Yeah it really is that simple. It will provide you with a link that looks a little something like this `https://randomly-generated-link.trycloudflare.com` and all you gotta do is stick that into `LASTFM_AUTH_SERVER` as shown in the final section right below.

## The End
There you have it, you have your server and database all set up. All that's left now is to link it with your Discord bot. You'll need just two environment variables:
```dotenv
LASTFM_API_KEY=0
LASTFM_AUTH_SERVER=https://your-server.com
```
Now everything should be working together!

Please do check out [Andrew Bot](https://github.com/SpookedDoor/Andrew-Discord-Bot). Most of the code was contributed by me, Dragonary, and that also includes the Last.fm integration. This was more of a fun little hobby project if anything and we just wanted our silly little AI bot to be able to rate the music we listen to, that's the only reason I created this repo here.
