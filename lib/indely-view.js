'use babel';

export default class IndelyView {

  constructor(serializedState) {
    // Create root element
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    this.div = document.createElement('div');
    this.element = document.createElement('video');
    this.element.setAttribute('muted', true)
    this.element.setAttribute('width', 320);

    this.divChat = document.createElement('div');
    this.divChat.setAttribute('id','chat');

    this.ol = document.createElement('ol');
    this.ol.setAttribute('id', 'chat-box');

    this.divChat.appendChild(this.ol);

    this.element.autoplay = true;

    this.div.appendChild(this.element);
    this.div.appendChild(this.divChat);
  }

  setMyVideoStream(stream) {
      var url = window.URL || window.webkitURL;
      this.element.src = url ? url.createObjectURL(stream) : stream;
  }

  addMessage(msg){
     var li = document.createElement('li');
     li.setAttribute('class', 'other');

     li.innerHTML = '<div class="msg">\
       <div class="user">'+ msg.name +'</div>\
       <p>'+ msg.text +'</p>\
       <time>'+ msg.time +'</time>\
     </div>';

     var chatBox = document.getElementById('chat-box');
     chatBox.appendChild(li);
     chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
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
