'use strict';

// Bluebird is the best promise library available today,
// and is the one recommended here:
const promise = require('bluebird');

// Loading all the database repositories separately,
// because event 'extend' is called multiple times:
const repos = {
    users: require('./repos/users'),
    products: require('./repos/products')
};

// pg-promise initialization options:
const initOptions = {

    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend: (obj, dc) => {
        // Database Context (dc) is only needed for extending multiple databases
        // with different access API.

        // Do not use 'require()' here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.users = new repos.users(obj, pgp);
        obj.products = new repos.products(obj, pgp);

        // Alternatively, you can set all repositories in a loop:
        //
        // for (let r in repos) {
        //    obj[r] = new repos[r](obj, pgp);
        // }
    }

};

// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'pg-promise-demo',
    user: 'postgres'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

// Load and initialize optional diagnostics:
const diagnostics = require('./diagnostics');
diagnostics.init(initOptions);

// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
module.exports = db;
