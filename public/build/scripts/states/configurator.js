import makeMap from "./configurators/makeMap.js";
import parseObjectGroups from "./configurators/parseObjectGroups.js";
import addHero from "./configurators/addHero.js";
import createUI from "./configurators/createUI.js";

export default class Configurator {
    constructor(game, Phaser) {
        //set smoothing for canvas rendering
        Phaser.Canvas.setSmoothingEnabled(this, false);
                
        //activate physics and plugins
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.plugins.add(Phaser.Plugin.ArcadeSlopes);

        // Prefer the minimum Y offset globally
        game.slopes.preferY = true;

        //set gravity
        game.physics.arcade.gravity.y = 1500;

        this.configure(game, Phaser);
    }

    configure(game, Phaser) {
        //create tilemap
        this.map = new makeMap(game, Phaser);
            
        //parse Tiled object groups
        this.mapObjects = new parseObjectGroups(game, Phaser, this.map);

        //add hero
        this.hero = new addHero(game, Phaser, this.map, this.mapObjects);

        // Prefer the minimum Y offset globally
        game.slopes.preferY = true;
        //set world bounds
        game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels+100);
        game.camera.setBoundsToWorld();

        //create UI buttons
        this.createUI = new createUI(game, Phaser, this.mapObjects);

        //start follow
        game.camera.follow(this.hero.hero, Phaser.Camera.FOLLOW_PLATFORMER);
        game.camera.focusOn(this.hero.hero);
        //reset camera fade once complete
        game.camera.onFadeComplete.add(this.resetFade, this);
    }

    resetFade() {
        game.camera.resetFX();
    }
}