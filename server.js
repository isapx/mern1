const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

//mongodb+srv://isap:tay3isa4@cluster0-6clkf.mongodb.net/test?retryWrites=true&w=majority

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  //  .connect("mongodb+srv://isap:tay3isa4@cluster0-6clkf.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=> {
    console.log("Se conectó con exito a MongoDB");
    initial();
  })
  .catch(err => {
    console.error("Error de conexion", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("Se agregó el rol 'user' a la coleccion Roles");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("Se agrego el rol 'moderator' a la coleccion Roles");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("Se agrego el rol 'admin' a la coleccion Roles");
      });

    }
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenidos a mi aplicacion -isap" });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
  console.log(`Servidor ejecutandose en el puerto ${PORT}.`);
});
