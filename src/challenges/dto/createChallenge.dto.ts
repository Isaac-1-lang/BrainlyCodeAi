import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  difficulty!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  relation!: string;

  @IsNotEmpty()
  @IsString()
  duration!: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsBoolean()
  useEditor?: boolean;

  @IsOptional()
  @IsBoolean()
  useInput?: boolean
}