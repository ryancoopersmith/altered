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
      let selection = editor.getSelectedText();
      let reversed = selection.split('').reverse().join('');
      editor.insertText(reversed)
    }
  }

};
