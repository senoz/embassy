import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const users = JSON.parse(localStorage.getItem('currentUser')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/registration') && method === 'POST':
                    return register();
                case url.endsWith('/login') && method === 'POST':
                    return authenticate();
                default:
                    return next.handle(request);
            }
        }

        function register() {
            const user = body;

            if (users.find(x => x.userName === user.userName)) {
                return error('Username "' + user.userName + '" is already taken');
            }

            // user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function authenticate() {
            const { userName, password } = body;
            const user = users.find(x => x.userName === userName && x.password === password);
            if (!user) {
                return error('Username or Password is incorrect');
            }
            return ok({
                userName: user.userName,
                name: user.name,
                token: 'fake-jwt-token'
            });
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message) {
            return throwError({ error: { message } });
        }

    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
