FROM node:22
COPY src /src
COPY config /config
COPY static /static
COPY package.json package-lock.json .npmrc tsconfig.json vite.config.mts ./
RUN npm ci
RUN npm run build
ENTRYPOINT ["npm", "run", "prod"]