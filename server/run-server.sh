#!/usr/bin/sh
#
# Requires forever.js, if not installed you can use:
#
# > npm install -g forever
#
# TODO: Automate

forever stopall
forever start index.js
