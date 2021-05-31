'use babel';

import child_process from 'child_process';

export default class LuarunnerView {

  create() {
    // Create root element
    this.element = document.createElement('div');
    mainclass = ['padded'];
    mainclass.forEach(item => {this.element.classList.add(item);});

    var main2 = document.createElement('div');
    main2class = ['inline-block', 'btn-group'];
    main2class.forEach(function(item){main2.classList.add(item);});
    this.element.appendChild(main2);

    // Create button elements
    var runbtn = document.createElement('button');
    runbtn.textContent = ' Run Lua';
    runbtnclass = ['btn', 'btn-primary', 'icon-terminal'];
    runbtnclass.forEach(function(item){runbtn.classList.add(item);});
    main2.appendChild(runbtn);
    var runbtn2 = document.createElement('button');
    runbtn2.textContent = ' Run Love2d';
    runbtn2class = ['btn', 'btn-primary', 'icon-terminal'];
    runbtn2class.forEach(function(item){runbtn2.classList.add(item);});
    main2.appendChild(runbtn2);
    var runinput = document.createElement('atom-text-editor');
    var runinputclass = ['inline-block', 'myinput'];
    runinputclass.forEach(function(item){runinput.classList.add(item);});
    runinput.setAttribute('mini', 'true');
    runinput.setAttribute('id', 'runinput');
    runinput.initialText = localStorage.runinput || 'Put lua binary filepath here';
    this.element.appendChild(runinput);
    var runinput2 = document.createElement('atom-text-editor');
    var runinput2class = ['inline-block', 'myinput'];
    runinput2class.forEach(function(item){runinput2.classList.add(item);});
    runinput2.setAttribute('mini', 'true');
    runinput2.setAttribute('id', 'runinput2');
    runinput2.initialText = localStorage.runinput2 || 'Put love2d binary filepath here';
    this.element.appendChild(runinput2);
    runinput.getModel().buffer.onDidChange(function(e){
      localStorage.runinput = runinput.getModel().buffer.getText();
    });
    runinput2.getModel().buffer.onDidChange(function(e){
      localStorage.runinput2 = runinput2.getModel().buffer.getText();
    });
    runbtn.onclick = function(){
      var path = atom.workspace.getActiveTextEditor().buffer.file.path;
      if(path.slice(path.length-3,path.length) != "lua"){ path = ""; }
      var path2 = runinput.getModel().buffer.getText();
      if(path2.slice(path2.length-3,path2.length) != "exe"){ path2 = ""; }
      if(path2 && path){

        var proc = child_process.spawn(path2, [path]);

        var modalcontent = document.createElement('div');
        var modalterm = document.createElement('div');
        var modaltermclass = ['myterm', 'block', 'padded'];
        modaltermclass.forEach(function(item){modalterm.classList.add(item);});
        modalcontent.appendChild(modalterm);
        var modalclose = document.createElement('button');
        var modalcloseclass = ['btn', 'btn-primary'];
        modalcloseclass.forEach(function(item){modalclose.classList.add(item);});
        modalclose.textContent = 'Close';
        modalcontent.appendChild(modalclose);

        var modal = atom.workspace.addModalPanel({
          item: modalcontent,
          visible: true
        });

        modalclose.onclick = function(){
          modal.destroy();
        }

        proc.stdout.on('data', (data) => {
          modalterm.textContent += data;
        });

      }else{
        if(path){
          atom.notifications.addError("Please input correct lua binary filepath", {
            dismissable: true
          });
        }else if(path2){
          atom.notifications.addError("Please have open a lua file", {
            dismissable: true
          });
        }else{
          atom.notifications.addError("Please input correct lua binary filepath and have open a lua file", {
            dismissable: true
          });
        }
      }
    }
    runbtn2.onclick = function(){
      var path = atom.workspace.getActiveTextEditor().buffer.file.path;
      if(path.slice(path.length-3,path.length) != "lua"){ path = ""; }
      if(path){ path = path.slice(0,path.lastIndexOf("\\")); }
      var path2 = runinput2.getModel().buffer.getText();
      if(path2.slice(path2.length-3,path2.length) != "exe"){ path2 = ""; }
      if(path2 && path){

        var proc = child_process.spawn(path2, [path]);

      }else{
        if(path){
          atom.notifications.addError("Please input correct lua binary filepath", {
            dismissable: true
          });
        }else if(path2){
          atom.notifications.addError("Please have open a lua file", {
            dismissable: true
          });
        }else{
          atom.notifications.addError("Please input correct lua binary filepath and have open a lua file", {
            dismissable: true
          });
        }
      }
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
