export default class Boot extends Phaser.State {
    constructor(key) {
        super("Boot");
    }

    preload() {
        this.load.image('sunflame_logo', './assets/images/utility/sunflame_icon.png');
		this.load.json('assetData', './manifests/assetManifest.json');
		this.load.json('NPCdata', './manifests/NPCmanifest.json');
    }
    
    create() {
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        this.game.input.mouse.capture = true;

        this.state.start('Preloader');
    }
}