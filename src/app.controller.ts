import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('api')
export class ApiGatewayController {
  constructor(
    @Inject('USER-SERVICE') private readonly loginServiceClient: ClientProxy,
    @Inject('SCORE_SERVICE') private readonly scoreServiceClient: ClientProxy,
    @Inject('AI_SERVICE') private readonly aiServiceClient: ClientProxy,
    @Inject('AR_SERVICE') private readonly arServiceClient: ClientProxy,
  ) {}

  @Post('login')
  login(@Body() credentials: any): Observable<any> {
    return this.loginServiceClient.send({ cmd: 'login' }, credentials);
  }

  @Post('score')
  score(@Body() credentials: any): Observable<any> {
    return this.scoreServiceClient.send({ cmd: 'score' }, credentials);
  }

  @Post('ai/analyze')
  analyze(@Body() data: any): Observable<any> {
    return this.aiServiceClient.send({ cmd: 'analyze' }, data);
  }

  @Post('ar/process')
  process(@Body() data: any): Observable<any> {
    return this.arServiceClient.send({ cmd: 'process' }, data);
  }
}
