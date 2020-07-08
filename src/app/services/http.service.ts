import { Observable, throwError } from 'rxjs';
import { tap, flatMap, map, catchError } from 'rxjs/internal/operators';

import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { StorageService } from './storage.service';
import { ErrorService } from './error.service';
import { AppSettings } from './app.settings';
import { urlEncode } from '~/app/infrastructure/utilitities';

export class ServerLogin {

    // tslint:disable-next-line:variable-name
    grant_type = 'password';
    username: string;
    password: string;
    // tslint:disable-next-line:variable-name
    client_id: string;

}

export interface ServerToken {

    token_type: string;
    refresh_token: string;
    userName: string;
    access_token: string;
    expires_in: number;
    '.expires': string;
    '.issued': string;
    'as:client_id': string;
    firstName: string;
    lastName: string;
    cardNumber: string;
    ceo: string;
    admin: string;
    driver: string;
    waiter: string;

}

export class ClientRefreshToken {

    // tslint:disable-next-line:variable-name
    grant_type = 'refresh_token';
    // tslint:disable-next-line:variable-name
    refresh_token: string;
    // tslint:disable-next-line:variable-name
    client_id: string;
}

export class ServerRefreshToken {

    // tslint:disable-next-line:variable-name
    token_type: string;
    // tslint:disable-next-line:variable-name
    refresh_token: string;
    // tslint:disable-next-line:variable-name
    access_token: string;
    // tslint:disable-next-line:variable-name
    expires_in: number;
    '.expires': string;
    '.issued': string;
    'as:client_id': string;
    firstName: string;
    lastName: string;
    cardNumber: string;
    ceo: string;
    admin: string;
    driver: string;
    waiter: string;
}

export class RefreshToken {

    constructor(serverToken: ServerRefreshToken) {
        this.access_token = serverToken.access_token;
        this.refresh_token = serverToken.refresh_token;
        this.token_type = serverToken.token_type;
        this.expires_in = serverToken.expires_in;
        this.expires = serverToken['.expires'];
        this.issued = serverToken['.issued'];
        this.client_id = serverToken['as:client_id'];
        this.firstName = serverToken.firstName;
        this.lastName = serverToken.lastName;
        this.cardNumber = serverToken.cardNumber;
        this.ceo = serverToken.ceo;
        this.admin = serverToken.admin;
        this.driver = serverToken.driver;
        this.waiter = serverToken.waiter;

    }

    // tslint:disable-next-line:variable-name
    access_token: string;
    // tslint:disable-next-line:variable-name
    token_type: string;
    // tslint:disable-next-line:variable-name
    expires_in: number;
    // tslint:disable-next-line:variable-name
    refresh_token: string;
    // tslint:disable-next-line:variable-name
    client_id: string;
    issued: string;
    expires: string;
    firstName: string;
    lastName: string;
    cardNumber: string;
    ceo: string;
    admin: string;
    driver: string;
    waiter: string;

}

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    set token(value: RefreshToken) {
        this.fToken = value;
        this.storageService.setObject(this.fTokenStorageKey, value);
    }

    // temp for diagnotic
    get token(): RefreshToken {
        return this.fToken;
    }

    private get url(): string {
        return this.appSettings.system.url;
    }

    private get apiUrl(): string {
        return this.appSettings.system.apiUrl;
    }

    get clientId(): string {
        return this.appSettings.system.clientId;
    }

    private fAccessTokenDeniedMessage = '{"Message":"Authorization has been denied for this request."}';
    private fTokenUri = 'token';
    private fToken: RefreshToken = null;
    private fTokenStorageKey = 'token';
    private fTokenValidUri = 'api/token';

    private responseIsOk(response: HttpErrorResponse) {
        return response.status >= 200 && response.status < 300;
    }

    private getDefaultRequestHeaders(form: boolean) {

        let headers: HttpHeaders = null;

        if (form) {

            if (this.fToken != null) {
                headers = new HttpHeaders()
                    .append('Authorization', 'Bearer ' + this.fToken.access_token)
                    .append('Content-Type', 'application/x-www-form-urlencoded');

            } else {

                headers = new HttpHeaders()
                    .append('Content-Type', 'application/x-www-form-urlencoded');

            }

        } else {

            if (this.fToken != null) {
                headers = new HttpHeaders()
                    .append('Authorization', 'Bearer ' + this.fToken.access_token)
                    .append('Content-Type', 'application/json');

            } else {

                headers = new HttpHeaders()
                    .append('Content-Type', 'application/json');

            }

        }

        return headers;

    }

    private handleError(error: HttpErrorResponse) {

        return throwError(error);

    }

    private _httpPost(url: string, content: string, form: boolean): Observable<any> {

        return this.http.post(url, content, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(flatMap(() => {
                                        return this.http.post(url, content,
                                            {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {

                        return this.handleError(error);
                    }
                })
            );

    }

    private _httpPostWithModel<T>(url: string, content: string, form: boolean): Observable<T> {

        return this.http.post<T>(url, content, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(flatMap(() => {
                                        return this.http.post<T>(url, content,
                                            {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {

                        return this.handleError(error);
                    }
                })
            );

    }

    private _httpPut(url: string, content: string, form: boolean): Observable<any> {

        return this.http.put(url, content, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(
                                    flatMap(() => {
                                        return this.http.put(url, content,
                                            {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {
                        return this.handleError(error);
                    }
                })
            );
    }

    private _httpPutWithModel<T>(url: string, content: string, form: boolean): Observable<T> {

        return this.http.put<T>(url, content, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(
                                    flatMap(() => {
                                        return this.http.put<T>(url, content,
                                            {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {
                        return this.handleError(error);
                    }
                })
            );
    }

    private _httpGet(url: string, form: boolean): Observable<any> {

        return this.http.get(url, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(
                                    flatMap((data) => {
                                        return this.http.get(url, {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {

                        return this.handleError(error);
                    }
                })
            );
    }

    private _httpGetWithModel<T>(url: string, form: boolean): Observable<T> {

        return this.http.get<T>(url, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {

                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(
                                    flatMap(() => {
                                        return this.http.get<T>(url, {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {
                        return this.handleError(error);
                    }
                })
            );

    }

    private _httpDelete(url: string, form: boolean): Observable<any> {

        return this.http.delete(url, {headers: this.getDefaultRequestHeaders(form)})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        if (!this.fToken) {
                            return this.handleError(error);
                        } else {
                            return this.refreshToken()
                                .pipe(
                                    flatMap(() => {
                                        return this.http.get(url, {headers: this.getDefaultRequestHeaders(form)});
                                    })
                                );
                        }
                    } else {
                        return this.handleError(error);
                    }
                })
            );

    }

    constructor(private location: Location,
                private storageService: StorageService,
                private errorService: ErrorService,
                private http: HttpClient,
                private appSettings: AppSettings) {

        this.fToken = this.storageService.getObject(this.fTokenStorageKey);

    }

    refreshToken() {

        const content = new ClientRefreshToken();
        content.refresh_token = this.fToken.refresh_token;
        content.client_id = this.clientId;

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post<ServerRefreshToken>(this.url + this.fTokenUri, urlEncode(content), {headers})
            .pipe(
                tap((token) => {
                    this.token = new RefreshToken(token);
                })
            );

    }

    formPostWithoutBaseUrl(url: string, content: object): Observable<any> {

        return this._httpPost(this.url + url, urlEncode(content), true);

    }

    httpPost(url: string, content: any): Observable<any> {

        return this._httpPost(this.apiUrl + this.location.prepareExternalUrl(url).substr(1),
            JSON.stringify(content), false);

    }

    httpPostWithModel<T>(url: string, content: object): Observable<T> {

        return this._httpPostWithModel(this.apiUrl + this.location.prepareExternalUrl(url).substr(1),
            JSON.stringify(content), false);

    }

    formPost(url: string, content: any) {

        return this._httpPost(this.apiUrl + this.location.prepareExternalUrl(url).substr(1),
            urlEncode(content), true);

    }

    httpGet(url: string) {

        return this._httpGet(this.apiUrl + this.location.prepareExternalUrl(url).substr(1), false);

    }

    httpGetWithModel<T>(url: string): Observable<T> {

        return this._httpGetWithModel<T>(this.apiUrl + this.location.prepareExternalUrl(url).substr(1), false);

    }

    httpPut(url: string, content: any) {

        return this._httpPut(this.apiUrl + this.location.prepareExternalUrl(url).substr(1),
            JSON.stringify(content), false);

    }

    httpPutWithModel<T>(url: string, content: object): Observable<T> {

        return this._httpPutWithModel<T>(this.apiUrl + this.location.prepareExternalUrl(url).substr(1),
            JSON.stringify(content), false);

    }

    httpDelete(url: string) {

        return this._httpDelete(this.apiUrl + this.location.prepareExternalUrl(url).substr(1), false);

    }

    loginUser(userName: string, password: string) {
        const content = new ServerLogin();
        content.username = userName;
        content.password = password;
        content.client_id = this.clientId;

        return this.formPostWithoutBaseUrl(this.fTokenUri, content)
            .pipe(
                map((response) => response as ServerToken),
                tap((data) => this.token = new RefreshToken(data))
            );
    }

    tokenIsValid() {

        return this._httpPost(this.url + this.fTokenValidUri, null, false);

    }

}
