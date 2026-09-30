export class HttpError extends Error {
  constructor(message, { status, url, cause } = {}) {
    super(message, { cause });
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}
