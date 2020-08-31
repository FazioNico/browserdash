import { Component, Host, h } from '@stencil/core';
import { log } from '../../helpers';

@Component({
  tag: 'search-component',
  styleUrl: 'search-component.css',
  shadow: false,
})
export class SearchComponent {

  handleEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (event?.keyCode !== 13) return;
    const value = event.target['value'];
    if (!value) return;
    log(value);
    this._onGoToLink(event,'https://www.google.ch/search?q=' + value)
    // clean input value after go search
    event.target['value'] = '';
    // unfocus input element after go search
    (event.target as any)?.blur();
  }

  private _onGoToLink(event,url){
    event.preventDefault();
    let win = window.open(url, '_blank');
    win.focus();
  }

  render() {
    return (
      <Host>
        <ion-searchbar onKeyUp={(e) => this.handleEvent(e)} placeholder="" spellcheck={true} mode="ios"></ion-searchbar>
        <slot></slot>
      </Host>
    );
  }

}
