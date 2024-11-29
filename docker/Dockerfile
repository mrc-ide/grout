FROM node:22
COPY src /src
COPY config /config
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
RUN npm run build
ENTRYPOINT ["npm", "run", "prod"]