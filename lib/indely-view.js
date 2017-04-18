'use babel';

export default class IndelyView {

  constructor(serializedState) {
    // Create root element
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    this.div = document.createElement('div');
    this.element = document.createElement('video');
    //this.element.setAttribute('controls', false);
    this.element.setAttribute('muted', true)
    this.element.setAttribute('width', 320);

    //element.classList.add('indely');

    // Create message element
    //const source = document.createElement('source');


    //source.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    this.element.autoplay = true;
    //source.type = 'video/mp4';
    this.div.appendChild(this.element);
  }

  setMyVideoStream(stream) {
      var url = window.URL || window.webkitURL;
      this.element.src = url ? url.createObjectURL(stream) : stream;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.div.remove();
  }

  getElement() {
    return this.div;
  }

}
