import { GrupModel } from 'src/app/models/grupModel';
import { UyeModel } from './../../models/uyeModel';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { FirebaseServiceService } from 'src/app/services/FirebaseService.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  uye = this.fbServis.AktifUyeBilgi;
  uyeler!: UyeModel[];
  gruplar!: GrupModel[];
  grup!: GrupModel;
  modal!: Modal;
  modalBaslik: string = '';
  secUye!: UyeModel;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    displayName: new FormControl(),
    kullaniciSoyad: new FormControl(),
    kullaniciKadi: new FormControl(),
    kullaniciEmail: new FormControl(),
    kullaniciSifre: new FormControl(),
    kullaniciAdminMi: new FormControl(),
    kullaniciKayitTarihi: new FormControl(),
    grupId : new FormControl(),
  });

  constructor(
    public fbServis: FirebaseServiceService,
    public toast: MytoastService,
    public htoast: HotToastService,
    public router: Router
  ) {}

  ngOnInit() {
    this.UyeleriListele();
    this.GruplariListele();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Üye Ekle';
    this.modal.show();
  }
  Duzenle(uye: UyeModel, el: HTMLElement) {
    this.secUye = uye;
    this.frm.patchValue(uye);
    this.modalBaslik = 'Üye Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(uye: UyeModel, el: HTMLElement) {
    this.secUye = uye;
    this.modalBaslik = 'Üye Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  GruplariListele() {
    this.fbServis.FetchAllGroups().subscribe((d) => {
      this.gruplar = d;
    });
  }

  UyeleriListele() {
    this.fbServis.ListOfMembers().subscribe((d) => {
      this.uyeler = d;
    });
  }

  UyeEkle() {
    var uye: UyeModel = this.frm.value;
    var tarih = new Date();
    uye.kullaniciKayitTarihi = tarih.getTime().toString();
    this.fbServis.KayitOl(uye.kullaniciEmail!, uye.kullaniciSifre!);
    this.fbServis
      .UyeEkle(uye)
      .pipe(
        this.htoast.observe({
          loading: 'Üye Oluşturuluyor...',
          success: 'Üye Oluşturuldu',
          error: 'Hata oluştu',
        })
      )
      .subscribe();
  }

  UyeDuzenle(secliliUye: UyeModel) {
    var newUye: UyeModel = this.frm.value;
    console.log(secliliUye.uid);
    console.log(newUye.uid);
    newUye.uid = secliliUye.uid;
    this.fbServis.EditMember(newUye).then((p) => {
      this.modal.toggle();
    });
  }

  UyeSil() {
    this.fbServis.DeleteMember(this.secUye).then((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Üye Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.UyeleriListele();
      this.modal.toggle();
    });
  }
}
