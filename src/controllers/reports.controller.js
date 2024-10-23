const PDFFilesService = require('../services/pdfFiles.service');
const DeliveredService = require('../services/delivered.service');
const SectionsService = require('../services/sections.service');
const SupportersFinalService = require('../services/supportersFinal.service');
const CallcenterService = require('../services/callcenter.service');
const pdfFilesService = new PDFFilesService();
const deliveredService = new DeliveredService();
const sectionsService = new SectionsService();
const supportersFinalService = new SupportersFinalService();
const callcenterService = new CallcenterService();

const { config } = require('../config/config');

const XLSX = require('xlsx');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: config.HOST_SMTP,
  port: config.PORT_SMTP,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: config.AUTH_SMTP,
    pass: config.PASS_SMTP
  }
});

const generateEmailOptions = (currentDate, workbook, email) => {
  const subject = `Reporte hasta el día ${currentDate.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`;

  const attachment = {
    filename: 'Reporte_Comites.xlsx',
    content: XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
  };

  return {
    from: config.AUTH_SMTP,
    to: email,
    subject,
    text: subject,
    attachments: [attachment]
  };
}

const downloadGeneral = async (req, res) => {
  const { email } = req.params;

  //GET ALL DATA
  const currentDate = new Date().toLocaleDateString()
  const arrayCurrentDate = currentDate.split("/")
  let dateRequired = new Date(arrayCurrentDate[2], arrayCurrentDate[1] - 1, arrayCurrentDate[0] - 1);

  let totalReceivedPhysical = await deliveredService.getTotalDelivered(dateRequired);
  let totalPDFDigitalized = await pdfFilesService.findAllDigitalized();
  let totalPersonsDigitalized = await supportersFinalService.getTotal();
  let totalProcessed = await pdfFilesService.getTotalSaved(dateRequired);

  let listaComites = await sectionsService.findByDate(dateRequired)
  let listaGroupComites = await sectionsService.findByDateGroup(dateRequired)
  let arrayReceivedAndDelivered = await sectionsService.findReceivedAndDelivered(dateRequired);
  //CAll center Data
  let resumeTotal = await supportersFinalService.getResumeTable();
  let resumeTotalByDate = await supportersFinalService.getResumeTableByDate(dateRequired);
  let questionResumeTotal = await callcenterService.getResumeTable();
  let questionResumeTotalByDate = await callcenterService.getResumeTableByDate(dateRequired);
  let resumeCallcenter = await sectionsService.getResumeCallcenter();

  const fechaActual = new Date();
  const horaCdmx = fechaActual.toLocaleTimeString('es-MX');
  const reportData = {
    totalReportesRecibidosFisicamente: totalReceivedPhysical[0],
    totalReportesDigitalizados: totalPDFDigitalized[0],
    totalPersonasComitesDigitalizados: totalPersonsDigitalized[0],
    totalProcessed: totalProcessed[0],
    listaComites: listaComites[0],
    listaGroupComites: listaGroupComites[0],
    listaDT: arrayReceivedAndDelivered[0],
  };

  const reportCallCenter = {
    resumeTotal: resumeTotal[0],
    resumeTotalByDate: resumeTotalByDate[0],
    questionResumeTotal: questionResumeTotal[0],
    questionResumeTotalByDate: questionResumeTotalByDate[0],
    resumeCallCenter: resumeCallcenter[0]
  };

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);

  // Add report headers
  const data = [
    [`${fechaActual.toLocaleDateString()} ${horaCdmx}`, '', ''],
    ['Total de reportes recibidos físicamente:', reportData.totalReportesRecibidosFisicamente[0].total, ''],
    ['Total de reportes digitalizados:', reportData.totalReportesDigitalizados[0].totaldigitalized, ''],
    ['Total de personas que integran comités digitalizados:', reportData.totalPersonasComitesDigitalizados[0].total, ''],
    ['Total de reportes procesados:', reportData.totalProcessed[0].total, ''],
    ['', '', ''], // empty row for separation
    ['DT', 'Nombre', 'Sección', 'Comites', 'Personas'], // table header
  ];

  let totalComites = 0;
  let totalPersonas = 0;
  reportData.listaComites.forEach((comite) => {
    data.push([comite.dt, comite.name, comite.section, parseInt(comite.comites), parseInt(comite.personas)]);

    if (comite.personas != null) {
      totalPersonas = totalPersonas + parseInt(comite.personas);
    }
    if (comite.comites != null) {
      totalComites = totalComites + parseInt(comite.comites);
    }
  });
  data.push(['', '', 'Total', totalComites, totalPersonas]);//Add total


  // Add new table with DT, NOMBRE, COMITES
  const tableReceivedDelivered = [];
  tableReceivedDelivered.push(['DT', 'Nombre', 'Entregados', 'Recibidos']); // empty row for separation

  let totalRecibidos = 0;
  let totalEntregados = 0;
  reportData.listaDT.forEach((dt) => {
    tableReceivedDelivered.push([dt.dt, dt.name, parseInt(dt.deliver) || '', parseInt(dt.receiver) || '']);

    if (dt.deliver != null) {
      totalEntregados = totalEntregados + parseInt(dt.deliver);
    }
    if (dt.receiver != null) {
      totalRecibidos = totalRecibidos + parseInt(dt.receiver);
    }
  });
  tableReceivedDelivered.push(['', 'Total', totalEntregados, totalRecibidos])//Add total


  // Add new table with DT, NOMBRE, COMITES
  const tableGroupComites = [];
  tableGroupComites.push(['DT', 'Nombre', 'Comites', '']);

  let totalResumeComites = 0;
  reportData.listaGroupComites.forEach((comite) => {
    tableGroupComites.push([comite.dt, comite.name, parseInt(comite.comites)]);
    if (comite.comites != null) {
      totalResumeComites = totalResumeComites + parseInt(comite.comites);
    }
  });
  tableGroupComites.push(['', 'Total', totalResumeComites])//Add total

  XLSX.utils.sheet_add_aoa(worksheet, tableGroupComites, { origin: "H7" });

  XLSX.utils.sheet_add_aoa(worksheet, tableReceivedDelivered, { origin: "M7" });

  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 0 });


  //Call center
  const worksheetCC = XLSX.utils.json_to_sheet([]);
  const dataCC = [
    [`Total Historico`, parseInt(reportCallCenter.resumeTotal[0].total), ''],
    ['Total Hoy', parseInt(reportCallCenter.resumeTotalByDate[0].total), ''],
    ['Repetido Historico', parseInt(reportCallCenter.resumeTotal[0].repetidos), ''],
    ['Repetido Hoy', parseInt(reportCallCenter.resumeTotalByDate[0].repetidos), ''],
    ['No existe Historico', parseInt(reportCallCenter.resumeTotal[0].noexiste), ''],
    ['No existe Hoy', parseInt(reportCallCenter.resumeTotalByDate[0].noexiste), ''],
    ['No contesto Historico', parseInt(reportCallCenter.resumeTotal[0].nocontestaron), ''],
    ['No contesto Hoy', parseInt(reportCallCenter.resumeTotalByDate[0].nocontestaron), ''],
    ['Si contesto Historico', parseInt(reportCallCenter.resumeTotal[0].contestaron), ''],
    ['Si contesto Hoy', parseInt(reportCallCenter.resumeTotalByDate[0].contestaron), ''],
    ['Si es la persona Historico', Math.round((reportCallCenter.questionResumeTotal[0].q1 * 100) / reportCallCenter.questionResumeTotal[0].total) + "%", ''],
    ['Si es la persona Hoy', Math.round((reportCallCenter.questionResumeTotalByDate[0].q1 * 100) / reportCallCenter.questionResumeTotalByDate[0].total) + "%", ''],
    ['Si es parte de un comite Historico', Math.round((reportCallCenter.questionResumeTotal[0].q2 * 100) / reportCallCenter.questionResumeTotal[0].total) + "%", ''],
    ['Si es parte de un comite Hoy', Math.round((reportCallCenter.questionResumeTotalByDate[0].q2 * 100) / reportCallCenter.questionResumeTotalByDate[0].total) + "%", ''],
    ['Si quiere whatsapp Historico', Math.round((reportCallCenter.questionResumeTotal[0].q3 * 100) / reportCallCenter.questionResumeTotal[0].total) + "%", ''],
    ['Si quiere whatsapp Hoy', Math.round((reportCallCenter.questionResumeTotalByDate[0].q3 * 100) / reportCallCenter.questionResumeTotalByDate[0].total) + "%", ''],
    ['', '', ''], // empty row for separation
    ['DT', 'Nombre', '% si contesto', '% no contesto', '% no existe', '% repetidos']
  ];

  reportCallCenter.resumeCallCenter.forEach((cc) => {
    dataCC.push([
      cc.dt,
      cc.name,
      (Math.round((cc.contestaron * 100) / cc.total) || '0') + "%",
      (Math.round((cc.noexiste * 100) / cc.total) || '0') + "%",
      (Math.round((cc.nocontestaron * 100) / cc.total) || '0') + "%",
      (Math.round((cc.repetidos * 100) / cc.total) || '0') + "%",
    ]);
  });

  XLSX.utils.sheet_add_aoa(worksheetCC, dataCC, { origin: 0 });


  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Comités');
  XLSX.utils.book_append_sheet(workbook, worksheetCC, 'Callcenter');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Send the email using the generated options
  // transporter.sendMail(generateEmailOptions(fechaActual, workbook, email), (error, info) => {
  //   if (error) {
  //     res.send("No se pudo enviar el correo: " + error)
  //     console.error(error);
  //   } else {
  //     res.send('Email sent: ' + info.response)
  //   }
  // });
  res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Comites.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(excelBuffer);
};

module.exports = {
  downloadGeneral,
};