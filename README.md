# Toolbox

Bot written in typescript to perform tasks that would normally take a while.

## Setup

1. Install all the packages with `npm install`.
2. Edit `.env` with all your configuration. Use `.env.example` as a guideline.

```
TOKEN=TOKEN
PREFIX=PREFIX
CLIENT_ID=ID
CLIENT_SECRET=SECRET
```

3. Run `npm start` to format, build and then start the bot.

## Commands

- Misc
  - `ping`: Latency and memory stats
  - `help`: Help menu
- Roles
  - `add-role-to-role`: Adds a role to everyone with another role
  - `rem-role-from-role`: Removes a role from everyone with another role
