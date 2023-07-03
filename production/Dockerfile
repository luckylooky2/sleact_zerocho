FROM debian:buster

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y nginx && mkdir /tmp/dist

COPY conf/nginx.conf   /etc/nginx/conf.d/nginx.conf
COPY dist   /tmp/dist
COPY index.html /tmp

EXPOSE 4242

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]