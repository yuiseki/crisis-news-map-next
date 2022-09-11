FROM ubuntu:22.04

RUN apt update && apt install -y \
    git \
    curl \
    vim \
    htop \
    jq


RUN curl -Ls https://deb.nodesource.com/setup_16.x | bash
RUN apt update && apt install -y nodejs

WORKDIR /app
COPY . /app

RUN useradd -m user

RUN npm ci

CMD [ "sleep", "infinity" ]