pragma solidity ^0.4.11;


    contract Patient
    {
        struct patient
        {
            string name;
            string p_address;
            uint dob;
            string blood_grp;
            string phnum;
        }

        patient public p;
        function Patient(string name, string p_address, uint dob, string blood_grp, string phnum)
        {
          p.name = name;
          p.p_address = p_address;
          p.dob = dob;
          p.blood_grp = blood_grp;
          p.phnum=phnum;
        }

        function getName() constant returns (string name)
        {
            return p.name;
        }

        function getaddress() constant returns (string add)
        {
            return p.p_address;
        }

        function getdob() constant returns (uint dob)
        {
            return p.dob;
        }

        function getbloodgrp() constant returns (string blood_grp)
        {
            return p.blood_grp;
        }

        function getphnum() constant returns (string phnum)
        {
            return p.phnum;
        }

        function addHealthData(uint bpm, uint bp, string spo2)
        {
         logEvent(bpm, bp, spo2);
        }
        event logEvent(uint bpm, uint bp, string spo2);
    }

    contract admin
    {
        mapping (address => bool) public patients;
        address public Admin;
        address[] public patientsAddr;
        mapping (address =>mapping (uint => string)) public records;

        function admin()
        {
            Admin = msg.sender;
        }

        modifier adminOnly
        {
            if (Admin != msg.sender) throw;
            _;
        }

//        function () payable
//        {
//
//        }

     function registerPatient (string name, string p_address, uint dob, string blood_grp, string phnum) adminOnly
        {
          address patientContract = new Patient(name, p_address, dob, blood_grp, phnum);
          patientsAddr.push(patientContract);
          patients[patientContract] = true;
          log(patientContract, "New Patient Registered");
        }

        function  getFirstPatietAddress() constant returns (address addr){
            return patientsAddr[0];
        }

        function addRecords(address id, uint day, string data)
        {
         if (!patients[id])
         {
                 throw;
         }
         else
         {
                records[id][day] = data;
                log(id, data);
         }
        }

        event log(address id, string desc);
    }

  // How to generate ABI https://ethereum.github.io/browser-solidity/
  // [{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"name","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getaddress","outputs":[{"name":"add","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getbloodgrp","outputs":[{"name":"blood_grp","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"name","type":"bytes32"},{"name":"p_address","type":"bytes32"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"bytes32"},{"name":"phnum","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bpm","type":"uint256"},{"name":"bp","type":"uint256"},{"name":"spo2","type":"bytes32"}],"name":"addHealthData","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdob","outputs":[{"name":"dob","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getphnum","outputs":[{"name":"phnum","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"name","type":"bytes32"},{"name":"p_address","type":"bytes32"},{"name":"dob","type":"uint256"},{"name":"blood_grp","type":"bytes32"},{"name":"phnum","type":"bytes32"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bpm","type":"uint256"},{"indexed":false,"name":"bp","type":"uint256"},{"indexed":false,"name":"spo2","type":"bytes32"}],"name":"logEvent","type":"event"}]
