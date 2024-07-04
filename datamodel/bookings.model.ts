export class Bookings {
    
    bookingid: number;

    constructor(bookingId: number) {
        this.bookingid = bookingId;
    }
}

export class Booking {
    
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds: string;

    constructor(firstName: string, lastName: string, totalPrice: number, depositPaid: boolean, bookingDates: BookingDates, additionalNeeds: string) {
        this.firstname = firstName;
        this.lastname = lastName;
        this.totalprice = totalPrice;
        this.depositpaid = depositPaid;
        this.bookingdates = bookingDates;
        this.additionalneeds = additionalNeeds;
    }
}

export class BookingDates {
    checkin: Date;
    checkout: Date;

    constructor(checkin: Date, checkout: Date) {
        this.checkin = checkin;
        this.checkout = checkout;
    }
}

export class CreateBookingResponse {
    bookingid: number;
    booking: Booking;

    constructor(bookingId: number, booking: Booking) {
        this.bookingid = bookingId;
        this.booking = booking;
    }
}