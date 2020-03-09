/**
 * @module helpers
 */

/**
 * @class module:helpers.CustomDate
 * @classdesc custom class for date, all date functions with additional functions required as per application.
 * Instead of creating date using new Date(), we can use new CustomDate()
 */
class CustomDate extends Date {

	/**
	 * @method module:helpers.CustomDate#twoDigitPadding
	 * @desc takes a number and returns two digit value
	 * @param {string|number} val value can be month/day - either two digit or one digit
	 */
	twoDigitPadding(val) {
		if (val != null && val != undefined && typeof (val) != 'object' && val != '') {
			return (val + '').padStart(2, 0);
		} else {
			return 'NA';
		}

	}

	/**
	 * @method module:helpers.CustomDate#paddedMonth
	 * @desc get current month for the date with padding (January becomes 01, February => 02, March => 03..December => 12)
	 * @requires module:helpers~CustomDate#twoDigitPadding
	 */
	paddedMonth() {
		return this.twoDigitPadding((this.getMonth() + 1));
	}

	/**
	 * @method module:helpers.CustomDate#paddedDate
	 * @desc get the current date with two digit padding like 1 => 01, 2 => 02,... 29 => 29, 30 => 30
	 * @requires module:helpers~CustomDate#twoDigitPadding
	 */
	paddedDate() {
		return this.twoDigitPadding(this.getDate());
	}

	/**
	 * @method module:helpers.CustomDate#getUSDateFormat
	 * @desc get the date in 'MM-DD-YYYY' string format (MM - Month in number, DD - Date in number, YYYY - year in number)
	 */
	getUSDateFormat() {
		return this.paddedMonth() + '-' + this.paddedDate() + '-' + this.getFullYear();
	}

	/**
	 * @method module:helpers.CustomDate#getLoggerFormat
	 * @desc get a custom format that we defined to print on console for logger
	 */
	getLoggerFormat() {
		return '[' + this.getUSDateFormat() + 'T' + this.toTimeString() + ']';
	}
}

module.exports = CustomDate;