import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketAttrs{
  title: string,
  price: number,
  userId: string
}

interface TicketDoc extends mongoose.Document{
  title: string,
  price: number,
  userId: string,
  version: number,
  orderId: string
}

interface TicketModel extends mongoose.Model<TicketDoc>{
build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required:true
  },
  userId: {
    type: String,
    requred: true
  }
  ,
  orderId: {
    type: String,
  }
},{
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id
    }
  }
});
TicketSchema.set('versionKey', 'version')
TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
TicketSchema.plugin(updateIfCurrentPlugin);
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export {Ticket}
