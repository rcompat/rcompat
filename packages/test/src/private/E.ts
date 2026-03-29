type EncodedError = {
  message: string;
  code?: string;
};

export default (error: unknown) => error as EncodedError;
