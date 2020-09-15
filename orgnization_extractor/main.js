const fs = require('fs');
const { domain } = require('process');

const ORGANIZATION_FILE_PATH = `./../orgnization_extractor/organization.json`; 
const personalUrls = ["gmail.com", "aol.com", "yahoo.com"];
const COME_BEFORE_DOMAIN = '@';


function isOrgAttributeExist(person) {
    // Check if person own the property entities
    let exist = false;
    if(person.object.hasOwnProperty("entities"))
    {
        exist = person.object.entities.some(
            org => org.objectType == 'organization');
    }

    return exist;
}
/*
* Input: Person, object that needed to
*        be checked.
* Output: Boolean, true if the person 
*         external otherwise false.
* 
* The function check if the object supposed 
* to pass the process of extraction organization.
*/ 
function isExternalAddress(person) {
    // check if the object isn't external
    return person.object.isExternal;
}

// Get person object, check if it is personal object,
// Return true if indeed, otherwise false.
function isPersonalAddress(person)
{
    // Check if the mail address if personal,
    // with the skill isPersonalAddress
    let unmanagedData = person.object.unmanagedData;
    if(unmanagedData.hasOwnProperty("skillData"))
    {
        let skillData = unmanagedData.skillData;
        if(skillData.hasOwnProperty("isPersonalAddress"))
        {
            return skillData.isPersonalAddress;
        }        
    }
    
    let domainName = extractDomain(person.object.externalObjectId);
    return personalUrls.includes(domainName);
}

/* Input: person - obj, value - boolean  
*  Output: None.
*
*  The function createing/changing the attribute
*  isPersonalAddress of the object Person.
*/
function addingIsPersonalSkill(person, value) {
    let unmanagedData = person.object.unmanagedData;
    // Check if the skill skillData is exist,
    // than changes or adding the attribute isPersonalAddress.
    if(unmanagedData.hasOwnProperty('skillData'))
    {
        unmanagedData.skillData.isPersonalAddress = value;
    }
    else
    {
        unmanagedData.skillData = {
            "isPersonalAddress" : value
        };
    }

    return person;
}
// Get person obj, check if the object is 
// type email, and belong to person.
// return true in this case otherwise false.
function isPersonMailEvent(person) {
    return (person.object.objectType == "person");

}

/*
* Input: String mail address.
* Output: String Domain of mail address.
*       If the domain doesn't found retun zero.
*
* The function find the domain of email address.
*/
function extractDomain(mailAddress) {
    let startIndexOfDomain = mailAddress.lastIndexOf(COME_BEFORE_DOMAIN) + 1; 
    
    return mailAddress.substring(startIndexOfDomain);
}


// get domain, generate orgnization external id, return it.
function OrgExtIdGenerator(domain) {
    let extId = domain;
    
    return extId;
}


/*
* Input: domain organization - string, 
*        extId - external organization id. 
* Output: orgnization object
*
* The function create organization object with the
* domain and ext id it get.
*/
function generateOrg(domain, extId) {
    let rawData = fs.readFileSync(ORGANIZATION_FILE_PATH);
    let org = JSON.parse(rawData);
    
    org = org.organization;
    org.object.externalObjectId = extId;
    org.object.unmanagedData.domainName = domain; 
    
    return org;
    
}


/*
* Input: person - person object, type json
*        org - organization object, type json
* Output: person object with a propery of entity,
*         that contain list of orgs.
*
* The function create new person with an entity of organizations;
*/
function createCompletePerson(person, org) {
    let completePerson = person;
    completePerson.object.entities = [org];
    
    return completePerson;
} 



/*
* Input: person object type.
* Output: complete person, 
*         person with parent object of organization.
*
* The function is the main of the project. It 
* validate the object person and when needed, 
* find the orgnization of the person and return 
* the person with this attribute.
*/
function orgExtractor(person) {
    // Check if the event is mail event of person, and external.
    if(!( isExternalAddress(person) ) || !( isPersonMailEvent(person) ))
    {
        return person;
    }
    
    // Check if the mail is personal
    if(isPersonalAddress(person))
    {
        addingIsPersonalSkill(person, true);
        return person;
    } 
    
    // adding attribute
    addingIsPersonalSkill(person, false);
    
    // Check if org Attribute exist
    if(isOrgAttributeExist(person))
    {
        return(person);
    }
    
    let domain = extractDomain(person.object.externalObjectId);
    let orgExtId = OrgExtIdGenerator(domain);
    let org = generateOrg(domain, orgExtId).object;
    
    return createCompletePerson(person, org);
}


module.exports = {
"addingIsPersonalSkill" : addingIsPersonalSkill,
"createCompletePerson" : createCompletePerson,
"isOrgAttributeExist" : isOrgAttributeExist,
"isPersonMailEvent" : isPersonMailEvent,
"isPersonalAddress" : isPersonalAddress,
"isExternalAddress" : isExternalAddress,
"OrgExtIdGenerator" : OrgExtIdGenerator,
"extractDomain" : extractDomain,
"orgExtractor" : orgExtractor,
"generateOrg" : generateOrg
};



