const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getMonthLength = (month, year) => {
	/* returns the number of days in the month. `month` and `year` are both integers. */
	return [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	][month - 1];
};


testing.addUnit("isLeapYear()", {
	"correctly decides whether a year is a leap year or not": () => {
		expect(isLeapYear(0)).toEqual(true);
		expect(isLeapYear(4)).toEqual(true);
		expect(isLeapYear(8)).toEqual(true);
		expect(isLeapYear(12)).toEqual(true);
		expect(isLeapYear(13)).toEqual(false);
		expect(isLeapYear(14)).toEqual(false);
		expect(isLeapYear(100)).toEqual(false);
		expect(isLeapYear(200)).toEqual(false);
		expect(isLeapYear(300)).toEqual(false);
		expect(isLeapYear(400)).toEqual(true);
		expect(isLeapYear(800)).toEqual(true);
	}
});

const oneWeekLater = (day, month, year) => {
	/* returns the date one week later in an array of the form [day, month, year]. */
	const monthLength = getMonthLength(month, year);
	day += 7;
	if(day > monthLength) {
		day = day - monthLength;
		month ++;
		if(month > 12) {
			month = 1;
			year ++;
		}
	}
	return [day, month, year];
};


let date = [7, 1, 1900];
let sundaysOnFirstOfMonth = 0;
while(date[2] <= 2000) {
	date = oneWeekLater(...date);
	if(date[0] === 1 && date[2] >= 1901) {
		sundaysOnFirstOfMonth ++;
	}
}
console.log(sundaysOnFirstOfMonth);
