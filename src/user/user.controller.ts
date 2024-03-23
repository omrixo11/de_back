import { UseGuards, Controller, UploadedFile, UseInterceptors, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/user/user-auth.middleware';
import { CreateBoostDto } from 'src/boost/dto/create-boost.dto';
import { Roles } from 'src/auth/user/roles.decorator';
import { RolesGuard } from 'src/auth/user/user-auth.roles';
import { CreateAdsBannerDto } from 'src/ads-banners/dto/create-ads-banner.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
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

  @Post(':userId/ads-banners/purchase')
  @UseInterceptors(FileInterceptor('image'))
  async initiateAdsBannerPurchase(
    @Param('userId') userId: string,
    @Body() createAdsBannerDto: CreateAdsBannerDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    if (!image) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userService.initiateAdsBannerPurchase(userId, createAdsBannerDto, image);
      return { message: 'Ads banner purchase initiated successfully.' };
    } catch (error) {
      // You might want to handle different types of errors differently
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
