
const { config } = require('../config/config');
const cos = require('../libs/cos');
const { STATUS_EDITING } = require('../enum/statusEnum');

const PDFFilesService = require('../services/pdfFiles.service');
const HistoryService = require('../services/history.service');
const ProcessedPDFService = require('../services/processedPDF.service');
const CommitteesService = require('../services/committees.service');
const SupportersService = require('../services/supporters.service');
const InstallationMinutesService = require('../services/installationMinutes.service');

const pdfFilesService = new PDFFilesService();
const historyService = new HistoryService();
const processedPDFService = new ProcessedPDFService();
const committeesService = new CommitteesService();
const supportersService = new SupportersService();
const installationMinutesService = new InstallationMinutesService();

const { TextractClient, GetDocumentAnalysisCommand } = require('@aws-sdk/client-textract');
const paramsClient = {
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccess,
  }
}

const textractClient = new TextractClient(paramsClient);

const fieldCabecera = [{
  jsonKey: "fechaEncabezado",
  queryKey: "Fecha"
},
  {
    jsonKey: "entidadEncabezado",
    queryKey: "Entidad"
  },
  {
    jsonKey: "municipioEncabezado",
    queryKey: "Municipio o Alcaldía"
  },
  {
    jsonKey: "seccion",
    queryKey: "Seccion Electoral"
  },
  {
    jsonKey: "folio",
    queryKey: "Folio"
  }
]

const fieldsSupport = [
  {
    jsonKey: "paterno",
    queryKey: "Paterno"
  },
  {
    jsonKey: "materno",
    queryKey: "Materno"
  },
  {
    jsonKey: "nombre",
    queryKey: "Nombre"
  },
  {
    jsonKey: "domicilio",
    queryKey: "Domicilio"
  },
  {
    jsonKey: "colonia",
    queryKey: "Colonia"
  },
  {
    jsonKey: "municipio",
    queryKey: "Municipio o Alcaldía"
  },
  {
    jsonKey: "entidad",
    queryKey: "Entidad"
  },
  {
    jsonKey: "cp",
    queryKey: "CP"
  },
  {
    jsonKey: "claveElector",
    queryKey: "Clave de elector"
  },
  {
    jsonKey: "telefono",
    queryKey: "Telefono con lada"
  },
  {
    jsonKey: "curp",
    queryKey: "Jovenes 15, 16 y 17 / CURP"
  },
  {
    jsonKey: "whatsapp",
    queryKey: "Whatsapp"
  },
  {
    jsonKey: "celular",
    queryKey: "Celular"
  },
  {
    jsonKey: "correoElectronico",
    queryKey: "Correo Electronico"
  },
  {
    jsonKey: "facebook",
    queryKey: "Facebook"
  },
];

const fieldActa = [{
  jsonKey: "hora",
  queryKey: "Siendo las"
},
{
  jsonKey: "dia",
  queryKey: "horas del día"
},
{
  jsonKey: "mes",
  queryKey: "del mes de"
},
{
  jsonKey: "anio",
  queryKey: "del año"
},
{
  jsonKey: "municipioActa",
  queryKey: "en el Municipio o Alcaldía de"
},
{
  jsonKey: "entidadActa",
  queryKey: "en el Estado de"
}
]


const sleep = (milisegundos) => {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
}

const getDocumentAnalysis = async (jobId, nextToken) => {
  let params = {
    JobId: jobId
  };

  if (nextToken != "") {
    params['NextToken'] = nextToken;
  }

  const getAnalyzeCommand = new GetDocumentAnalysisCommand(params);
  const responseGet = await textractClient.send(getAnalyzeCommand);

  if (responseGet.JobStatus === "SUCCEEDED") {
    const { Blocks, NextToken } = responseGet;

    let totalBlocks = [];
    if (NextToken) {
      let analysisBlock = await getDocumentAnalysis(jobId, NextToken);
      totalBlocks = analysisBlock;
    }

    return Blocks.concat(totalBlocks);
  } else {
    await sleep(2000);
    return await getDocumentAnalysis(jobId, nextToken)
  }
}

const getFolio = (Blocks) => {
  const folioRegex = /^\d{5}$/;
  let filter = Blocks.filter(block => block.TextType == "PRINTED" && folioRegex.test(block.Text))

  if (filter.length > 0) {
    return filter[0].Text
  } else {
    return ""
  }
}

function getCP(cp) {
  const regex = /\b\d{5}\b/;
  const match = cp.match(regex);
  return match ? match[0] : '62';
}

const validateApellido = (paterno) => {
  const pattern = paterno.split(" ");
  return pattern ? pattern[0] : '';
};

const validateFieldFacebook = (text) => {
  let defaultValue = "facebook";
  if (text.toUpperCase().includes(defaultValue.toUpperCase())) {
    return "";
  } else {
    return text;
  }
}

const obtenerKeyValueSets = (Blocks) => {
  const keyArray = [];
  const valueArray = [];

  let pages = [1, 2]
  pages.map(page => {
    const keyValueSets = Blocks.filter(block => block.BlockType === 'KEY_VALUE_SET' && block.Page == page);

    // Ordenar los KeyValueSets en función de su posición de lectura
    keyValueSets.sort((a, b) => a.Geometry.BoundingBox.Top - b.Geometry.BoundingBox.Top);

    // Iterar sobre cada KeyValueSet
    keyValueSets.forEach((keyValueSet, index) => {
      if (keyValueSet.Relationships) {
        let keyObject = "";
        let valueObject = "";

        // Iterar sobre las relaciones del KeyValueSet
        keyValueSet.Relationships.forEach(relationship => {
          if (relationship.Type === 'CHILD') {
            // Filtrar los bloques relacionados por sus Ids
            const childBlocks = Blocks.filter(x => relationship.Ids.includes(x.Id));

            // Obtener el texto de cada bloque relacionado y asignarlo al objeto keyObject
            let textChild = childBlocks.map(childBlock => childBlock.Text);
            keyObject = textChild.join(" ");
          } else {
            // Filtrar los bloques relacionados por sus Ids
            const valueBlocks = Blocks.filter(x => relationship.Ids.includes(x.Id));
            valueBlocks.forEach(valueBlock => {
              // Filtrar los bloques relacionados por sus Ids
              if (valueBlock.Relationships) {
                const valueBlocks1 = Blocks.filter(x => valueBlock.Relationships[0].Ids.includes(x.Id));

                // Obtener el texto de cada bloque relacionado y asignarlo al objeto valueObject
                let textValue1 = valueBlocks1.map(valueBlock1 => valueBlock1.Text);
                valueObject = textValue1.join(" ");
              }
            });
          }
        });

        // Agregar la cadena al arreglo
        keyArray.push(keyObject);
        valueArray.push(valueObject);
      }
    });

  })

  return {
    keys: keyArray,
    values: valueArray
  }
}

const proccessBlocks = (Blocks) => {
  let { keys, values } = obtenerKeyValueSets(Blocks)

  let finalJSON = {}
  fieldCabecera.forEach((field) => {
    let i = 0;
    let found = false
    keys.forEach((key, index) => {
      if (!found) {
        if (key.toUpperCase() === field.queryKey.toUpperCase()) {
          finalJSON[`${field.jsonKey}`] = values[index]
          i++;
          found = true
        }
      }
    })
  })

  fieldActa.forEach((field) => {
    let i = 0;
    let found = false
    keys.forEach((key, index) => {
      if (!found) {
        if (key.toUpperCase() === field.queryKey.toUpperCase()) {
          finalJSON[`${field.jsonKey}`] = values[index]
          i++;
          found = true
        }
      }
    })
  })

  let i = 0;
  let auxKeys = keys.slice();
  let auxValues = values.slice();
  let auxFields = [];

  while (i < 10) {
    keys = auxKeys.slice()
    values = auxValues.slice()

    fieldsSupport.map(field => {
      finalJSON[`${field.jsonKey}${i}`] = "";
    })

    //Toma como seprador entre formularios el campo FACEBOOK
    let indexFacebook = keys.findIndex(key => key.includes('FACEBOOK'))
    let currentKeys = keys.slice(0, indexFacebook == -1 ? indexFacebook : indexFacebook + 1);
    let currentValues = values.slice(0, indexFacebook == -1 ? indexFacebook : indexFacebook + 1);

    fieldsSupport.forEach((field) => {
      currentKeys.forEach((key, index) => {
        if (key.toUpperCase() === field.queryKey.toUpperCase()) {

          let value = currentValues[index];
          //Validate
          switch (field.queryKey) {
            case "Paterno":
              value = validateApellido(value)
              break;
            case "Materno":
              value = validateApellido(value)
              break;
            case "Facebook":
              value = validateFieldFacebook(value);
              break;
            case "Entidad":
              //Valida si el valor de entidad contiene un posible CP
              let isCP = getCP(value)
              if (isCP != '') {
                auxFields.push({ key: `cp${i}`, value: isCP });
                value = value.replace(isCP, '').trim();
              }
              break;
            case "CP":
              value = getCP(value);
              break;
          }

          finalJSON[`${field.jsonKey}${i}`] = value

        }
      })
    })

    auxKeys = keys.slice(indexFacebook + 1, keys.length - 1);
    auxValues = values.slice(indexFacebook + 1, values.length - 1);
    i = i + 1;
  }

  //assign Folio
  finalJSON['folio'] = getFolio(Blocks);

  //check if cp assign to Entidad Field
  auxFields.forEach(x => {
    if (finalJSON[x.key] != undefined) {
      finalJSON[x.key] = x.value
    }
  })

  //Se asigna Morelos por Default a Entidad
  for (let i = 0; i < 10; i++) {
    finalJSON['entidad' + i] = "Morelos";
    finalJSON['municipio' + i] = "";
  }
  finalJSON.entidadEncabezado = "Morelos";
  finalJSON.municipioEncabezado = "";

  finalJSON.municipioActa = "";
  finalJSON.entidadActa = "Morelos";

  //Construir fechas, horas
  let today = new Date()

  // let fechaEncabezado = new Date(finalJSON.fechaEncabezado);

  // let horaActa = new Date();
  // let horaScan = finalJSON.hora.split(":");
  // horaActa.setHours(horaScan[0] || today.getHours())
  // horaActa.setMinutes(horaScan[1] || today.getMinutes())

  // let fechActa = new Date();
  // if (finalJSON.dia != "" && finalJSON.mes != "" && finalJSON.anio != "") {
  //   fechActa.setDate(finalJSON.dia)
  //   fechActa.setMonth(finalJSON.mes - 1)
  //   fechActa.setFullYear(finalJSON.anio)
  // }

  finalJSON['fechaActa'] = today//fechActa.toString() === "Invalid Date" ? today : fechActa
  finalJSON['horaActa'] = today//horaActa.toString() === "Invalid Date" ? today : horaActa
  finalJSON['fechaEncabezado'] = today//fechaEncabezado.toString() === "Invalid Date" ? today : fechaEncabezado

  return finalJSON
}

const getUrlSigned = async (filename) => {
  const params = {
    Bucket: config.bucketname,
    Key: filename,
    Expires: config.userTimeInactive * 60
  };

  return await cos.getSignedUrlPromise('getObject', params);
}

const getNextEditForm = async (id, username, t) => {
  let nextFile;
  if (id) {
    //Se busca por el id que ha procesado 
    nextFile = await pdfFilesService.findFileById(id)
  } else {
    //Obtenemos el archivo a editar
    //Archivo que este con un Estado Procesado o que su estado sea Editando y haya transcurrido mas de 15 min
    let dateFilter = new Date();
    dateFilter.setMinutes(dateFilter.getMinutes() - config.userTimeInactive);
    nextFile = await pdfFilesService.findFileToEdit(dateFilter);
  }

  if (!nextFile) {
    return null
  }

  let idPdfFile = nextFile.dataValues.id;

  let dataProccessed = {};

  //Revisamos si existe un commite asignado al archivo pdf
  let exitsCommittee = await committeesService.findOneByidPDFFile(idPdfFile);
  if (exitsCommittee) {
    let committee = exitsCommittee.dataValues;

    let installationData = await installationMinutesService.findOneByidCommittee(committee.id);
    let installation = installationData.dataValues;

    let jsonPartial = {
      "idCommittee": committee.id,
      "fechaEncabezado": committee.dateCommittee,
      "entidadEncabezado": committee.entity,
      "municipioEncabezado": committee.city,
      "seccion": committee.section,
      "folio": committee.folio,
      "idInstallation": installation.id,
      "horaActa": installation.dateMinute,
      "fechaActa": installation.dateMinute,
      "municipioActa": installation.state,
      "entidadActa": installation.entity
    }

    let supportersData = await supportersService.findAllByidCommittee(committee.id);
    supportersData.forEach((supportData, index) => {
      let support = supportData.dataValues;

      jsonPartial[`idSupporter${index}`] = support.id;
      jsonPartial[`paterno${index}`] = support.lastName;
      jsonPartial[`materno${index}`] = support.mothersLastname;
      jsonPartial[`nombre${index}`] = support.name;
      jsonPartial[`tipo${index}`] = support.type;
      jsonPartial[`domicilio${index}`] = support.address;
      jsonPartial[`colonia${index}`] = support.neighborhood;
      jsonPartial[`municipio${index}`] = support.city;
      jsonPartial[`entidad${index}`] = support.entity;
      jsonPartial[`cp${index}`] = support.zipCode;
      jsonPartial[`claveElector${index}`] = support.electorKey;
      jsonPartial[`telefono${index}`] = support.telephone;
      jsonPartial[`curp${index}`] = support.curp;
      jsonPartial[`celular${index}`] = support.cellphone;
      jsonPartial[`whatsapp${index}`] = support.whatsapp;
      jsonPartial[`correoElectronico${index}`] = support.email;
      jsonPartial[`facebook${index}`] = support.facebook;
      jsonPartial[`demarcacion:${index}`] = support.demarcacion;
      jsonPartial[`cond${index}`] = support.cond;
    })

    dataProccessed = jsonPartial;
  } else {
    //Se obtiene la información obtenida del OCR
    let processedData = await processedPDFService.findByIdPDFFile(idPdfFile);
    let dataProcess = processedData.dataValues;
    let dataOCR = await getDocumentAnalysis(dataProcess.dataS3, "");
    dataProccessed = proccessBlocks(dataOCR);
  }



  //Actualizamos el registro con estado  en Edición
  let pdfFileUpdate = nextFile.dataValues;
  pdfFileUpdate.idStatus = STATUS_EDITING;
  pdfFileUpdate.editDate = new Date();
  pdfFileUpdate.user = username;

  await pdfFilesService.update(idPdfFile, pdfFileUpdate, t)

  //Se llena la bitacora con el estado de  edición
  const historyBody = {
    idPDFFile: idPdfFile,
    idStatus: STATUS_EDITING,
    createdDate: new Date(),
    user: username,
    apiResponse: 200
  };

  await historyService.create(historyBody, t);


  let urlSignedFile = await getUrlSigned(nextFile.nameFile);

  let formBody = {
    idFile: nextFile.id,
    urlFile: urlSignedFile,
    data: dataProccessed
  }

  return formBody;
}

module.exports = {
  getUrlSigned,
  getNextEditForm
}