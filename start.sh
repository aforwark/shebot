#!/bin/bash

HUBOT_IRC_NICK=hubher \
HUBOT_IRC_SERVER=irc.freenode.net \
HUBOT_IRC_ROOMS="#sheknowsdev" \
REDISTOGO_URL="redis://devslave.local:6379/" \
bin/hubot -a irc -n Hubot