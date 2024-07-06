import { faker } from '@faker-js/faker';

export class DataEntryHelper {
    static generateFirstName = async() =>{
        return await faker.person.firstName();
    }
    
    static generateLastName = async() => {
        return await faker.person.lastName();
    }
    
    static generateAddress = async() => {
        return await faker.location.streetAddress();
    }
    
    static generateCity = async() => {
        return await faker.location.city();
    }

    static generatePastDate = async() => {
        return await faker.date.past();
    }

    static generateFuturetDate = async() => {
        return await faker.date.future();
    }

    static generateRandomMessage = async () => {
        return await faker.lorem.lines(1);
    }

    static generateBirthDate = async() => {
        return await faker.date.birthdate();
    }
}