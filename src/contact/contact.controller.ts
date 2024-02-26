import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      const newContact = await this.contactService.create(createContactDto);
      return newContact;
    } catch (error) {
      throw new HttpException('Failed to create contact', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.contactService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch contacts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const contact = await this.contactService.findOne(id);
      if (!contact) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
      return contact;
    } catch (error) {
      throw new HttpException('Failed to fetch contact', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    try {
      const updatedContact = await this.contactService.update(id, updateContactDto);
      if (!updatedContact) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
      return updatedContact;
    } catch (error) {
      throw new HttpException('Failed to update contact', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedContact = await this.contactService.remove(id);
      if (!deletedContact) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Contact successfully deleted' };
    } catch (error) {
      throw new HttpException('Failed to delete contact', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
