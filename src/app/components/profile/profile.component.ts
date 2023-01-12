import { UyeModel } from 'src/app/models/uyeModel';
import { DosyaModel } from './../../models/dosyaModel';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { FirebaseServiceService } from 'src/app/services/FirebaseService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  uye = this.fbServis.AktifUyeBilgi;
  currentUser!: UyeModel;
  dosyalar!: DosyaModel[];
  uyeler!: UyeModel[];
  mevcutDosyalar: DosyaModel[] = [];
  oylesineArray: DosyaModel[] = [];
  oylesineArray2: UyeModel[] = [];
  sonuc: Sonuc = new Sonuc();
  modal!: Modal;
  secDosya!: DosyaModel;
  localStatus!: number;
  modalBaslik: string = '';
  localId: number = 3;
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    dosyaAdi: new FormControl(),
    photo: new FormControl(),
    dosyaBoyut: new FormControl(),
    dosyaBoyutTuru: new FormControl(),
    usersId: new FormControl(),
    dosyaAdminOzelMi: new FormControl(),
    dosyaYuklenmeTarihi: new FormControl(),
    dosyaDuzenlenmeTarihi: new FormControl(),
    dosyaYukleyenKadi: new FormControl(),
  });
  constructor(
    public fbServis: FirebaseServiceService,
    public toast: MytoastService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.UyeleriListele();
    this.DosyalariListele();
    this.route.params.subscribe((p: any) => {
      this.localId = p.profileId;
    });
  }

  UyeleriListele() {
    this.fbServis.ListOfUsers().subscribe((d) => {
      this.uyeler = d;
      for (let index = 0; index < this.uyeler.length; index++) {
        if (this.uyeler[index].uid?.toString() == this.localId.toString()) {
          this.oylesineArray2.push(this.uyeler[index]);
        }
      }
      this.currentUser = this.oylesineArray2[0];
    });
  }

  DosyalariListele() {
    this.fbServis.ListOfFiles().subscribe((d) => {
      this.mevcutDosyalar = d;
      for (let index = 0; index < this.mevcutDosyalar.length; index++) {
        if (this.mevcutDosyalar[index].userId == this.localId) {
          this.oylesineArray.push(this.mevcutDosyalar[index]);
        }
      }
      this.dosyalar = this.oylesineArray;
    });
  }

  DosyaEkleDuzenle() {
    var newDosya: DosyaModel = this.frm.value;
    this.fbServis.DeleteFile(newDosya).then((p) => {
      this.modal.toggle();
    });
  }

  DosyaSil(dosya: DosyaModel) {
    this.fbServis.DeleteFile(this.secDosya).then((d) => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = 'Dosya Silindi';
      this.toast.ToastUygula(this.sonuc);
      this.dosyalar = [];
      this.UyeleriListele();
      this.modal.toggle();
    });
  }

  DosyaIndir() {
    this.sonuc.islem = true;
    this.sonuc.mesaj = 'Dosya İndiriliyor';
    this.toast.ToastUygula(this.sonuc);
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Dosya Ekle';
    this.modal.show();
  }
  Duzenle(dosya: DosyaModel, el: HTMLElement) {
    this.frm.patchValue(dosya);
    this.modalBaslik = 'Dosya Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(dosya: DosyaModel, el: HTMLElement) {
    this.secDosya = dosya;
    this.modalBaslik = 'Dosya Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
}
