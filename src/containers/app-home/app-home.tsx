import { Component, h, State, Element } from '@stencil/core';
import fbService,  { IFbService } from '../../providers/firebase.service';
import { defaultWidgetsSetting } from '../../providers/default-widgets';
import { getWidgetsAsArray, fadeIn, log } from '../../helpers';
import { owmApiKey, unsplashApiKey } from '../../global/app.env';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false
})
export class AppHome {

  private _timer: NodeJS.Timeout;
  public bgImg: string;
  private _service: IFbService = fbService;
  @State() time: Date = new Date();
  @State() userName: any;
  @State() uid: string;
  @State() error: Error;
  @State() widgets: {name: string, active: boolean}[] = null;
  @Element() el: HTMLElement;

  connectedCallback() { 
    // define time logic
    this._timer = setInterval(() => {
      this.time = new Date;
    }, 1000);   
    const user = this._service.auth.currentUser;
    this.uid = user.uid;
    this._service.ref('users').child(this.uid).on('value',snap => {
      const {displayName = null} = snap.val();
      const userName = displayName || user.displayName;
      log('userName',  userName);    
      this.userName = userName;
    })
    this._service.ref('widgets').child(this.uid).on('value', snap => {
      const datas = snap.val();
      const widgets = getWidgetsAsArray(datas);
      this.widgets = [...defaultWidgetsSetting.filter(w => !widgets.some(wi => wi.name === w.name)), ...widgets];
      log('this.widgets', this.widgets);
    })
  }

  async componentDidLoad() {
    // fetch bg image
    await this.fetchBG().catch(err => err);
    // dislpay container
    const container = this.el.querySelector('ion-grid');
    await fadeIn(container, 500);
    // focus input search if widget active
    const searchW = (this.widgets || defaultWidgetsSetting).find(w => w.name === 'search');
    if (!searchW?.active) return;
    const el: HTMLIonSearchbarElement = this.el.querySelector('search-component ion-searchbar');
    if (!el) return;
    el.setFocus();
  }

  disconnectedCallback() {
    this._service.ref('users').child(this.uid).off('value');
    this.clear(); 
  }

  clear() {
    clearInterval(this._timer);
    this.uid = null;
    this.userName = null;  
  }

  async fetchBG() {
    const queryUrl = 'https://api.unsplash.com/photos/random?count=1&client_id=';
    const client_id = unsplashApiKey;
    const container = this.el.querySelector('ion-grid');
    const data = await fetch(queryUrl + client_id).then(r => r.json()).then(r => r[0]).catch(err => {
      this.error = err; 
      return err;
    });
    if (!data?.urls) {
      this.error = new Error('not loaded');
      return false;
    }
    // add to bg as image cove
    const style = `url(${data.urls.regular}) center center no-repeat`;
    container.style.background = style;
    container.style.backgroundSize = 'cover'; 
    container.style.display = 'none';
    // preload Img
    let img = new Image();
    img.src = data.urls.regular;
    return new Promise((res) => {
      img.addEventListener('load', () => {
        log('Background img loaded!')
        res(true);
      });      
    })
  }

  render() {
    return [
      <ion-content>
        <ion-grid id="main">
          <ion-row class="ion-align-items-end">
            {(this.widgets?.some(w => w.active)) 
              ? <ion-col class="shadow ion-text-center">
                  {(this.error) ? <ion-chip color="danger" outline={true}>Error: {this.error.message}</ion-chip> : null}
                  {(this.widgets?.find(w => w.name === 'meteo')?.active) ? <meteo-component appId={owmApiKey} class="shadow"/> : null}
                  {(this.widgets?.find(w => w.name === 'time')?.active) ? <timer-component currentTime={this.time} /> : null}
                  {(this.widgets?.find(w => w.name === 'hello')?.active) ? <hello-component currentTime={this.time} userName={this.userName} /> : null}
                  {(this.widgets?.find(w => w.name === 'search')?.active) ? <search-component class="shadow" /> : null}
                </ion-col> 
              : null
            }
          </ion-row>
          <ion-row class="ion-align-items-end ion-text-center">
            <ion-col>
              <ion-button href="/settings" fill="clear" color="light" size="small" class="">settings</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>,
      // <ion-footer >
      //   <ion-toolbar class="no-border">
      //     <a href="">settings</a> 
      //   </ion-toolbar>
      // </ion-footer>
    ];
  }
}
