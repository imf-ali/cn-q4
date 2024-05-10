class ApplicationError extends Error{
  constructor(message, status){
    super(message);
    this.status = status;
  }
}

export const ApplicationMiddleware = (err, req, res, next) => {
  if(err instanceof ApplicationError){
    return res.status(err.status).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: err.message });
}

export default ApplicationError;