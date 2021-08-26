export default class Preloader extends Phaser.State {
    constructor(key) {
        super('Preloader');
    }

    init(data) {
        this._keyboardIsActive = data.keyboardIsActive;
        this._pointerIsActive = data.pointerIsActive;

        this.readyCount = 0;
    }

    preload() {
        //time event for showing logo
        this.timedEvent = this.time.events.add(Phaser.Timer.SECOND * 3, this.ready, this); 
		this.createPreloader();
    }

    createPreloader() {
        this.loadAssets();

        var width = this.camera.view.width;
        var height = this.camera.view.height;

        var logo = this.game.add.image(width/2-10, height/2+50, 'sunflame_logo');
        logo.anchor = {x: 0.5, y: 0.5};
        
        this.game.load.setPreloadSprite(logo);

        //loading text
        var bar = this.game.add.graphics();
        bar.beginFill(0xffffff, 0.3);
        bar.drawRect(0, 20, width, 100);
        var text = this.game.add.text(0, 0, "Please Wait, Loading In Progress...", { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: width-100 });
        text.setShadow(3, 3, 'rgba(255,255,255,0.5)', 2);
        text.setTextBounds(0, 20, width, 100);
        //remove progressbar when complete
        this.game.load.onLoadComplete.add(function() {
            text.destroy();
            bar.destroy();
            this.ready();
        }, this)
    }

    loadAssets() {
        this.levels = {
            0: 'sorceress',
            1: 'bridge',
            2: 'cave',
            3: 'tree',
            4: 'cottage',
            5: 'ranger'
        }
		
		this.assetData = this.cache.getJSON('assetData');
		
        this.assetData.images.location.forEach((asset)=>{
            this.game.load.image(asset, `./assets/images/location/${asset}.png`);
        });
        this.assetData.images.tilesets.forEach((asset)=>{
            this.game.load.spritesheet(asset, `./assets/images/tilesets/${asset}.png`, 16, 16);
        });
        this.assetData.images.utility.forEach((asset)=>{
            this.game.load.image(asset, `./assets/images/utility/${asset}.png`);
        });

        this.assetData.spritesheets.forEach((spritesheet)=>{
            this.game.load.atlas(spritesheet,  `./assets/spritesheets/${spritesheet}.png`, `./assets/spritesheets/${spritesheet}.json`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        });

        this.assetData.tilemaps.forEach((tilemap)=>{
            this.game.load.tilemap(tilemap, `./assets/tilemaps/${tilemap}.json`, null, Phaser.Tilemap.TILED_JSON);
            this.game.load.json(tilemap, `./assets/tilemaps/${tilemap}.json`);
        })
    }

    ready() {
        this.readyCount++;
        if(this.readyCount === 1) {
            //this leaves logo on splash screen for a short interval before launching next scene
            this.game.camera.fade(0x000000, 2000);
            this.game.camera.onFadeComplete.add(this.startGame, this);
        }
    }

    startGame() {
        //use this one
        // var data = {level: 0, newGame: true, levels: this.levels, keyboardIsActive: this._keyboardIsActive, pointerIsActive: this._pointerIsActive}
        // this.game.state.start('NPC', true, false, data);
        //testing only
        var data = {level: 4, newGame: true, levels: this.levels}
        if(this._pointerIsActive) {
            this.state.start('gameState_pointer', true, false, data);
        } else if(this._keyboardIsActive) {
            this.state.start('gameState_keyboard', true, false, data);
        }
    }
}