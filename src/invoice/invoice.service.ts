import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument } from 'src/schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const newInvoice = new this.invoiceModel(createInvoiceDto);
    return newInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(id, updateInvoiceDto, { new: true }).exec();
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return updatedInvoice;
  }

  async remove(id: number): Promise<any> {
    const deletedInvoice = await this.invoiceModel.findByIdAndRemove(id).exec();
    if (!deletedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return deletedInvoice;
  }
}
