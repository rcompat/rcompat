type ErrorMessage = {
  message: string;
};

export default (error: unknown) => error as ErrorMessage;
