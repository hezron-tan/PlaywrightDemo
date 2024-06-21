const faker = require('faker');

export class DataEntryHelper {
    generateFirstName = async() =>{
        return await faker.name.firstName();
    }
    
    generateLastName = async() => {
        return await faker.name.lastName();
    }
    
    generateAddress = async() => {
        return await faker.address.streetAddress();
    }
    
    generateCity = async() => {
        return await faker.address.city();
    }
}