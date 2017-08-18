function DateCollision(startDate, endDate){
  this.startDate = startDate;
  this.endDate = endDate;
}

// The isBetween function with the '[]' param includes the start and end date
DateCollision.prototype.newDateRangeContains = function(startDate, endDate) {
  this.newDateCollideStart = moment(startDate).isBetween(this.startDate, this.endDate, null, '[]');
  this.newDateCollideEnd = moment(endDate).isBetween(this.startDate, this.endDate, null, '[]');
  return this.newDateCollideStart && this.newDateCollideEnd;
};

DateCollision.prototype.originalDateRangeContains = function(startDate, endDate) {
  this.originalDateCollideStart = moment(this.startDate).isBetween(startDate, endDate, null, '[]');
  this.originalDateCollideEnd = moment(this.endDate).isBetween(startDate, endDate, null, '[]');

  return this.originalDateCollideStart && this.originalDateCollideEnd;
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

function splitDate(startDate, endDate) {
  return [
    {startDate: this.startDate, endDate: startDate},
    {startDate: startDate, endDate: endDate},
    {startDate: endDate, endDate: this.endDate}
  ];
}

function overrideHead(startDate, endDate) {
  return [{startDate: startDate, endDate: endDate}, {startDate: endDate, endDate: this.endDate}];
}

function overrideTail(startDate, endDate) {
  return [{startDate: this.startDate, endDate: startDate},{startDate: startDate, endDate: endDate}];
}


function validDateRange(startDate, endDate) {
  return moment(startDate).isAfter(endDate);
}
