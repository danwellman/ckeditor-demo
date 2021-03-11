/**
 * CKFinder upload adapter
 */
export class UploadAdapter {
  private loader;

  public xhr: XMLHttpRequest;

  constructor(loader: any) {
    this.loader = loader;
  }

  public upload(): Promise<any> {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }),
    );
  }

  public abort(): void {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  private _initRequest(): void {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open('POST', 'http://localhost/api/fmsmiddleware/files/preview', true); // FMS will need expanding to account for permanent image storage/retrieval - UC-18890
    xhr.responseType = 'json';
  }

  private _initListeners(resolve, reject, file): void {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      resolve({
        default: response.data.imageURL,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  private _sendRequest(file): void {
    // Prepare the form data.
    const data = new FormData();

    data.append('file', file);
    this.xhr.send(data);
  }
}
