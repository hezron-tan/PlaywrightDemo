import { request } from "http";
import { test, expect } from "playwright/test";
import { Bookings, CreateBookingResponse, Booking, BookingDates  } from "../datamodel/bookings.model";
import { DataEntryHelper } from "../helper/data.entry.helper";
import exp from "constants";


test("Get Method 1", async ({request}) => {
    const response = await request.get("/booking");
    expect(response.ok()).toBeTruthy();
})

test("Get Method with Data Model", async ({request}) => {
    const response = await request.get("/booking");
    let bookings : Bookings [] = await response.json();
    
    // Get random Booking Id
    const bookingId : number = bookings[Math.floor(Math.random() * bookings.length)].bookingid;
    const bookingResponseById = await request.get(`/booking/${bookingId}`)
    console.log(bookingResponseById.statusText());
    let booking : Booking = await bookingResponseById.json();
    expect(booking.firstname).not.toBe(null);
    expect(booking.lastname).not.toBe(null);
    expect(booking.totalprice).not.toBe(0);
    expect(booking.bookingdates.checkin < booking.bookingdates.checkout).toBeTruthy();
    expect(booking.additionalneeds.length >= 0).toBeTruthy();
})

test("Post Method", async ({request}) => {
    let firstName = await DataEntryHelper.generateFirstName();
    let lastName = await DataEntryHelper.generateLastName();
    let totalPrice = Math.floor(Math.random() * 500);
    let checkin = await DataEntryHelper.generatePastDate();
    let checkout = await DataEntryHelper.generateFuturetDate();
    let additionalNeeds = await DataEntryHelper.generateRandomMessage();
    let bookingDates = new BookingDates(checkin, checkout);
    let booking = new Booking(firstName, lastName, totalPrice, true, bookingDates, additionalNeeds);

    const response = await request.post("/booking", { data: booking});
    let bookingResponse : CreateBookingResponse = await response.json();
    console.log(bookingResponse.bookingid);
    expect(bookingResponse.bookingid).toBeGreaterThan(0);
    expect(bookingResponse.booking.firstname).toContain(firstName);
    expect(bookingResponse.booking.lastname).toContain(lastName);
    expect(bookingResponse.booking.totalprice).toEqual(totalPrice);
    expect(bookingResponse.booking.bookingdates.checkin).toContain(new Date(checkin).toISOString().split('T')[0]);
    expect(bookingResponse.booking.bookingdates.checkout).toContain(new Date(checkout).toISOString().split('T')[0]);
    expect(bookingResponse.booking.additionalneeds).toContain(additionalNeeds);
})