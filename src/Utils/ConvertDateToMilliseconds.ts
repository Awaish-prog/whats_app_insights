

export function convertDateToSeconds(date: string, time: string){

    const parts = date.split('-');
    const month = parseInt(parts[0]) - 1; // Months are zero-based
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    const dateObject = new Date(year, month, day);
    console.log(dateObject);
    
    const seconds = dateObject.getTime() / 1000;

    return seconds
}