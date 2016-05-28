export class BufferReadError extends Error {
  constructor(pendingData=null) {
    super(BufferReadError.ERROR_MESSAGE);
    this.pendingData = pendingData;
  }
}
BufferReadError.ERROR_MESSAGE = 'Interrupted by insufficient buffer.';
