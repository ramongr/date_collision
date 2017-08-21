/*
  Date collision detection
  There's an initial date range. Date collision will check if another date range collides with it and then calculates
  which one of 3 things should happen to the original date range:
  Split:
    - The new date range has a start and end date between the original date range, the original must be split.
  Override (head):
    - The new date range has a start date that's equal or before the original date range and the new date range end date
      is contained in the original date range, the original start date should be changed.
  Override (tail):
    - Mutatis mutandis Override (head) start date for end date
  Override (full):
    - The new date range has both the original start date and end date within it's range. The original date range
    will be deleted.
*/

function DateCollision(startDate, endDate){
  this.startDate = startDate;
  this.endDate = endDate;
}

// The isBetween function with the '[]' param includes the start and end date
DateCollision.prototype.newDateRangeContains = function(startDate, endDate) {
  this.newDateCollideStart = moment(startDate).isBetween(this.startDate, this.endDate, null, '[]');
  this.newDateCollideEnd = moment(endDate).isBetween(this.startDate, this.endDate, null, '[]');
  return this.newDateCollideStart || this.newDateCollideEnd;
};

DateCollision.prototype.originalDateRangeContains = function(startDate, endDate) {
  this.originalDateCollideStart = moment(this.startDate).isBetween(startDate, endDate, null, '[]');
  this.originalDateCollideEnd = moment(this.endDate).isBetween(startDate, endDate, null, '[]');

  return this.originalDateCollideStart || this.originalDateCollideEnd;
};

DateCollision.prototype.calculateDates = function(startDate, endDate) {
  if(!this.newDateRangeContains() && !this.originalDateRangeContains())
    return false;

  if(this.newDateCollideStart && this.newDateCollideEnd)
    return splitDate(startDate, endDate);

  if(!this.newDateCollideStart && this.newDateCollideEnd)
    return overrideTail(startDate, endDate);

  if(this.newDateCollideStart && this.newDateCollideEnd)
    return overrideHead(startDate, endDate);

  if(!this.newDateRangeContains() && this.originalDateRangeContains())
    return [{startDate: startDate, endDate: endDate}];

};

DateCollision.prototype.splitDate = function(startDate, endDate) {
  return [
    {startDate: this.startDate, endDate: startDate},
    {startDate: startDate, endDate: endDate},
    {startDate: endDate, endDate: this.endDate}
  ];
};

DateCollision.prototype.overrideHead = function(startDate, endDate) {
  return [{startDate: startDate, endDate: endDate}, {startDate: endDate, endDate: this.endDate}];
};

DateCollision.prototype.overrideTail = function(startDate, endDate) {
  return [{startDate: this.startDate, endDate: startDate},{startDate: startDate, endDate: endDate}];
};


DateCollision.prototype.validDateRange = function(startDate, endDate) {
  return moment(startDate).isAfter(endDate);
};
