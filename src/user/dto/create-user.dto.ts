import { IsNotEmpty, IsEmail, IsPhoneNumber, IsDateString } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEmail()
    adress: string;

    @IsDateString()
    birthDate: string;

    @IsNotEmpty()
    password: string;

    @IsPhoneNumber(null, { message: 'Invalid phone number' })
    phoneNumber: string;

    profileImg: string;




    confirmationCode: string = null;
}
