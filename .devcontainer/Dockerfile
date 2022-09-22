FROM ubuntu:22.04

RUN apt update && apt install -y \
    git \
    curl \
    vim \
    htop \
    jq


RUN curl -Ls https://deb.nodesource.com/setup_18.x | bash
RUN apt update && apt install -y nodejs
RUN npm i -g npm

WORKDIR /app
COPY . /app

RUN useradd -m user

CMD [ "sleep", "infinity" ]