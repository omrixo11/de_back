import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/purchase-plan/:planId')
  async purchasePlan(
    @Param('id') userId: string,
    @Param('planId') planId: string,
    @Body('isYearlyBilling') isYearlyBilling: boolean,
  ) {
    try {
      const result = await this.userService.purchasePlan(userId, planId, isYearlyBilling);
      return { success: true, result };
    } catch (error) {
      console.error('Error purchasing plan:', error);
      throw error;
    }
  }
}
