export default class Preloader extends Phaser.Scene {
    constructor(key) {
        super('Preloader');
    }

    init(data) {
        this._assetData = data.assetData;
        this.readyCount = 0;
    }

    preload() {
        //time event for showing logo
        this.timedEvent = this.time.delayedCall(1, this.ready, [], this);
		this.createPreloader();
    }

    createPreloader() {
        this.cameras.main.setViewport(0, 0, this.game.config.width, this.game.config.height);

        this.loadAssets();

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        var logo = this.add.image(width/2-10, height/2+50, 'sunflame_logo');
        logo.setOrigin(0.5, 0.5);
        logo.alpha = 0;

        
        var config1 = {
            x: width/2,
            y: 100,
            text: '\nPlease Wait, Loading In Progress...\n',
            style: {
                font: "42px Arial bold",
                color: '#fff',
                align: 'center',
                backgroundColor: 'rgba(255,255,255,0.5)',
                wordWrap: { width: width-150 },
                shadow: {
                    color: 'rgba(0,0,0,0.5)',
                    fill: true,
                    offsetX: 4,
                    offsetY: 4,
                    blur: 2
                }
            }
        };
    
        var text = this.make.text(config1);
        text.setOrigin(0.5).setPadding({ x: 64, y: 16 });

        //reveal sprite on load progress
        this.load.on('progress', function(value) {
            if(logo.alpha < 1) {
                logo.alpha = logo.alpha += 0.1;
            }
        });

        //remove progressbar when complete
        this.load.on('complete', function() {
            text.destroy();
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
		
		this.assetData = this.cache.json.get('assetData');
		
        this.assetData.images.location.forEach((asset)=>{
            this.load.image(asset, `./assets/images/location/${asset}.png`);
        });
        this.assetData.images.tilesets.forEach((asset)=>{
            this.load.spritesheet(asset, `./assets/images/tilesets/${asset}.png`, { frameWidth: 16});
        });
        this.assetData.images.utility.forEach((asset)=>{
            this.load.image(asset, `./assets/images/utility/${asset}.png`);
        });

        this.assetData.spritesheets.forEach((spritesheet)=>{
            this.load.atlas(spritesheet, `./assets/spritesheets/${spritesheet}.png`, `./assets/spritesheets/${spritesheet}.json`);
        });

        this.assetData.tilemaps.forEach((tilemap)=>{
            this.load.tilemapTiledJSON(tilemap, `./assets/tilemaps/${tilemap}.json`);
            this.load.json(tilemap, `./assets/tilemaps/${tilemap}.json`);
        })
    }

    ready() {
        this.readyCount++;
        if(this.readyCount === 1) {
            //this leaves logo on splash screen for a short interval before launching next scene
            this.cameras.main.fadeOut(2000, 0,0,0);
            this.cameras.main.on("camerafadeoutcomplete", this.startGame, this)
        }
    }

    startGame() {
        //use this one
        // var data = {level: 0, newGame: true, levels: this.levels}
        // this.scene.start('NPC', data);
        //testing only
        var data = {level: 2, newGame: true, levels: this.levels}
        this.game.scene.start('gameState', data);
    }
}