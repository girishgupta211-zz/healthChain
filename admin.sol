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
        
        struct medicineStatus{
            string medicineName;
            uint time;
            bool status;
        }
        
        medicineStatus[] public medStatus; 
        
        
        
        

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
        
        function storeMedicineStatus(string medicineName, uint time,  bool status){
            medicineStatus memory  m;
            m.medicineName = medicineName;
            m.time = time;
            m.status = status;
            medStatus.push(m);
        }
        
        /*function getMedicineStatusLogs() constant returns(medStatus){
            return medStatus;
        }*/
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

 