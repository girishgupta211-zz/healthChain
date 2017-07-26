'use strict'


var express = require('express'),
	router = express.Router(),
	controller = require('./api.controller');
router.post('/registerPatient', controller.registerPatient);
router.post('/getPatinetDetails', controller.getPatinetDetails);
router.post('/getTransactionReceipt', controller.getTransactionReceipt);
router.post('/logData', controller.logData);
router.post('/addPrescription', controller.addPrescription);
router.post('/getPatients', controller.getPatients);
router.post('/countPatients', controller.countPatients);
router.post('/getSchedule', controller.getSchedule);
router.post('/getPrescriptionLogs', controller.getPrescriptionLogs);

module.exports = router;
