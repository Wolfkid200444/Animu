import LavaqueueNode from 'lavaqueue/typings/Node';

declare module 'klasa' {
  interface KlasaClient {
    lVoice: LavaqueueNode;
  }
}
