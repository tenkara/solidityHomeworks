# SmartHealth smart contract

This smart contract has the following functions for interacting with an EHR:

Create an EHR (constructor) send the following information as a bytes 32 array with your request:

	bytes32 name; // patient name

	bytes32 age;  // patient age

	bytes32 birthSex; // sex assigned at birth

	bytes32 weight;   // weight in pounds

	bytes32 heartRate;   // ex 75 bpm

	bytes32 bloodPressure; // ex: 12/80 mm Hg

	bytes32 oxygenSat; //ex: 98%

	bytes32 temperature; //ex: 99.5 F
        
        
authorizeProvider([providerName, informationAuthorized, reason])

Note - First iteration assumes only one authorized provider

getPatientSummary() - must be patient to use

getPatientVitals() - must be patient to use

getPatientSummaryHCP([providerName]) - must be authorized to use

getPatientVitalsHCP([providerName]) - must be authorized to use



