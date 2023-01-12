import { GrupModel } from './../../models/grupModel';
import { FirebaseServiceService } from './../../services/FirebaseService.service';
import { UyeModel } from './../../models/uyeModel';
import { DosyaModel } from './../../models/dosyaModel';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonucModel';
import { MytoastService } from 'src/app/services/mytoast.service';
import { HotToastService } from '@ngneat/hot-toast';
import { concat, concatMap } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  uye = this.fbServis.AktifUyeBilgi;
  dosyalar!: DosyaModel[];
  uyeler!: UyeModel[];
  gruplar!: GrupModel[];
  modal!: Modal;
  modalBaslik: string = '';
  secDosya!: DosyaModel;
  sonuc: Sonuc = new Sonuc();
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
    dosyaUrl: new FormControl(),
    grupId: new FormControl(),
  });

  constructor(
    public fbServis: FirebaseServiceService,
    public htoast: HotToastService,
  ) {}

  ngOnInit() {
    this.DosyalariListele();
    this.GruplariListele();
  }

  GruplariListele() {
    this.fbServis.FetchAllGroups().subscribe((d) => {
      this.gruplar = d;
    });
  }

  DosyalariListele() {
    this.fbServis.ListOfFiles().subscribe((d) => {
      this.dosyalar = d;
    });
  }

  DosyaDuzenle() {
    var newDosya: DosyaModel = this.frm.value;
    this.fbServis.EditFile(newDosya).then((p) => {
      this.modal.toggle();
    });
  }

  DosyaEkleDuzenle(event: any, user: UyeModel) {
    var dosya: DosyaModel = this.frm.value;
    var tarih = new Date();
    dosya.dosyaYuklenmeTarihi = tarih.getTime().toString();
    (dosya.dosyaYukleyenKadi = user.displayName ?? ''),
      (dosya.dosyaDuzenlenmeTarihi = tarih.getTime().toString());
    if (dosya.dosyaAdminOzelMi == null) {
      dosya.dosyaAdminOzelMi = 0;
    }
    if (dosya.dosyaBoyutTuru == null) {
      dosya.dosyaBoyutTuru = 0;
    }
    this.fbServis
      .UploadImage(
        event.target.files[0],
        `images/profile/${user.uid}`,
        dosya,
        event
      )
      .pipe(
        this.htoast.observe({
          loading: 'Dosya Yükleniyor...',
          success: 'Dosya yüklendi',
          error: 'Hata oluştu',
        }),
        concatMap((foto) =>
          this.fbServis.UploadFile(this.frm.value, foto, event)
        )
      )
      .subscribe();
  }

  DosyaIndir(dosya: DosyaModel) {
    this.fbServis.DownloadFile(dosya);
  }

  DosyaSil(dosya: DosyaModel) {
    this.fbServis.DeleteFile(dosya).then((p) => {});
  }

  Duzenle(dosya: DosyaModel, el: HTMLElement) {
    this.frm.patchValue(dosya);
    this.modalBaslik = 'Dosya Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Dosya Ekle';
    this.modal.show();
  }

  Sil(dosya: DosyaModel) {
    this.fbServis.DeleteFile(dosya).then(() => {});
  }
}
