export default class makeMap {
    constructor(game, Phaser) {
        this._LEVEL = game.state.callbackContext._LEVEL;
        this._LEVELS = game.state.callbackContext._LEVELS;

        this.map = game.add.tilemap(this._LEVELS[this._LEVEL]);

        this.jsonfile = game.cache.getJSON(this.map.key);
        this.jsonfile.layers.forEach((layer) => {
            if (layer.name === "endpoints") {
                this.map.endpoints = layer.objects;
                return this.map.endpoints;
            }
        });

        //Multi-layer test
        this.tilesets = this.map.tilesets;
        //establish foreground & background tilesets
        for (let i = 0; i < this.tilesets.length; i++) {
            this.map.addTilesetImage(this.tilesets[i].name);
        }

        //render tile layers
        this.allLayers = this.map.layers;
        //initialize sorting group and add foregrounds to it
        this.sortGroup = game.add.group();
        for (let i = 0; i < this.allLayers.length; i++) {
            if (this.allLayers[i].name.includes('bg')) {
                this.backgroundLayer = this.map.createLayer(this.allLayers[i].name);
                this.backgroundLayer.sendToBack();
            } else if (this.allLayers[i].name.includes('platform-collides')) {
                this.mapLayer = this.map.createLayer(this.allLayers[i].name);
                // this.mapLayer.alpha = 0;
            } else if (this.allLayers[i].name.includes('fg')) {
                this.foregroundLayer = this.map.createLayer(this.allLayers[i].name);
                this.sortGroup.add(this.foregroundLayer);
            }
        }
        //set collision with layer
        this.map.setCollisionBetween(1, 38, true, this.mapLayer);

        //convert tile layer to work with slopes plugin
        game.slopes.convertTilemapLayer(this.mapLayer, 'arcadeslopes');
        // this.mapLayer.debug = true;
    }
}