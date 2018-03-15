import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'hammerjs'

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

console.log('Production: ', environment.production)

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    let splashScreen = document.getElementById('splash-screen')
    splashScreen.remove()
    navigator.serviceWorker.register('/ngsw-worker.js')
  })
  .catch(err => console.log(err));
