import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services/authenticate.service';
import { UsersService } from '../services/users.service';
import { Users } from '../models/users.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticateService,
        private userService: UsersService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userId = localStorage.getItem('userId');
        let currentUser;
        this.userService.getUserById(userId).subscribe(data => {
            if (data.length) {
                currentUser = data[0].payload.doc.data() as Users;
                if (currentUser && currentUser.token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${currentUser.token}`
                        }
                    });
                }
            }
        });
        return next.handle(request);
    }
}
