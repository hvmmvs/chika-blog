#!/bin/sh
# Only substitute $DOMAIN — leave nginx variables ($host, $uri, etc.) untouched
envsubst '${DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
envsubst '${DOMAIN}' < /etc/nginx/nginx-ssl.conf.template > /etc/nginx/nginx-ssl.conf
