const express = require("express");

const app = express();

// parse requests of content-type - application/json
app.use(express.json({limit:'50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit:'50mb' }));

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");

db.mongoose
.connect(`mongodb+srv://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});
 
//cors
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,UserAgent,X-Requested-With,Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,POST');
 
  next();
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/device.routes')(app);
require('./app/routes/assets.routes')(app);
require('./app/routes/usercar.routes')(app);
require('./app/routes/services.routes')(app);

//other initial things
const readXlsxFile = require('read-excel-file/node')

readXlsxFile('./assets/PARCEIROSAPP.xlsx').then((rows) => {
  const NodeGeocoder = require('node-geocoder');
  const db = require("./app/models");
  const ServicePartner = db.servicePartner;

  const geocoder = NodeGeocoder({
    provider: 'google',
    apiKey: 'API KEY GEOCODE', // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  });

  if(rows){
    rows.forEach(row => {
      let nome = row[0];
      let endereco = row[1];
      let cep = row[2];
      let bairro = row[3];
      let cidade = row[4];
      let telefone = row[5];
      let categoria = row[6];
      let coord = null;
      let mapAddr = null;

      if(nome != 'NOME'){
        ServicePartner.findOne({name: nome})
        .then((sp) => {
          if(sp){
            console.log(`Parceiro ${sp.name} já foi cadastrado anteriormente!`);
          } else {
            let addrSearch = `${endereco}, ${cidade}`;

            console.log(`Consultando endereço de parceiro ${nome} (${addrSearch})...`);

            geocoder.geocode(addrSearch)
            .then((res) => {  
              console.log(res);

              if(res && res[0] && res[0].latitude && res[0].longitude){
                coord = {latitude: res[0].latitude, longitude: res[0].longitude};
                mapAddr = res[0].formattedAddress;
              }
      
              const servicePartner = new ServicePartner({
                name: nome,
                address: endereco,
                zipcode: cep,
                nbh: bairro,
                phone: telefone,
                cat: categoria,
                coordinates: coord && coord != null ? JSON.stringify(coord) : null,
                mapAddr: mapAddr && mapAddr != null ? mapAddr : null
              });
      
              servicePartner.save().then((sp) => {
                console.log(`Parceiro ${sp.name} cadastrado!`);
              })
              .catch((err) => {
                console.log("Erro ao tentar salvar parceiros");
                console.log(err);
              });
            })
            .catch((err) => console.log(err));
          }
        }).catch((err) => console.log(err))
      }
    });
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});