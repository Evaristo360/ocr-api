const CallsService = require('../services/calls.service');
const callsService = new CallsService();

const twilio = require('twilio');
const path = require('path');
const querystring = require('querystring');

// Configuración de Twilio
const accountSid = 'ACCOUNTSID';
const authToken = 'TOKENAUTH';
const client = new twilio(accountSid, authToken);

const call = async (req, res) => {
  try {
    let cellphones = await callsService.findCellphonesWithNullStatus();
    cellphones.map(async (cellphone) => {
      let to = cellphone.dataValues;
      delete to.id
      if (isValidDigitString(to.cellphone)) {
        to.status = 'initiated'
        console.log("Marcando....", to.cellphone)
        const call = await client.calls.create({
          url: 'https://api-host/api/v1/calls/answer',
          to: '+52' + to.cellphone,
          from: '+525555555555', // Número de teléfono de Twilio
          statusCallback: 'https://api-host/api/v1/calls/status',
          statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
          timeout: 20, // Tiempo de espera en segundos antes de colgar
        });

        to.sid = call.sid;
        await callsService.updateByCellphone(to.cellphone, to);
      } else {
        console.log('VALIDATION - NUMBER ' + to.cellphone + 'IS NOT VALID')
        to.status = 'NO-VALID'
        await callsService.updateByCellphone(to.cellphone, to);
      }
    })

    console.log(new Date().toLocaleString(), " - Números marcados" + cellphones.join(', '));
    res.status(200).send("Números marcados" + cellphones.join(', '));
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
      moreInfo: error.moreInfo || 'https://www.twilio.com/docs/errors'
    });
  }
};

const answer = async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.play('https://api-host/api/v1/calls/audio');
  twiml.hangup(); // Termina la llamada después de reproducir el audio
  console.log("Respuesta", twiml.toString());
  res.type('text/xml');
  res.send(twiml.toString());
};

const getAudio = async (req, res) => {
  const audioPath = path.join(__dirname, '..', 'assets', 'callAudio.mp3');
  res.sendFile(audioPath);
};

const updateCallStatus = async (req, res) => {
  const { CallSid, CallStatus } = req.body;

  if (!CallSid) {
    return res.status(400).send({ status: 'error', message: 'CallSid is required' });
  }

  try {
    await callsService.updateStatus(CallSid, { status: CallStatus });
    console.log('Call status updated', CallSid, CallStatus);
    res.status(200).send({ status: 'success', message: 'Call status updated successfully' });
  } catch (error) {
    console.log('Error updating call status', {
      status: 500,
      message: error.message
    });
    res.status(500).send({
      status: 500,
      message: error.message,
      moreInfo: error.moreInfo || 'https://www.twilio.com/docs/errors'
    });
  }
};

const isValidDigitString = (str) => {
  return /^\d{10}$/.test(str);
}

module.exports = { call, answer, getAudio, updateCallStatus };