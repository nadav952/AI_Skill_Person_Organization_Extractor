const cloneDeep = require('lodash.clonedeep');
const expect = require('expect');
const fs = require('fs');

const {
addingIsPersonalSkill, createCompletePerson,
isOrgAttributeExist, isPersonMailEvent,
isPersonalAddress, isExternalAddress,
OrgExtIdGenerator, extractDomain,
orgExtractor, generateOrg} = require("./../orgnization_extractor/main");

//defines paths
const INPUT_PATH = '/input.json';
const OUTPUT_PATH = '/output.json';

const ADDING_IS_PERSONAL_SKILL_PATH = './addingIsPersonalSkill';
const IS_ORG_ATTRIBUTE_EXIST_PATH = './isOrgAttributeExist2';
const IS_PERSON_MAIL_EVENT_PATH = './isPersonMailEvent';
const IS_PERSONAL_ADDRESS_PATH = './isPersonalAddress';
const IS_EXTERNAL_ADDRESS_PATH = './isExternalAddress';
const ORG_EXTRACTOR_PATH = './orgExtractor';
const CREATE_COMPLETE_PERSON_PATH = './createCompletePerson';
const ORG_EXT_ID_GENERATOR_PATH = './orgExtIdGenerator';
const EXTRACT_DOMAIN_PATH = './extractDomain';
const GENERATE_ORG_PATH = './generateOrg';


//----------- helper functions --------------
function runTest(path, evaluate, msg, func = 'toBe') {
    let rawData = fs.readFileSync(path + INPUT_PATH);
    let inputs = JSON.parse(rawData);
    
    rawData = fs.readFileSync(path + OUTPUT_PATH);
    let outputs = JSON.parse(rawData);

    test(msg, () => {
        // inputs and outputs have the same names
        for(let name in inputs){                
            const input = inputs[name];
            const expectedResult = outputs[name];            

            // In case of the input hold array, 
            // that mean it has more than one param.
            if(Array.isArray(input))
            {
                const result = evaluate(...input);
                expect(result)[func](expectedResult);
            } 
            else
            {
                const result = evaluate(input);
                expect(result)[func](expectedResult);
            }
        }
    });
}


// ------------- Start Testing ------------------

describe("isOrgAttributeExist function checking", function()
{
    // Check the function Is Org Attribute Exist 
    runTest(IS_ORG_ATTRIBUTE_EXIST_PATH, isOrgAttributeExist,
            "Should return if the org attribute exist");
    runTest(IS_PERSONAL_ADDRESS_PATH, isPersonalAddress,
            "Should return if the address is personal");
    runTest(IS_PERSON_MAIL_EVENT_PATH, isPersonMailEvent,
            "Should return if the object is type of person");
    runTest(IS_EXTERNAL_ADDRESS_PATH, isExternalAddress,
            "Should return if the address path is external");
});


// --------------- Unit Testing ---------------------

// check the extractDomain function
runTest(EXTRACT_DOMAIN_PATH, extractDomain, 
    'should return "shieldox.com"');

// Check the function OrgExtIdGenerator
runTest(ORG_EXT_ID_GENERATOR_PATH, OrgExtIdGenerator,
    'should return the same value as it get in the domain');

// Check generateOrg function
runTest(GENERATE_ORG_PATH, generateOrg,
    'should return Organization Object with id and domain = "shieldox.com"',
    'toStrictEqual');

// Check createCompletePerson function
runTest(CREATE_COMPLETE_PERSON_PATH, createCompletePerson,
    'should create entity of Organization in person', 'toStrictEqual');


runTest(ADDING_IS_PERSONAL_SKILL_PATH, addingIsPersonalSkill,
    'should create new skill, Is Personal Address', 'toStrictEqual');

runTest(ORG_EXTRACTOR_PATH, orgExtractor,
    'should return the complete person with organization if necessary',
    'toStrictEqual');