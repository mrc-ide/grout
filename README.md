# grout
Grout serves map tiles (mbtiles) data which can be consumed in web front ends by Leaflet etc.

## Development

Grout is implemented as an [express](https://expressjs.com/) server in Typescript.

Developed with node v22.

Run in dev mode with hot reloading managed by vite: `npm run dev`

Build for production: `npm run build`

Run in production mode: `npm run prod`

In both modes, local run is on port 5000. Port is configured in `config/grout.config.json` (for running in production)
and `vite.config.mts` (for running in dev mode).

## Tests

The server needs to be running for the integration tests to pass. 

Run unit and integration tests with `npm run test`

Run tests with coverage using `npm run coverage`

Manual testing can be done by viewing [test.html](test.html) in the browser. Here you can choose to view any available dataset on
either a local grout server, or deplayed to mrcdata. 

# Lint

Run lint with `npm run lint`. To do any possible automatic fixes run `npm run lint-fix`.

## Docker
See the `docker` folder for Dockerfile and scripts to build, push, run, stop, and push branch tag for the image. The run 
script always pulls. The image is pushed to the ghcr.io registry. 

## JSON Schema

We use [JSON Schema](https://json-schema.org/) to define the format of JSON responses, and to validate that expected data formats are returned
during integration tests. JSON schema files can be found in the `./schema` folder. The [Ajv package](https://ajv.js.org/) is used for validation.

`Response.schema.json` defines the generic schema for all responses (with `status`, `data` and `errors` properties),
while the other schema files define the expected format of the `data` property for individual endpoints. When defining a new 
endpoint, or modifying the format of an existing one, you should add or edit the corresponding
schema file, for the `data` part of the response. 

The Response schema includes a `$ref` for the `data` property, with value `grout-data`. In order for this `$ref` to be 
satisfied during validation, the expected data schema needs to be given `$id: "grout-data"`. This happens in the integration 
test helper method `validateResponse` (called from `getData`), which takes a data schema name parameter. It loads both the Response 
and expected data schema, and appends `$id: "grout-data` to the data schema before performing validation. This works so 
long as there is only one loaded schema with that `$id`. 

A better solution for dynamic nested schema would be to use `$dynamicRef`. However, a [longstanding bug](https://github.com/ajv-validator/ajv/issues/1573) 
with `$dynamicRef` in Ajv prevents this.  

