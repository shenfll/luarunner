'use babel';

import LuarunnerView from './luarunner-view';
import { CompositeDisposable } from 'atom';
import child_process from 'child_process';

//console.log(child_process)

//child_process.spawn('pwd', [], { shell: true });

const proc = child_process.spawn('cmd.exe', ['/c', 'echo %cd%']);

proc.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

proc.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

proc.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

export default {

  luarunnerView: null,
  footerPanel: null,
  subscriptions: null,

  activate(state) {
    this.luarunnerView = new LuarunnerView();
    this.luarunnerView.create();
    this.footerPanel = atom.workspace.addFooterPanel({
      item: this.luarunnerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'luarunner:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.footerPanel.destroy();
    this.subscriptions.dispose();
    this.luarunnerView.destroy();
  },

  serialize() {
    return {
      luarunnerViewState: this.luarunnerView.serialize()
    };
  },

  toggle() {
    console.log('Luarunner was toggled!');
    return (
      this.footerPanel.isVisible() ?
      this.footerPanel.hide() :
      this.footerPanel.show()
    );
  }

};
