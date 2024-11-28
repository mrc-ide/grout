FROM node:20
COPY src /src
COPY config /config
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
RUN npm run build
ENTRYPOINT ["node", "dist/server.js"]