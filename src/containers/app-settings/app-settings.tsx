import { Component, h, State } from '@stencil/core';
import fbService, { IFbService } from '../../providers/firebase.service';
import { defaultWidgetsSetting } from '../../providers/default-widgets';
import { getWidgetsAsArray, compareValues, log } from '../../helpers/utils';



@Component({
  tag: 'app-settings',
  styleUrl: 'app-settings.css',
  shadow: false,
})
export class AppSettings {

  fbService: IFbService = fbService;
  @State() displayName: string
  @State() widgets: any[];
  @State() darkModeEnable: boolean;

  connectedCallback() {   
    if (!this.fbService.auth.currentUser) {
      return window.location.href = '/';
    }
  }

  async componentWillLoad() {
    const user = this.fbService.auth.currentUser;
    const userData = await this.fbService.ref('users').child(user.uid).once('value').then(r => r.val())
    const widgetsData = await this.fbService.ref('widgets').child(user.uid).once('value').then(r => r.val())
    // log('widgetsData', widgetsData);
    this.displayName = userData?.displayName || user.displayName;
    // log('userData', this.displayName);
    const widgets = getWidgetsAsArray(widgetsData);
    this.widgets = [
      ...defaultWidgetsSetting.filter(
        w => w.enabled && !widgets.some(wi => wi.name === w.name)
      ),
      ...widgets
    ];
    // log('this.widgets', this.widgets);
    this.darkModeEnable = userData?.settings?.darkMode;
    document.body.classList.toggle('dark', this.darkModeEnable);
    log('userData',  userData?.settings?.darkMode);
  }

  handleChange(e: any, widget = false) {
    const {
      name: key = null, 
      value = null,
      checked = null
    } = e.target;
    const data = {[key]: (!widget) ? value : checked};
    log(data);
    const user = this.fbService.auth.currentUser;
    this.fbService.ref((widget) ? 'widgets' : 'users').child(user.uid).child(key).set((widget) ? checked :  value )
  }

  handleOptions(widget) {
    log(widget);
  }

  toggleDarkMode(e) {
    this.darkModeEnable = e.detail.checked;
    document.body.classList.toggle('dark', this.darkModeEnable);
    this.fbService.ref('users')
                  .child(this.fbService.auth.currentUser.uid)
                  .child('settings').update({darkMode: this.darkModeEnable})
                  .catch(err => {
                    log('Error: ', err);
                    this.darkModeEnable = !this.darkModeEnable;
                  })
  }

  render() {
    const widgets = this.widgets.sort(compareValues('name'));
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/" />
          </ion-buttons>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-list-header>
                  <ion-label>Temeplate</ion-label>
                </ion-list-header>
                <ion-item lines="full">
                  <ion-icon slot="start" name="moon"></ion-icon>
                  <ion-label>
                    Toggle Dark Theme
                  </ion-label>
                  <ion-toggle id="themeToggle" slot="end" onIonChange={(e) => this.toggleDarkMode(e)} checked={this.darkModeEnable}></ion-toggle>
                </ion-item>
              </ion-list>

              <ion-list>
                <ion-list-header>
                  <ion-label>User Informations</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label>Display Name:</ion-label>
                  <ion-input name="displayName" value={this.displayName} onInput={(e) => this.handleChange(e)}></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label>Email:</ion-label>
                  <ion-input disabled={true} name="email" value={this.fbService.auth.currentUser.email} onInput={(e) => this.handleChange(e)}></ion-input>
                </ion-item>
                <ion-item>
                  <ion-button onClick={async () => await this.fbService.auth.signOut()} color="danger">
                    Logout
                  </ion-button>
                </ion-item>
              </ion-list>
              {/* <ion-button size="small">save</ion-button> */}
            </ion-col>
            <ion-col>
              <ion-list>
                <ion-list-header>
                  <ion-label>Widgets</ion-label>
                </ion-list-header>
                {widgets.map(w => {
                  return (
                    <ion-item>
                      <ion-label>{defaultWidgetsSetting.find(item => item.name === w.name)?.displayName}</ion-label>
                      <ion-toggle name={w.name} onIonChange={(e) => this.handleChange(e, true)} checked={w.active}></ion-toggle>
                      <ion-buttons>
                        <ion-button onClick={() => this.handleOptions(w)}>
                          <ion-icon name="ellipsis-vertical"></ion-icon>
                        </ion-button>
                      </ion-buttons>
                    </ion-item>
                  )
                })}
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    ];
  }

}
