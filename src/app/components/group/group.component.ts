import { GrupModel } from './../../models/grupModel';
import { FirebaseServiceService } from './../../services/FirebaseService.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { MytoastService } from 'src/app/services/mytoast.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  constructor(
    public fbServis: FirebaseServiceService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.GruplariListele();
  }

  uye = this.fbServis.AktifUyeBilgi;
  secGrup!: GrupModel;
  gruplar!: GrupModel[];
  modalBaslik = '';
  modal!: Modal;

  frm: FormGroup = new FormGroup({
    grupAdi: new FormControl(),
    id: new FormControl(),
  });

  GruplariListele() {
    this.fbServis.FetchAllGroups().subscribe((d) => {
      this.gruplar = d;
    });
  }

  GrupEkle() {
    var grup: GrupModel = this.frm.value;
    this.fbServis
      .AddGroup(grup)
      .pipe(
        this.htoast.observe({
          loading: 'Grup Oluşturuluyor...',
          success: 'Grup Oluşturuldu',
          error: 'Hata oluştu',
        })
      )
      .subscribe();
    this.modal.toggle();
    this.GruplariListele();
  }

  GrupDuzenle() {
    var newGrup: GrupModel = this.frm.value;
    console.log(newGrup.id);
    this.fbServis.EditGroup(newGrup).then((p) => {
      this.modal.toggle();
    });
  }

  GrupSil() {
    var newGrup: GrupModel = this.frm.value;
    console.log(newGrup.id);
    this.fbServis.DeleteGroup(newGrup).then((p) => {
      this.modal.toggle();
    });
  }
  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Grup Ekle';
    this.modal.show();
  }

  Duzenle(grup: GrupModel, el: HTMLElement) {
    this.frm.patchValue(grup);
    this.modalBaslik = 'Grup Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  Sil(grup: GrupModel, el: HTMLElement) {
    this.secGrup = grup;
    this.modalBaslik = 'Grup Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
}
