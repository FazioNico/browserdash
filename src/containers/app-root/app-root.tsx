import { Component, h, State } from '@stencil/core';
import fbService, { IFbService } from '../../providers/firebase.service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {

  fbService: IFbService;
  @State() user: any = undefined;
  
  connectedCallback() {
    document.body.classList.toggle('dark', true); 
    this.fbService = fbService;
    this.fbService.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('user:', user);
        this.user = user;
      } else {
        // No user is signed in.
        console.log('not loged', user);
        this.user = null
      }
    });
  }

  signin() {
    console.log('signin...');
    this.fbService.signIn()
  }
  
  render() {
    console.log('user->', this.user);
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
