import { Injectable } from '@angular/core';
import * as jwt from 'jose'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

//   constructor() { }

//   decodeJwt(token: string) {
//     return jwt.jwtDecrypt()
//   }

//   isJwtNotExpired(decodedToken: any): boolean {
//   if (!decodedToken.exp) {
//     return true
//   }

//   const now = new Date().getTime() / 1000
//   return now < decodedToken.exp
// }

}
