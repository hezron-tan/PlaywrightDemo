import faker from 'faker';

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

    generatePastDate = async() => {
        return await faker.date.past();
    }

    generateFuturetDate = async() => {
        return await faker.date.future();
    }

    generateRandomMessage = async () => {
        return await faker.lorem.lines(1);
    }
}