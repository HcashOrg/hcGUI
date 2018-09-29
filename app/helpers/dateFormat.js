// tsToDate converts a transaction timestamp into a date
// object
export function tsToDate(txTimestamp) { 
  // return new Date(txTimestamp*1000);
  return dateToLocal(txTimestamp);
}


export function dateToLocal(d) {
  Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  Date.prototype.dst = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  };

  var date = new Date(d * 1000);
  
  if (date.dst()) {
    date.setHours(date.getHours() + 1);
    return date;
  }
  return date;
}

export function dateToUTC(d) {
  const date = new Date(d * 1000);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(),  date.getUTCSeconds());
}