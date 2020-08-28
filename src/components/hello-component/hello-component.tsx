import { Component, Host, h, State, Prop } from '@stencil/core';

@Component({
  tag: 'hello-component',
  styleUrl: 'hello-component.css',
  shadow: true,
})
export class HelloComponent {

  @State() message: string = 'hello';
  @Prop() userName: string = 'fazio';
  @Prop() currentTime: Date;

  connectedCallback() {
    const currentTime = this.currentTime || new Date();
    const currentHour = currentTime.getHours();
    this.buildMessage(currentHour)
  } 

  buildMessage(currentHour) {
    // si l'heure est plus grande de 6h j'affiche bonjour
    if (currentHour > 6) {
      this.message = 'bonjour';
    }
    // si l'heure est plus grande de 12h et plus petit que 13h j'affiche bon appétit
    if (currentHour >= 12 && currentHour < 13) {
      this.message = 'bon appétit';
    } 
  }

  render() {
    const message = this.message.slice(0,1).toUpperCase() + this.message.slice(1).toLowerCase();
    const name = this.userName.slice(0,1).toUpperCase() + this.userName.slice(1).toLowerCase();
    return (
      <Host>
        <slot>
          <p>
            {message} <span>{name}</span>
          </p>
        </slot>
      </Host>
    );
  }

}
