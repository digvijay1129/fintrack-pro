const cron = require("node-cron");
const RecurringExpense =
require("../models/RecurringExpense");
const Notification =
require("../models/Notification");

const dueTomorrowReminderJob = () => {

cron.schedule(
"0 9 * * *",
async()=>{

try{

const tomorrow =
new Date();

tomorrow.setDate(
tomorrow.getDate()+1
);

tomorrow.setHours(
0,0,0,0
);

const nextDay =
new Date(tomorrow);

nextDay.setDate(
nextDay.getDate()+1
);

const expenses =
await RecurringExpense.find({

nextDueDate:{

$gte:tomorrow,

$lt:nextDay,

},

});

for(
const expense
of expenses
){

await Notification.findOneAndUpdate(

{

user:
expense.user,

title:
"Bill Due Tomorrow",

message:
`⚠ ${expense.title} is due tomorrow.`,

month:
new Date().getMonth()+1,

year:
new Date().getFullYear(),

},

{

user:
expense.user,

title:
"Bill Due Tomorrow",

message:
`⚠ ${expense.title} is due tomorrow.`,

type:
"warning",

isRead:
false,

month:
new Date().getMonth()+1,

year:
new Date().getFullYear(),

},

{

upsert:true,

new:true,

}

);

}

}catch(error){

console.log(error);

}

}

);

};

module.exports=
dueTomorrowReminderJob;