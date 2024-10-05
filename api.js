import axios from "axios";

const API_KEY= import.meta.env.VITE_API_KEY;

const today = new Date();
const formattedToday = (today.toISOString()).toString().slice(0,-5)+"Z";

const formattedTodayPlusTwoYears = today.getFullYear() + 2 + formattedToday.slice(4)


const evenBrite = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2/",
});

export const getAllEvents = (page) => {
    return evenBrite.get(`/events.json?countryCode=GB&sort=random&keyword=oasis&includeTest=no&startDateTime=${formattedToday}&endDateTime=${formattedTodayPlusTwoYears}&apikey=${API_KEY}&page=${page}`);
}; // keyword used at the moment to facilitate quicker testing

