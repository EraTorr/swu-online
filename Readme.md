# What is this project ?

An implementation of a tabletop version of Star wars unlimited game

## How to play
https://www.patreon.com/posts/it-was-long-but-105073018

## Website
[link](https://swu.powk.fr)

## Discord
https://discord.gg/7t8cGZpRrq

## Requirements

- pnpm
- redis server
- a CDN for the images   
  I use imagekit.io free version, currently it's shared between my local and the online version so the limitation could be reached and block next images download
- a server if you want to deploy it online (oracle offer a free server which I use currently)

## Env file

You need to run a redis server and add the key REDIS_SERVER for connexion in `.env` file

`REDIS_SERVER="redis://username:password@server_name"`

