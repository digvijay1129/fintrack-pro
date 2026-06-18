const mongoose = require(
  "mongoose"
);

const recurringExpenseSchema =
new mongoose.Schema(

{

user:{
type:
mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,
},

title:{
type:String,

required:true,
},

amount:{
type:Number,

required:true,
},

category:{
type:String,

required:true,
},

frequency:{
type:String,

enum:[
"daily",
"weekly",
"monthly",
"yearly",
],

required:true,
},

nextDueDate:{
type:Date,

required:true,
},

},

{
timestamps:true,
}

);

module.exports=
mongoose.model(

"RecurringExpense",

recurringExpenseSchema

);