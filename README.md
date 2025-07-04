# Last.fm Auth Server Discord
Server for connecting a Last.fm account to a Discord user

I basically use this for the /musicrate command in [Andrew Bot](https://github.com/SpookedDoor/Andrew-Discord-Bot).
Refer to ``musicrate.js`` in that repo to see how that works.

## The Setup
I would recommend using a hosting service such as [Render](https://render.com) as it is free to use and pretty easy to set up, and allows other people to connect to the server easily. If you were to run this locally, you would have to know how to port forward. But anyways here's how to set it up:

```
git clone https://github.com/TheDragonary/Lastfm-Auth-Server-Discord.git
```

Make sure you have Node.js installed too and then run this command in the folder:
```
npm install dotenv node-fetch pg md5 express
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
node lastfm-auth-server.js
```
On Render, you would go to settings, then stick that into "Start Command". But wait, that's not all, you still have to set up the database too!

## The Database
This server uses PostgreSQL to store the Last.fm data, that being your Discord ID and Last.fm username, nothing more, nothing less. While you can install PostgreSQL locally and handle everything there, I personally use a service like [Neon](https://neon.com) which is also free and makes things so much easier.

Once you create your database on Neon, click Connect and it will show you a long string that starts with ``postgresql://``. Yes it is everything within the apostrophes, please do not copy "psql". This string needs to go in your ``.env`` like so:
```dotenv
DATABASE_URL=postgresql://neondb_owner:....neon.tech/neondb?sslmode=require&channel_binding=require
```

## The End
There you have it, you have your server and database all set up. All that's left is to link it with your Discord bot. You'll need 2 environment variables:
```dotenv
LASTFM_API_KEY=0
LASTFM_AUTH_SERVER=https://your-server.onrender.com
```
Now everything should be working together!

Please do check out [Andrew Bot](https://github.com/SpookedDoor/Andrew-Discord-Bot). Most of the code was contributed by me, Dragonary, and that also includes the Last.fm integration. This was more of a fun little hobby project if anything and we just wanted our silly AI bot to be able to rate the music we listen to, that's the only reason I created this repo here.