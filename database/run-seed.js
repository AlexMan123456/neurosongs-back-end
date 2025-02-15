const seed = require("./seed");
const data = require("./test-data");

function runSeed(){
    return seed(data)
}

runSeed()