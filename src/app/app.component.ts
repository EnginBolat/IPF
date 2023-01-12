import { FirebaseServiceService } from './services/FirebaseService.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  uye = this.fbServis.AktifUyeBilgi;

  constructor(
    public fbServis: FirebaseServiceService,
    public router: Router
  ) {

  }

  OturumKapat() {
    this.fbServis.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
