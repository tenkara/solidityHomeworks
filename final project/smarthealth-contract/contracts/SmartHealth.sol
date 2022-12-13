// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/// @title Blockchain based EHRs
contract SmartHealth {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct PatientSummary {
        bytes32 name; // patient name
        bytes32 age; // patient age
        bytes32 birthSex; // sex assigned at birth
        bytes32 weight; // weight in pounds
        bytes32 height;
    }

    struct PatientVitals {
        bytes32 heartRate; // ex 75 bpm
        bytes32 bloodPressure; // ex: 12/80 mm Hg
        bytes32 oxygenSat; //ex: 98%
        bytes32 temperature; //ex: 99.5 F
    }

    struct ProviderData {
        bytes32 hcpName;
        bytes32 infoToAuth;
        bytes32 reason;
        bool authorised;
    }

    //the patient's address
    address patientAddress;
    //authorized healthcare provider address
    address[] hcpAddresses;

    //structs to return
    PatientSummary patient;
    PatientVitals vitals;
    mapping(address => ProviderData) hcpData;

    // Create a new ehr with the patient and vitals information.
    //solidity only allows one constructor, so using the below as it matches the screen
    //send data in the order seen below
    constructor(bytes32[] memory patientInfo) {
        patientAddress = msg.sender;
        
        // For each of the provided data points,
        // create a new PatientData object.
        //Data must be sent in the correct order to populate correctly
        patient.name = patientInfo[0];
        patient.age = patientInfo[1];
        patient.birthSex = patientInfo[2];
        patient.weight = patientInfo[3];
        patient.height = patientInfo[4];
        vitals.heartRate = patientInfo[5];
        vitals.bloodPressure = patientInfo[6];
        vitals.oxygenSat = patientInfo[7];
        vitals.temperature = patientInfo[8];
    }

    //patient can authorize a provider
    function authorizeProvider(
        bytes32 hcpName,
        bytes32 infoToAuth,
        bytes32 reason,
        address hcpAddress
    ) public isPatient {
        require(patientAddress != hcpAddress, "Cannot authorise own address");
        hcpData[hcpAddress].hcpName = hcpName;
        hcpData[hcpAddress].infoToAuth = infoToAuth;
        hcpData[hcpAddress].reason = reason;
        hcpData[hcpAddress].authorised = true;
    }

    //allow patient to view their data
    function getPatientSummary()
        public
        view
        isPatient
        returns (PatientSummary memory)
    {
        return patient;
    }

    function getPatientVitals()
        public
        view
        isPatient
        returns (PatientVitals memory)
    {
        return vitals;
    }

    function getHCPDetails(address hcpAddress)
        public
        view
        returns (ProviderData memory)
    {
        return hcpData[hcpAddress];
    }

    //allow hcp tp view data
    //send data as hcpName
    //leaving as array to handle more complicated requests later
    function getPatientVitalsHCP(address hcpAddress)
        public
        view
        isAuthorized(hcpAddress)
        returns (PatientVitals memory)
    {
        return vitals;
    }

    function getPatientSummaryHCP(address hcpAddress)
        public
        view
        isAuthorized(hcpAddress)
        returns (PatientSummary memory)
    {
        return patient;
    }

    modifier isPatient() {
        require(msg.sender == patientAddress);
        _;
    }

    modifier isAuthorized(address hcpAddress) {
        //this is assuming one hcp for iteration one and assuming they have access to vitals and summary
        require(hcpData[hcpAddress].authorised == true, "Not authorised");
        _;
    }
}