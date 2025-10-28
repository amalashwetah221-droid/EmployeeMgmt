import { HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req,next)=>{
    const authService:AuthService = inject(AuthService);
    
    let token = authService.getToken();
    // console.log(token);
    if(token!=null){
        let authReq = req.clone({
            setHeaders:{
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }
    return next(req);
}