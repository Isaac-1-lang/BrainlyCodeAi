/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AiService } from './ai.service';

class ChatHistoryItemDto {
  @IsString()
  role!: string;

  @IsString()
  content!: string;
}

class ChatRequestDto {
  @IsString()
  messages!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItemDto)
  history?: ChatHistoryItemDto[];
}

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with BrainlyCode AI' })
  @ApiBody({ type: ChatRequestDto })
  async chat(@Body() body: ChatRequestDto) {
    const { messages, history } = body;
    try {
      const reply = await this.aiService.askTutor(messages, history);
      return { reply };
    } catch (error) {
      // Log and map to HTTP error
      // eslint-disable-next-line no-console
      console.error(error);
      throw new HttpException('BrainlyCode AI failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


