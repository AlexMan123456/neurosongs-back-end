const app = require("./app.js");

const port = process.env.PORT ?? "8080";

app.listen(parseInt(port), (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Listening on port ${port}`);
  }
});
