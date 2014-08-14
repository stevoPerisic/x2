//**************************************************
//*******	TIMECARD DETAIL ROW CONTROLLER	****************
//*************************************************
console.log('Timecard Detail Row for Daily Summary being read....');

var args = arguments[0] || {};
var weekEnding = args.weekEnding;
var dayNumber = args.dayNumber;
var hours = args.hours;
var day;
var date;

if(args.weekEnding !== 'N/A'){
	day = moment(weekEnding, "MM-DD-YYYY").subtract('days', 6-dayNumber).format('ddd');
	date = moment(weekEnding, "MM-DD-YYYY").subtract('days', 6-dayNumber).format('MM[/]DD');

	$.day.setText(day);
	$.date.setText(date);
	$.hours.setText(hours);

	if(args.hrsVerif_dayNumber){
		$.row.hrsVerif_dayNumber = args.hrsVerif_dayNumber;
		$.row.hrsVerif_date = moment(weekEnding, "MM-DD-YYYY").subtract('days', 6-dayNumber).format('MM[/]DD[/]YYYY');
		$.row.hrsVerif_unix = moment($.row.hrsVerif_date).unix();
	}
}


