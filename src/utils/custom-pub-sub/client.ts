import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

export class CustomClientPubSub extends ClientProxy {
  protected publish(
    packet: ReadPacket,
    callback: (packet: WritePacket) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
  // Custom implementation

  async connect(): Promise<void> {
    // Implement the connect method
  }

  async close(): Promise<void> {
    // Implement the close method
  }

  // protected publish(packet: any, callback: (packet: any) => void): Function {
  //   // Implement the publish method

  //   return () => {};
  // }

  protected dispatchEvent<T = any>(packet: any): Promise<T> {
    // Implement the dispatchEvent method

    return Promise.resolve(packet);
  }
}
