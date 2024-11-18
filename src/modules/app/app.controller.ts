import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiOkResponse } from '@nestjs/swagger';
import { interval, map } from 'rxjs';

import { GetAllMessageDTO } from '#/src/modules/app/dto/get-all-messages.dto';
import { ApiResponseSSE } from '#/src/utils/decorators/api-response-sse.decorator';
import { MessageSendedEvent } from '#/src/utils/events/app.event';
import { AuthorizationGuard } from '#/src/utils/guards/authorization.guard';
import { RolesGuard } from '#/src/utils/guards/roles.guard';

import { AppService } from './app.service';
import { SendMessageDTO } from './dto/send-message.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthorizationGuard)
  @ApiOkResponse({ type: SendMessageDTO })
  @Post()
  sendMessage(@Body() dto: SendMessageDTO) {
    return this.appService.sendMessage(dto);
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  getAllMessages(@Query() query: GetAllMessageDTO) {
    return this.appService.getMessages(query);
  }

  @Post('roles')
  @UseGuards(new RolesGuard(['admin']))
  getRoles() {
    return 'roles';
  }

  @OnEvent(MessageSendedEvent.nameEvent, { async: true })
  handleOrderCreatedEvent(payload: MessageSendedEvent) {
    return this.logger.log(payload.toString());
  }

  @ApiResponseSSE({
    event: 'events',
    // type: { ':': 'this is a comment' },
  })
  @Sse('events')
  sse() {
    return interval(1000).pipe(map(() => ': this is a comment'));
  }
}
