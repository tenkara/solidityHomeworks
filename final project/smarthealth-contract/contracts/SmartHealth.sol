// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/// @title Blockchain based EHRs
contract SmartHealth {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct PatientSummary {
        bytes32 name; // patient name
        bytes32 age;  // patient age
        bytes32 birthSex; // sex assigned at birth
        bytes32 weight;   // weight in pounds
        bytes32 height;
    }

    struct PatientVitals{
        bytes32 heartRate;   // ex 75 bpm
        bytes32 bloodPressure; // ex: 12/80 mm Hg
        bytes32 oxygenSat; //ex: 98%
        bytes32 temperature; //ex: 99.5 F
        
    }

    struct ProviderData{
        bytes32 hcpName;
        bytes32 infoToAuth;
        bytes32 reason;
    }

    //the patient's address
    address patientAddress;
    //authorized healthcare provider address
    address healthCareProvider;

    //structs to return
    PatientSummary patient;
    PatientVitals vitals;
    ProviderData[] authorizedProviders;

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
        vitals.heartRate = patientInfo[4];
        vitals.bloodPressure = patientInfo[5];
        vitals.oxygenSat = patientInfo[6];
        vitals.temperature = patientInfo[7];
        }
    
    //patient can authorize a provider
    function authorizeProvider(bytes32[] memory providerInfo) public isPatient{
        authorizedProviders.push(ProviderData({
            hcpName: providerInfo[0],
            infoToAuth: providerInfo[1],
            reason: providerInfo[2]
            }));
    }
    
    //allow patient to view their data
    function getPatientSummary() public view isPatient returns(PatientSummary memory){
        return patient;
    } 

    function getPatientVitals() public view isPatient returns(PatientVitals memory){
        return vitals;
    }

    //allow hcp tp view data 
    //send data as hcpName
    //leaving as array to handle more complicated requests later
    function getPatientVitalsHCP(bytes32[] memory requestorInfo) public view isAuthorized(requestorInfo) returns(PatientVitals memory){
        return vitals;
    }

    function getPatientSummaryHCP(bytes32[] memory requestorInfo) public view isAuthorized(requestorInfo) returns(PatientSummary memory){
        return patient;
    }


    modifier isPatient() {
        require(msg.sender == patientAddress);
        _;
    }

    modifier isAuthorized(bytes32[] memory providerInfo) {
        //this is assuming one hcp for iteration one and assuming they have access to vitals and summary
        require(authorizedProviders[0].hcpName == providerInfo[0]);
        _;

    }


    
}