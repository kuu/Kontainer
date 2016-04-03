export class BufferReadError extends Error {
  constructor() {
    super(BufferReadError.ERROR_MESSAGE);
  }
}
BufferReadError.ERROR_MESSAGE = 'Interrupted by insufficient buffer.';
