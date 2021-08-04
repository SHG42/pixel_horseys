export default class createUI {
    constructor(game, Phaser, mapObjects) {
        this._LEVEL = game.state.callbackContext._LEVEL;
        this._LEVELS = game.state.callbackContext._LEVELS;

        this.game = game;
        this.mapObjects = mapObjects;

        this.UIgroup = game.add.group();

        this.restartButton = game.add.button(150, 0, 'restart_button', this.onRestartClick, this, null, null, null, null, this.UIgroup);

        this.easyButton = game.add.button(this.restartButton.x + 150, 0, 'easy_button', this.onEasyClick, this, null, null, null, null, this.UIgroup);

        this.formatButtons(game, Phaser);
    }

    formatButtons(game, Phaser) {
        this.UIgroup.forEach((button)=>{
            button.input.useHandCursor = true;
            button.fixedToCamera = true;
            button.hitArea = button.width*button.height;
    
            if(game.width > game.height) {
                button.height = game.height/6;
                button.scale.x = button.scale.y;
            } else if(this.game.width < this.game.height) {
                button.width = game.width/5;
                button.scale.y = button.scale.x;
            }
        }, this);
    }
    
    onRestartClick() {
        this.game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
    }
    
    onEasyClick() {
        this.mapObjects.graphics.visible = !this.mapObjects.graphics.visible;
    }
}