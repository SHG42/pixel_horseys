export default class controlConfigure extends Phaser.State {
    constructor(key) {
        super("controlConfigure");
    }

    preload() {
        this.load.image('keyboard_button', './assets/images/utility/keyboard_button.png');
        this.load.image('pointer_button', './assets/images/utility/pointer_button.png');
    }

    create() {
        this.controlConfigure();
    }

    start() {
        var data = {keyboardIsActive: this.keyboardIsActive, pointerIsActive: this.pointerIsActive};
        this.state.start('Preloader', true, false, data);
    }

    controlConfigure() {
        this.camera.setSize(this.game.width, this.game.height);
        this.width = this.camera.view.width;
        this.height = this.camera.view.height;
        
        this.bar = this.game.add.graphics();
        this.bar.lineStyle(3, 0xff0000).beginFill(0xffffff, 0.3).drawRect(0, 20, this.width-50, 100).endFill();
        var text = this.game.add.text(0, 0, "Please Select a Control Scheme:", { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: this.width-100 });
        text.setShadow(3, 3, 'rgba(255,255,255,0.5)', 2);
        text.setTextBounds(0, 20, this.width, 100);

        this.UIBox = this.game.add.graphics();
        this.UIBox.lineStyle(3, 0x00ff00).beginFill(0xffffff, 0.5).drawRect(0, this.bar.bottom+20, this.width-50, this.height-this.bar.height-100);

        this.UIgroup = this.game.add.group(this.UIBox);
        this.UIgroup.alignIn(this.UIBox, Phaser.LEFT_CENTER);

        this.keyboardButton = this.game.add.button(0, this.bar.bottom, 'keyboard_button', this.activateKeyboard, this, null, null, null, null, this.UIgroup);
        this.keyboardButton.scaleMax = {x: 1, y: 1};
        this.keyboardButton.input.useHandCursor = true;

        this.pointerButton = this.game.add.button(0, this.bar.bottom, 'pointer_button', this.activatePointer, this, null, null, null, null, this.UIgroup);
        this.pointerButton.scaleMax = {x: 1, y: 1};
        this.pointerButton.input.useHandCursor = true;

        if(this.game.device.desktop) {
            if(this.width > this.height) { //landscape
                this.formatButtonsHRZ_Desktop();
            } else if(this.width < this.height) {//portrait
                this.formatButtonsVRT_Desktop();
            }
        } else {
            if(this.width > this.height) { //landscape
                this.formatButtonsHRZ();
            } else if(this.width < this.height) {//portrait
                this.formatButtonsVRT();
            }
        }
    }

    formatButtonsHRZ_Desktop() {
        this.UIgroup.align(2, 1, this.width/2, this.height/3, Phaser.CENTER);
    }

    formatButtonsHRZ() {
        this.UIgroup.forEach((button)=>{
            button.anchor.y = 0.5;
            button.position.y = this.UIBox.centerY;
            button.position.x = this.UIBox.centerX;
            button.height = this.UIBox.height-50;
            button.scale.x = button.scale.y;
        }, this);
        this.keyboardButton.position.x = this.UIBox.left+100;
        this.pointerButton.position.x = this.UIBox.right-this.pointerButton.width-100;
    }
    
    formatButtonsVRT_Desktop() {
       this.UIgroup.align(1, 2, this.width/2, this.height/2, Phaser.CENTER);
    }
    
    formatButtonsVRT() {
        this.UIgroup.forEach((button)=>{
            button.anchor = {x: 0.5, y: 0.5};
            button.position.x = this.UIBox.centerX;
            button.width = this.UIBox.width-150;
            button.scale.y = button.scale.x;
        }, this);
        this.keyboardButton.position.y = this.UIBox.top;
        this.pointerButton.position.y = this.keyboardButton.position.y+this.keyboardButton.height+20;
    }

    activateKeyboard() {
        this.keyboardIsActive = true;
        this.pointerIsActive = false;
        this.game.input.keyboard.enabled = true;
        this.game.input.mouse.enabled = false;
        this.game.input.touch.enabled = false;
        this.start();
    }

    activatePointer() {
        this.keyboardIsActive = false;
        this.pointerIsActive = true;
        this.game.input.keyboard.enabled = false;
        this.game.input.mouse.enabled = true;
        this.game.input.touch.enabled = true;
        this.start();
    }
}