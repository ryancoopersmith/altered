'use babel';

import AlteredView from './altered-view';
import { CompositeDisposable } from 'atom';

export default {

  alteredView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.alteredView = new AlteredView(state.alteredViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.alteredView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'altered:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.alteredView.destroy();
  },

  serialize() {
    return {
      alteredViewState: this.alteredView.serialize()
    };
  },

  toggle() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let text = editor.getText();
      if (text.includes('\<img') && text.includes('\<html\>')) {
      let textArray = text.split('\<img');
      for (let i = 0; i < textArray.length - 1; i++) {
        if (textArray[i + 1].includes('alt\=')) {
          textArray[i] += '\<img';
        } else {
          textArray[i] += '\<img alt\="MISSING ALT"';
        }
      }
      let fixed = textArray.join('');
      editor.setText(fixed);
      }
    }
  }

};
