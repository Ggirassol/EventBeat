import axios from "axios";

const TICKETMASTER_API_KEY= import.meta.env.VITE_TICKETMASTER_API_KEY;

const today = new Date();
const formattedToday = (today.toISOString()).toString().slice(0,-5)+"Z";

const formattedTodayPlusTwoYears = today.getFullYear() + 2 + formattedToday.slice(4)


const evenBrite = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2/",
});

export const getAllEvents = (page) => {
    return evenBrite.get(`/events.json?countryCode=GB&city=london&sort=random&segmentName=music&includeTest=no&startDateTime=${formattedToday}&endDateTime=${formattedTodayPlusTwoYears}&apikey=${TICKETMASTER_API_KEY}&page=${page}`);
};

export const getEventById = (id) => {
    return evenBrite.get(`/events.json?apikey=${TICKETMASTER_API_KEY}&id=${id}`)
}