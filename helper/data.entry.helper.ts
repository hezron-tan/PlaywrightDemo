import { faker } from '@faker-js/faker';

export class DataEntryHelper {
    static generateFirstName = () =>{
        return faker.person.firstName();
    }
    
    static generateLastName = () => {
        return faker.person.lastName();
    }
    
    static generateAddress = () => {
        return faker.location.streetAddress();
    }
    
    static generateCity = () => {
        return faker.location.city();
    }

    static generatePastDate = () => {
        return faker.date.past();
    }

    static generateFuturetDate = () => {
        return faker.date.future();
    }

    static generateRandomMessage =  () => {
        return faker.lorem.lines(1);
    }

    static generateBirthDate = () => {
        return faker.date.birthdate();
    }

    static generateRandomDay = () => {
        return faker.number.bigInt({ min: 1, max: 28}); 
    }
}