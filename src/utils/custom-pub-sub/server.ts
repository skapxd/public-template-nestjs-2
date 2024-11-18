import { CustomTransportStrategy, Server } from '@nestjs/microservices';

export class CustomServerPubSub
  extends Server
  implements CustomTransportStrategy
{
  /**
   * This method is triggered when you run "app.listen()".
   */
  listen(callback: () => void) {
    this.logger.log(this.messageHandlers);
    callback();
  }

  /**
   * This method is triggered on application shutdown.
   */
  close() {}
}
