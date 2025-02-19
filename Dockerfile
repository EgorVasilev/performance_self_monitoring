FROM node:22.11.0 as base

WORKDIR /usr/src/app

FROM base AS dev
#RUN --mount=type=bind,source=package.json,target=package.json \
#    --mount=type=bind,source=package-lock.json,target=package-lock.json \
#    --mount=type=cache,target=/root/.npm \
#    npm ci --include=dev \

COPY . .

RUN npm install -g typescript@5.7.2
RUN npm install

CMD bash
