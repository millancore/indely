'use babel';

import IndelyView from './indely-view';
import rtcClient from './rtcClient';
import { CompositeDisposable } from 'atom';
import io from 'socket.io-client';
import uuid from 'uuid/v1';

export default {

  indelyView: null,
  rightPanel: null,
  subscriptions: null,
  localStream: null,
  client: null,
  localId: null,

  activate(state) {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    this.indelyView = new IndelyView(state.indelyViewState);
    this.rightPanel = atom.workspace.addRightPanel({
      item: this.indelyView.getElement(),
      visible: false
    });


    //console.log(navigator.getUserMedia);
    /*this.modalPanel = atom.workspace.addModalPanel({
      item: this.indelyView.getElement(),
      visible: false
    });*/

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'indely:toggle': () => this.toggle(),
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'indely:close': () => this.close(),
    }));
  },

initLocalStream() {

    this.localId = uuid();

    let socket = io('http://localhost:5000');

    this.client = new rtcClient(socket);

    let constraints = {video: true, audio: true};

    atom.workspace.observeTextEditors(editor => {
      return editor.onDidChange(e => {
        let point = editor.getCursorBufferPosition();
         //console.log(editor.lineTextForBufferRow(point.row));
         let code = {
            code: editor.getText(),
            row: point.row,
            room: this.localId,
            title: editor.getTitle()
         };
         socket.emit('code', code);
      });
    });

    return navigator.webkitGetUserMedia(constraints
        , stream => {
            this.localStream = stream;
            this.client.setLocalStream(stream);
            this.client.send('readyToStream', { name: this.localId });
            return this.indelyView.setMyVideoStream(stream);
        }
        , error => console.log(error));
  },

  close() {
    this.rightPanel.hide();
    var trackAudio = this.localStream.getTracks()[0];  // if only one media track Audio
    var trackVideo = this.localStream.getTracks()[1]; // Video

    trackAudio.stop();
    trackVideo.stop();
  },

  deactivate() {
    this.rightPanel.destroy();
    this.subscriptions.dispose();
    this.indelyView.destroy();
  },

  serialize() {
    return {
      indelyViewState: this.indelyView.serialize()
    };
  },

  toggle() {

  this.initLocalStream();

    if (this.rightPanel.isVisible()) {
      return this.rightPanel.hide();
    } else {
      return this.rightPanel.show();
    }
  }

};
