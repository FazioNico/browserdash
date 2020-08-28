import { Component, Host, h, State, Prop } from '@stencil/core';

@Component({
  tag: 'timer-component',
  styleUrl: 'timer-component.css',
  shadow: true,
})
export class Timer {

  private _timer: NodeJS.Timeout;
  @State() time: Date = new Date();
  @Prop() currentTime: Date;

  connectedCallback() {
    if (this.currentTime) return;
    this._timer = setInterval(() => {
      this.time = new Date;     
    }, 1000);
  }

  disconnectedCallback() {
    this.clear();
  }

  clear() {
    clearInterval(this._timer);
  }

  render() {
    const time = (this.currentTime||this.time)
        .toLocaleTimeString()
        .split(':')
        .slice(0,2)
        .join(':');
    return (
      <Host>
        <slot>{time}</slot>
      </Host>
    );
  }
}
