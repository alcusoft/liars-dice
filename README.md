# Liar's Dice

## Getting Started

Before running any NPM scripts, ensure that you have Node.js and NPM installed
on your machine. You can install them by following the instructions on the
[Node.js official website](https://nodejs.org/en).

## Available Scripts

`npm run install`

Install all project dependencies. Run this command before doing anything else
with the project to ensure all required packages are available.

`npm run install:<PACKAGE_NAME>`

Install the dependencies for a specific package.

`npm run remove:<PACKAGE_NAME>`

Remove a dependency from a specific package.

`npm run dev:<PACKAGE_NAME>`

Start a package in development mode. Each package is configured with hot
reloading so changes are automatically reflected while a package is running.

`npm run start:<PACKAGE_NAME>`

Start a package in production mode. This script will only work if
`npm run build:<PACKAGE_NAME>` was run beforehand.

`npm run build:<PACKAGE_NAME>`

Create a production-ready build of a package.

`npm run test`

Execute all project tests.

`npm run test:<PACKAGE_NAME>`

Execute the tests for a specific package.

`npm run lint`

Check the project for code style violations and potential errors.

`npm run lint:<PACKAGE_NAME>`

Check a specific package for code style violations and potential errors.

`npm run format`

Format the project code.
