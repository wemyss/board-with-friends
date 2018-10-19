#!/usr/bin/sh

scp -i ~/Desktop/swemyss-thesis.pem -r ./server ec2-user@ec2-13-211-203-242.ap-southeast-2.compute.amazonaws.com:~/
scp -i ~/Desktop/swemyss-thesis.pem package.json ec2-user@ec2-13-211-203-242.ap-southeast-2.compute.amazonaws.com:~/
