import { Component, h, State } from '@stencil/core';
import fbService, { IFbService } from '../../providers/firebase.service';
import { log } from '../../helpers';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {

  fbService: IFbService;
  @State() user: any = undefined;
  
  connectedCallback() {
    this.fbService = fbService;
    this.fbService.auth.onAuthStateChanged(async(user) => {
      if (user) {
        // User is signed in.
        log('user:', user);
        this.user = user;
        const userData = await this.fbService.ref('users').child(user.uid).once('value').then(r => r.val())
        document.body.classList.toggle('dark', userData?.settings?.darkMode); 
      } else {
        // No user is signed in.
        log('not loged', user);
        this.user = null;
        document.body.classList.toggle('dark', true); 
      }
    });
  }

  async signin() {
    log('signin...');
    await this.fbService.signIn()
  }
  
  render() {
    log('user->', this.user);
    if (this.user)  {
      return (
        <ion-app>
          <ion-router useHash={false}>
            <ion-route url="/" component="app-home"/>
            <ion-route url="/settings" component="app-settings" />
            <ion-route url="/profile/:name" component="app-profile" />
          </ion-router>
          <ion-nav/>
        </ion-app>
      );
    } else if (this.user === null) {
      return (
        <ion-app>
          <ion-content>
            <ion-button onClick={() => this.fbService.signIn()}>login with Google</ion-button>
          </ion-content>
        </ion-app>
      );
    } else  {
      return (
        <ion-app>
          <ion-content class="ion-text-center">
            <ion-spinner></ion-spinner>
          </ion-content>
        </ion-app>
      );
    }
    
  }
}
