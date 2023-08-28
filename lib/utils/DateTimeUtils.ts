// Return a person's age if they were born on the given date...
export function getAgeFromDOB(dob: Date, now?: Date): number {
    if (!now) { now = new Date(); }

    var ageDifMs = now.getTime() - dob.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}