const app = require("./app.js");

app.listen(8080, (error) => {
    if(error){
        console.log(error)
    } else {
        console.log("Listening on port 8080")
    }
})