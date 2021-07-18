export default class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI', active: true});
    }

    init() {
        this.gameScene = this.scene.get('gameState');
    }

    preload() {
        this.load.image('restart_button', './assets/images/utility/restart_button.png');
        this.load.image('easy_button', './assets/images/utility/easy_button.png');
    }

    create() {
        this.createUI();
        this.launchUI();
    }

    createUI() {
        this.width = this.gameScene.cameras.main.worldView.width;

        this.UIgroup = this.add.group();

        this.restartButton = this.UIgroup.create(150, 0, 'restart_button', null);
        this.restartButton.setInteractive({ cursor: 'pointer' }).on("pointerdown", this.onRestartClick, this);

        this.easyButton = this.UIgroup.create(150, 0, 'easy_button', null);
        this.easyButton.setInteractive({ cursor: 'pointer' }).on("pointerdown", this.onEasyClick, this);

        this.formatButtons();
    }

    formatButtons() {
        this.UIgroup.setVisible(false);

        for (let i = 0; i < this.UIgroup.children.length; i++) {
            var button = this.UIgroup.children[i];
            button[i].setOrigin(0,0);
            button[i].setScrollFactor(0);
            button[i].width = this.width/6;
        }

        
        this.easyButton.setX(this.restartButton.x + this.restartButton.width);
    }

    onRestartClick() {
        this.gameScene.scene.restart({ level: this.gameScene._LEVEL, levels: this.gameScene._LEVELS, newGame: false });
    }

    onEasyClick() {
        this.gameScene.ledgeTargets.visible = !this.gameScene.ledgeTargets.visible;
    }

    launchUI() {
        this.gameScene.events.on('displayUI', function() {
            this.UIgroup.setVisible(true);
            console.log("UI is now visible");
        }.bind(this));
    }
}