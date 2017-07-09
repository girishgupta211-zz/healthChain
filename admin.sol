pragma solidity ^0.4.11;


	contract Patient
	{
		struct patient
		{
			bytes32 name;
			bytes32 p_address;
			uint dob;
			bytes32 blood_grp;
			bytes32 phnum;
		}

		patient public p;
		function Patient(bytes32 name, bytes32 p_address, uint dob, bytes32 blood_grp, bytes32 phnum)
		{
		  p.name = name;
		  p.p_address = p_address;
		  p.dob = dob;
		  p.blood_grp = blood_grp;
		  p.phnum=phnum;
		}

		function getName() constant returns (bytes32 name)
		{
			return p.name;
		}

		function getaddress() constant returns (bytes32 add)
		{
			return p.p_address;
		}

		function getdob() constant returns (uint dob)
		{
			return p.dob;
		}

		function getbloodgrp() constant returns (bytes32 blood_grp)
		{
			return p.blood_grp;
		}

		function getphnum() constant returns (bytes32 phnum)
		{
			return p.phnum;
		}

		function addHealthData(uint bpm, uint bp, bytes32 spo2)
		{
		 logEvent(bpm, bp, spo2);
		}
		event logEvent(uint bpm, uint bp, bytes32 spo2);
	}

	contract admin
	{
		mapping (address => bool) public patients;
		address public Admin;
		address[] public patientsAddr;

		function admin()
		{
			Admin = msg.sender;
		}

		modifier adminOnly
		{
			if (Admin != msg.sender) throw;
			_;
		}

//		function () payable
//		{
//
//		}

	 function registerPatient (bytes32 name, bytes32 p_address, uint dob, bytes32 blood_grp, bytes32 phnum) adminOnly
		{
		  address patientContract = new Patient(name, p_address, dob, blood_grp, phnum);
		  patientsAddr.push(patientContract);
		  patients[patientContract] = true;
		  log(patientContract, "New Patient Registered");
		}

		function  getFirstPatietAddress() constant returns (address addr){
			return patientsAddr[0];
		}

		event log(address id, bytes32 desc);
	}

  // How to generate ABI https://ethereum.github.io/browser-solidity/
  // [{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"name","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getaddress","outputs":[{"name":"add","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getbloodgrp","outputs":[{"name":"blood_grp","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"name","type":"bytes32"},{"name":"p_address","type":"bytes32"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"bytes32"},{"name":"phnum","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bpm","type":"uint256"},{"name":"bp","type":"uint256"},{"name":"spo2","type":"bytes32"}],"name":"addHealthData","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdob","outputs":[{"name":"dob","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getphnum","outputs":[{"name":"phnum","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"bytes32"},{"name":"p_address","type":"bytes32"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"bytes32"},{"name":"phnum","type":"bytes32"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bpm","type":"uint256"},{"indexed":false,"name":"bp","type":"uint256"},{"indexed":false,"name":"spo2","type":"bytes32"}],"name":"logEvent","type":"event"}]
