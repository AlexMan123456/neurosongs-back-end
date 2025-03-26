const seed = require("./seed");

const ENV = process.env.NODE_ENV ?? "development"
const data = require(ENV === "test" ? "./test-data" : "./dev-data");

function runSeed(){
    return seed(data)
}

runSeed()