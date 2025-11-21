import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  difficulty!: string;

  @IsInt()
  @IsOptional()
  marks!: number;

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