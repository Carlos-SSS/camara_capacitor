import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  fotos: string[] = [];
  imageElement: any;

  constructor(private alertController: AlertController) {}

  ngOnInit(): void {
    this.getFotos().then(fotos => this.fotos = fotos);
  }


  // Recuperar Fotos del Preferences
  async getFotos(){
    const fotos = await Preferences.get({key: 'fotos'});
    return JSON.parse(fotos.value || '[]');
  }




  // Abrir Camara
  async abrirCamera () {
    const image = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });

    this.imageElement = image.dataUrl;
    this.fotos.push(this.imageElement);
    await Preferences.set({ key: 'fotos', value: JSON.stringify(this.fotos) });
  };




  // Eliminar Foto
  async eliminarFoto(fotoPath: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Foto',
      message: '¿Deseas eliminar esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Eliminar la foto del array
            const index = this.fotos.indexOf(fotoPath);
            if (index !== -1) {
              this.fotos.splice(index, 1);
              await Preferences.set({ key: 'fotos', value: JSON.stringify(this.fotos) });
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
