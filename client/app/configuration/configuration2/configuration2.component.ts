import { Component, Input } from '@angular/core';
import en from 'client/app/shared/language/en';
import { Config } from 'client/app/shared/models/configurations/config.model';
import { DisplayUtilsService } from 'client/app/shared/services/display-utils.service';
import { EnvService } from 'client/app/shared/services/env.service';

@Component({
  selector: 'app-configuration2',
  templateUrl: './configuration2.component.html',
  styleUrls: ['./configuration2.component.scss']
})
export class Configuration2Component {

  l = en

  dbPassword: string = ''
  relN!: string
  rel: string = this.l.configuration.step2.veryWeak

  constructor(private displayUtils: DisplayUtilsService, private envService: EnvService) { }

  ngOnInit() {
    this.envService.get().subscribe({ next: (env) => { this.l = env.language; this.onInputChange() } })

  }

  onInputChange() {

    var l = 0
    if (this.dbPassword.length >= 12) {
      l = 1
    }

    var u = 0
    if (this.dbPassword.match(/^(?=.*[a-z])(?=.*[A-Z]).+$/)) {
      u = 1
    }

    var n = 0
    if (this.dbPassword.match(/^(?=.*\d).+$/)) {
      n = 1
    }

    var s = 0
    if (this.dbPassword.match(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).+$/)) {
      s = 1
    }

    switch (l + u + n + s) {
      case 0:
        this.rel = this.l.configuration.step2.veryWeak
        this.relN = 0 + ''
        break
      case 1:
        if (this.dbPassword.length >= 5) {
          this.rel = this.l.configuration.step2.weak
          this.relN = 1 + ''
        }
        break
      case 2:
        if (this.dbPassword.length >= 8) {
          this.rel = this.l.configuration.step2.ok
          this.relN = 2 + ''
        }
        break
      case 3:
        if (this.dbPassword.length >= 8) {
          this.rel = this.l.configuration.step2.strong
          this.relN = 3 + ''
        }
        break
      case 4:
        if (this.dbPassword.length >= 12) {
          this.rel = this.l.configuration.step2.veryStrong
          this.relN = 4 + ''
        }
        break
      default:
        break;
    }
  }


  generatePassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numericChars = '0123456789'
    const specialChars = '!@#$%^&*()_+\-=\[\]{};\': \"\\|,.<>\/?'
    let password = ''

    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
    password += numericChars.charAt(Math.floor(Math.random() * numericChars.length))
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

    while (password.length < 16) {
      const charSet = uppercaseChars + lowercaseChars + numericChars + specialChars
      password += charSet.charAt(Math.floor(Math.random() * charSet.length))
    }

    let chars = password.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    password = chars.join('');

    this.dbPassword = password

    this.onInputChange()

  }

}
