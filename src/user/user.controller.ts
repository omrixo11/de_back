import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/user/user-auth.middleware';
import { CreateBoostDto } from 'src/boost/dto/create-boost.dto';
import { Roles } from 'src/auth/user/roles.decorator';
import { RolesGuard } from 'src/auth/user/user-auth.roles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/favorites')
  @UseGuards(JwtAuthGuard)
  getFavoriteArticles(@Param('id') userId: string) {
    return this.userService.getFavoriteArticles(userId);
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
      const result = await this.userService.initiatePurchasePlan(userId, planId, isYearlyBilling);
      return { success: true, result };
    } catch (error) {
      console.error('Error purchasing plan:', error);
      throw error;
    }
  }

  @Post('article/:articleId/boost')
  @UseGuards(JwtAuthGuard)
  async purchaseBoost(
    @Param('articleId') articleId: string,
    @Body() createBoostDto: CreateBoostDto
  ): Promise<any> {
    return this.userService.initiateBoostPurchase({ ...createBoostDto, articleId });
  }


  @Post(':id/toggle-favorite/:articleId')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(
    @Param('id') userId: string,
    @Param('articleId') articleId: string,
  ) {
    try {
      console.log('Toggle Favorite Request Received:', { userId, articleId });

      const result = await this.userService.toggleFavorite(userId, articleId);

      console.log('Toggle Favorite Success:', { userId, articleId, result });

      return { success: true, result };
    } catch (error) {
      console.error('Toggle Favorite Error:', error);
      throw error;
    }
  }
}
