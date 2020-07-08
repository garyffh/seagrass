import { EventEmitter, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class ErrorItem {
    constructor(public id: number, public title: string, public message: string, public errorObject: object) {
    }
}

export class ServerErrorItem {
    constructor(public title: string, public message: string, public errorObject: object) {
    }
}

export class ErrorsState {
    constructor(public lastError: ErrorItem, public errorCount: number) {
    }
}

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    get errorChangeEvent(): EventEmitter<ErrorsState> {
        return this._errorChangeEvent;
    }

    get errors(): Array<ErrorItem> {
        return this._errors;
    }

    private _nextId = 1;
    private _errors: Array<ErrorItem> = [];

    private _errorChangeEvent: EventEmitter<ErrorsState> = new EventEmitter();

    private _getIndexFromId(id: number): number {

        if (this._errors === null) {
            return -1;
        }
        if (this._errors.length <= 0) {
            return -1;
        }

        return this._errors.indexOf(this._errors.find((o) => o.id === id));

    }

    getHttpStatusMessage(status: number) {

        switch (status) {

            case 500:
                return 'internal server error';

            case 400:
                return 'invalid grant';
            case 401:
                return 'not authorized';
            case 404:
                return 'url not found';
            default:
                return 'unknown status error (' + status + ')';
        }

    }

    getJsonErrorObject(error: any) {
        let jsonObject = null;
        try {
            jsonObject = error.json();

            // tslint:disable-next-line:no-empty
        } catch (er) {
        }

        return jsonObject;
    }

    getHttpErrorMessage(error: HttpErrorResponse): string {

        if (error.error) {
            if (error.error.error_description) {
                return error.error.error_description;
            }

            if (error.error.ModelState) {
                if (error.error.ModelState.modelError) {
                    return error.error.ModelState.modelError.map((object) => object).join('; ');
                }
            }

            if (error.error.Message) {
                return error.error.Message;
            }

            if (!error.ok && error.status === 0 && error.url === null) {
                return 'connection to website failed';
            }

            if (error.error.error) {
                return error.error.error;
            }
        }

        return this.getHttpStatusMessage(error.status);

    }

    getErrorMessage(error: any): string {
        if (!error) {
            return 'unknown error';
        } else if (error.constructor === HttpErrorResponse) {
            return this.getHttpErrorMessage(error);
        } else if (this.getJsonErrorObject(error) != null) {
            const errorObj = this.getJsonErrorObject(error);

            return 'unknown error in jsonObj';
        } else if (error.message != null) {
            return error.message;
        } else {
            return 'unknown error';
        }
    }

    reportError(error: any, title?: string): ErrorItem {
        if (title === null) {
            title = 'not defined';
        }

        // console.dir(error);
        const errorItem: ErrorItem = new ErrorItem(this._nextId++, title, this.getErrorMessage(error), error);

        const errorCount: number = this._errors.length;
        this.errors.push(errorItem);
        this.errorChangeEvent.emit(new ErrorsState(errorItem, errorCount + 1));

        return errorItem;
    }

    dismissError(id: number) {
        const index = this._getIndexFromId(id);
        if (index >= 0) {
            this.errors.splice(index, 1);
            this.errorChangeEvent.emit(this.getErrorsState());
        }
    }

    getLastError(): ErrorItem {
        if (this._errors == null) {
            return null;
        }

        if (this._errors.length <= 0) {
            return null;
        }

        return this._errors[this._errors.length - 1];

    }

    getErrorsState(): ErrorsState {
        return new ErrorsState(this.getLastError(), this._errors.length);
    }

    getErrorFromId(id: number) {
        const index = this._getIndexFromId(id);
        if (index < 0) {
            return null;
        } else {
            return this._errors[index];
        }

    }
}
