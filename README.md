# grout
Grout serves map tiles (mbtiles) data which can be consumed in web front ends by Leaflet etc.

## Development

Grout is implemented as an [express](https://expressjs.com/) server in Typescript.

Developed with node v22.

Run in dev mode with hot reloading: `npm run dev`

Build for production: `npm run build`

Run in production mode: `npm run prod`

In both modes, local run is on port 5000. Port is configured in `config/grout.config.json`

## Tests

The server needs to be running for the integration tests to pass. 

Run unit and integration tests with `npm run test`

# Lint

Run lint with `npm run lint`. To do any possible automatic fixes run `npm run lint-fix`.

## Docker
See the `docker` folder for Dockerfile and scripts to build, push, run, stop, and push branch tag for the image. The run 
script always pulls. The image is pushed to the ghcr.io registry. 