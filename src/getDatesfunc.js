function getDates(rawDate) {

    const d = new Date(rawDate);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    return {
        weekday: weekday[d.getDay()],
        day: d.getDate(),
        month: months[d.getMonth()],
        year: d.getFullYear()
    }
}

export default getDates;