// import { Schema, model } from 'mongoose';

// const ItemSchema = new Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true ,min: [0, 'Cost cannot be negative'] },
//   quantity: { type: Number, required: true,min: [0, 'Cost cannot be negative']},
//   image: { type: String, default: "" },
// });

// const BusinessmanSchema = new Schema({
//   Name: { type: String, required: true },
//   Age: { type: Number, required: true },
//   Email: { type: String, required: true, unique: true },
//   PhoneNumber: { type: String, required: true, unique: true },
//   Businessname: { type: String, required: true, unique: true },
//   Password: { type: String, required: true },
//   Items: [ItemSchema], // embedded item schema
// });

// export default model('Businessman', BusinessmanSchema);


import { Schema, model } from 'mongoose';

const ItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: [0, 'Cost cannot be negative'] },
  quantity: { type: Number, required: true, min: [0, 'Cost cannot be negative'] },
  image: { type: String, default: "" },
});

// 🆕 Bank Details Schema (added only this)
const BankDetailsSchema = new Schema({
  AccountHolderName: { type: String, required: true },
  AccountNumber: { type: String, required: true },
  IFSC: { type: String, required: true },
  BankName: { type: String, required: true },
  UPIId: { type: String, required: true },
}, { _id: false });

const BusinessmanSchema = new Schema({
  Name: { type: String, required: true },
  Age: { type: Number, required: true },
  Email: { type: String, required: true, unique: true },
  PhoneNumber: { type: String, required: true, unique: true },
  Businessname: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Items: [ItemSchema], // embedded item schema

  // 🆕 BankDetails field added here
  BankDetails: BankDetailsSchema
});

export default model('Businessman', BusinessmanSchema);
