import { Component, Host, h, Prop, State } from '@stencil/core';
import { Geolocation } from '@capacitor/core';
import { IowMap } from './meteo.interface';
import { log } from '../../helpers';


@Component({
  tag: 'meteo-component',
  styleUrl: 'meteo-component.css',
  shadow: false, // to enable ionic style acces to this component
})
export class MeteoComponent {

  @Prop() appId: string;
  @State() datas: IowMap;

  async connectedCallback() {
    const coordinates = await this._getCurrentPosition();
    await this._getByLatLong(coordinates.coords);
  }

  private async _getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    log('Current', coordinates);
    return coordinates;
  }


  async _getByLatLong({latitude, longitude}: {latitude: number, longitude: number}) {
    const url = this._getApiUrl({latitude, longitude});
    this.datas = await fetch(url).then(r => r.json()).catch(err => err);
    log(this.datas);
  }

  private _getApiUrl({latitude, longitude}: {latitude: number, longitude: number}) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const apiArgs = `lat=${latitude}&lon=${longitude}&units=metric`;
    const url = `${apiUrl}?${apiArgs}&appid=${this.appId}`;
    return url;
  }

  render() {
    if (this.datas) {
      return (
        <Host>
          <ion-grid id="meteoCmp" fixed={true} class="ion-text-right ion-no-padding">
            <ion-row class="ion-align-items-center ion-no-padding">
              <ion-col class="ion-no-padding">
                <ion-text>
                  <p id="temp">{this.datas?.main.temp?.toPrecision(3)}°C</p>
                </ion-text>
              </ion-col>
              <ion-col size="4" class="ion-no-padding">
                <img src={'http://openweathermap.org/img/wn/' + this.datas?.weather[0].icon + '@2x.png'} /> 
              </ion-col>
            </ion-row>
            <ion-row class="ion-align-items-top">
              <ion-col class="ion-padding-end">
                <ion-text>
                  <p id="cityName">{this.datas?.name}</p>
                </ion-text>
              </ion-col>
            </ion-row>
          </ion-grid>
          <slot></slot>
        </Host>
      );
    } else {
      return (
        <Host>
          <slot>
          <ion-spinner></ion-spinner>
          </slot>
        </Host>
      )
    }
  }

}
