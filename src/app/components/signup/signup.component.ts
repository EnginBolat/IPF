import { FirebaseServiceService } from './../../services/FirebaseService.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    public fbServis: FirebaseServiceService,
    public htoast: HotToastService,
    public router: Router
  ) {}

  ngOnInit() {}

  UyeOl(
    ad: string,
    soyad: string,
    kadi: string,
    email: string,
    parola: string
  ) {
    var tarih = new Date();
    this.fbServis
      .KayitOl(email, parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbServis.AddMember({
            uid: uid,
            displayName: ad,
            kullaniciSoyad: soyad,
            kullaniciKadi: kadi,
            kullaniciEmail: email,
            kullaniciSifre: parola,
            kullaniciAdminMi: 0,
            kullaniciKayitTarihi: tarih.getDate().toString(),
            grupId: "1",
          })
        ),
        this.htoast.observe({
          success: 'Tebrikler Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
