import { IsString } from "class-validator";

export class CreatePhotoDto {

    @IsString()
    word!: string

}