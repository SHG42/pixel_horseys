export default class gameState extends Phaser.State {
    constructor() {
        super("gameState");
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this.loadingLevel = false;
        //emit event to reset if game over occurs and new game starts, check to see if new game
        if(this._NEWGAME) {
            this.newGameSignal = new Phaser.Signal();
            this.newGameSignal.dispatch();
        }
    }
    
    create() {
        //set smoothing for canvas rendering
        Phaser.Canvas.setSmoothingEnabled(this, false);
        
        //activate physics and plugins
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);
    
        // Prefer the minimum Y offset globally
        this.game.slopes.preferY = true;
    
        //set gravity
        this.game.physics.arcade.gravity.y = 1500;
    
        //create tilemap
        this.makeMap();
    
        //parse Tiled object groups
        this.parseObjectGroups();
    
        //add hero
        this.addHero();
    
        //add anims
        this.createAnims();
    
        // Prefer the minimum Y offset globally
        this.game.slopes.preferY = true;
        //set world bounds
        this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels+100);
        this.game.camera.setBoundsToWorld();
    
        //create UI buttons
        this.createUI();

        //initiate keyboard controls
        this.addControls();
        
        //start follow
        this.game.camera.follow(this.hero);
        this.game.camera.focusOn(this.hero);
        //reset camera fade once complete
        this.game.camera.onFadeComplete.add(this.resetFade, this);
    }

    update() {
        //fade out and restart level if sprite falls outside world bounds y
        if (this.hero.body.position.y > this.map.heightInPixels) {
            this.game.camera.fade(0x000000, 2000);
            this.game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
        }
        //platform collider
        this.game.physics.arcade.collide(this.hero, this.mapLayer);
    
        // run endgame function
        this.game.physics.arcade.overlap(this.hero, this.goal, this.onGoal, null, this);
    
        // run ledge finding function
        this.game.physics.arcade.overlap(this.hero, this.ledgesGroup, this.ledgeHit, null, this);
    
        //run portal function
        this.game.physics.arcade.overlap(this.hero, this.exitsGroup, this.exitStage, null, this);
    
        //run loot get function
        this.game.physics.arcade.overlap(this.hero, this.objectsGroup, this.getLoot, null, this);

        if(this.pointer.isDown) {
            this.pointerInput();
        }

        if(this.pointer.isUp) {
            this.pointerUp();
        }
    
        this.hero.isOnGround = (this.hero.body.blocked.down || this.hero.body.touching.down || this.hero.body.onFloor());
        this.hero.isBlocked = (this.hero.body.blocked.left || this.hero.body.blocked.right || this.hero.body.touching.left || this.hero.body.touching.right || this.hero.body.onWall());
		this.hero.isAirborne = (!this.hero.isOnGround && !this.hero.isGrabbing);
    }

    addControls() {
        //leap: click-drag pointer, have sprite follow pointer
        //establish pointer
        this.pointer = this.game.input.pointer1;

        //pointer conditions
        //angle range for horizontal movement:  
        //angle range for horizontal leap:
        //angle rage for vertical jump: 60-120
        this.game.input.onDown.add(()=>{
            this.pointerXThreshold = this.game.math.difference(this.pointer.worldX, this.hero.body.x);
            this.pointerYThreshold = this.game.math.difference(this.pointer.worldY, this.hero.body.y);

            if(this.pointer.worldX < this.hero.body.x) {
                this.pointerLeft = true;
                this.pointerRight = false;
            } else if(this.pointer.worldX > this.hero.body.x) {
                this.pointerLeft = false;
                this.pointerRight = true;
            } else if(this.pointer.worldY < this.hero.body.y) {
                this.pointerAbove = true;
                this.pointerBelow = false;
            } else if(this.pointer.worldY > this.hero.body.y) {
                this.pointerAbove = false;
                this.pointerBelow = true;
            }

            this.angle = this.game.physics.arcade.angleToPointer(this.hero);
            //angle range for horizontal movement: left=> -2.5 -> 2.5, right=> 0.5 -> -0.5
            //angle range for horizontal leap:
            //angle range for vertical jump: -0.6 -> -1.6
        }, this);

        this.game.input.onTap.add(this.tapJump, this);
    }

    tapJump() {
        this.angle = this.game.physics.arcade.angleToPointer(this.hero);

        if(this.hero.isOnGround && (this.angle < -0.6 && this.angle > -1.6)) {
            this.hero.body.velocity.y = -325;
            if(this.hero.body.velocity.y < -325) {
                this.hero.body.velocity.y = -325;
            }
        }
    }

    pointerInput() {
        if(this.pointerXThreshold < 100 && this.hero.isOnGround) {
            if(this.pointerLeft) {
                this.hero.whichDirection = 'left';
                this.hero.body.velocity.x = -150;
                if(this.hero.body.velocity.x < -150) {
                    this.hero.body.velocity.x = -150;
                }
                this.hero.animations.play('run-left');
            } else if(this.pointerRight) {
                this.hero.whichDirection = 'right';
                this.hero.body.velocity.x = 150;
                if(this.hero.body.velocity.x > 150) {
                    this.hero.body.velocity.x = 150;
                }
                this.hero.animations.play('run-right');
            }
        } else if(this.pointerXThreshold > 100) {
            this.pointerUp();
        }
    }

    pointerUp() {
        this.hero.body.velocity.x = 0;
        if(this.hero.whichDirection === "left" && this.hero.isOnGround) {
            this.hero.animations.play('idle-left');
        } else if(this.hero.whichDirection === "right" && this.hero.isOnGround) {
            this.hero.animations.play('idle-right');
        }
    }

    ledgeHit(hero, ledge) {
        //check difference between ledge coords and hero.left vs hero.right to determine which side ledge is on
        // if (this.hero.whichDirection === "left" && this.hero.body.velocity.y < 0 && this.grabKey.isDown) {
        //     hero.animations.play('grab-left');
        //     hero.alignIn(ledge, Phaser.TOP_LEFT, 15, 5); //offset accounts for sprite bounding box
        //     hero.body.position.setTo(ledge.body.center.x, ledge.body.center.y);
        // }
        // if (this.hero.whichDirection === "right" && this.hero.body.velocity.y < 0 && this.grabKey.isDown) {
        //     hero.animations.play('grab-right');
        //     hero.alignIn(ledge, Phaser.TOP_RIGHT, 15, 5); //offset accounts for sprite bounding box
        //     hero.body.position.setTo(ledge.body.center.x, ledge.body.center.y);
        // }
    }

    createAnims() {
        //Hero anims
        //idle
        this.idleRight = this.hero.animations.add('idle-right', Phaser.Animation.generateFrameNames('idle-right-', 0, 3, '-1.3', 2), 2, true, false);
        this.idleLeft = this.hero.animations.add('idle-left', Phaser.Animation.generateFrameNames('idle-left-', 0, 3, '-1.3', 2), 2, true, false);
    
        //run
        this.runRight = this.hero.animations.add('run-right', Phaser.Animation.generateFrameNames('run-right-', 0, 5, '-1.3', 2), 10, true, false);
        this.runLeft = this.hero.animations.add('run-left', Phaser.Animation.generateFrameNames('run-left-', 0, 5, '-1.3', 2), 10, true, false);
    
        //jump
        this.jumpRight = this.hero.animations.add('jump-right', Phaser.Animation.generateFrameNames('jump-right-', 0, 5, '-1.3', 2), 10, false, false);
        this.jumpLeft = this.hero.animations.add('jump-left', Phaser.Animation.generateFrameNames('jump-left-', 0, 5, '-1.3', 2), 10, false, false);
		
		//static jump
		this.upRight = this.hero.animations.add('up-right', Phaser.Animation.generateFrameNames('crnr-jmp-right-', 0, 1, '-1.3', 2), 10, true, false);
		this.upLeft = this.hero.animations.add('up-left', Phaser.Animation.generateFrameNames('crnr-jmp-left-', 0, 1, '-1.3', 2), 10, true, false);
    
        //grab
        this.grabLeft = this.hero.animations.add('grab-left', Phaser.Animation.generateFrameNames('crnr-grb-left-', 0, 3, '-1.3', 2), 3, true, false);
        this.grabRight = this.hero.animations.add('grab-right', Phaser.Animation.generateFrameNames('crnr-grb-right-', 0, 3, '-1.3', 2), 3, true, false);
    
        //climb
        this.climbLeft = this.hero.animations.add('climb-left', Phaser.Animation.generateFrameNames('crnr-clmb-left-', 0, 4, '-1.3', 2), 10, false, false);
        this.climbRight = this.hero.animations.add('climb-right', Phaser.Animation.generateFrameNames('crnr-clmb-right-', 0, 4, '-1.3', 2), 10, false, false);
    
        //animations settings
        this.jumpRight.onComplete.add(()=> { this.hero.animations.play('idle-right'); }, this);
        this.jumpLeft.onComplete.add(()=> { this.hero.animations.play('idle-left'); }, this);
		
        this.upRight.onComplete.add(()=> { this.hero.animations.play('idle-right'); }, this);
        this.upLeft.onComplete.add(()=> { this.hero.animations.play('idle-left'); }, this);
    
        this.grabLeft.onStart.add(()=> { this.hero.body.immovable = true; this.hero.body.moves = false; this.hero.isGrabbing = true; this.hero.body.enable = false; this.controls.left.enabled = false; this.controls.right.enabled = false; }, this);
        this.grabRight.onStart.add(()=> { this.hero.body.immovable = true; this.hero.body.moves = false; this.hero.isGrabbing = true; this.hero.body.enable = false; this.controls.left.enabled = false; this.controls.right.enabled = false; }, this);
    
        this.climbLeft.onStart.add(()=> { 
            for (let index = 0; index < 18; index++) {
                this.hero.position.y--;
            }
        }, this);
        this.climbRight.onStart.add(function() { 
            for (let index = 0; index < 18; index++) {
                this.hero.position.y--;
            }
        }, this);
    
        this.climbLeft.onComplete.add(()=> { this.hero.position.x-=10; this.hero.body.enable = true; this.hero.body.immovable = false; this.hero.body.moves = true; this.hero.isGrabbing = false; this.hero.animations.play('idle-left'); this.controls.left.enabled = true; this.controls.right.enabled = true; }, this);
        this.climbRight.onComplete.add(()=> { this.hero.position.x+=10; this.hero.body.enable = true; this.hero.body.immovable = false; this.hero.body.moves = true; this.hero.isGrabbing = false; this.hero.animations.play('idle-right'); this.controls.left.enabled = true; this.controls.right.enabled = true; }, this);
    
        //play 'idle-right' by default
        this.hero.animations.play('idle-right');
    }
    
    addHero() {
        //load sprite at entry point object in map data
        //iterate over available entrances
        this.entrancesGroup.forEach(entrance => {
            if (this._NEWGAME && this._LEVEL === 1) {
                //if newGame = true and loaded level is lvl1, load character at lvl1 starting pt
                if (entrance.name === 'stage1entry') { //change back to stage1entry after testing
                    this.hero = this.game.add.sprite(entrance.x, entrance.y, 'compiled-hero', 'idle-right-00-1.3');
                }
            } else if (!this._NEWGAME && this._LEVEL === 1) {
                if (entrance.name === 'portalfromcave') {
                    //if returning from cave, load sprite at return pt
                    this.hero = this.game.add.sprite(entrance.x, entrance.y, 'compiled-hero', 'idle-right-00-1.3');
                }
            } else { //otherwise, use whatever coordinates come back when function runs
                this.hero = this.game.add.sprite(entrance.x, entrance.y, 'compiled-hero', 'idle-right-00-1.3');
            }
        });
        
        //add hero to sorting group
        this.sortGroup.add(this.hero);
        this.sortGroup.sendToBack(this.hero);
        if (this._LEVEL === 4) {
            this.sortGroup.sendToBack(this.goal);
        }
    
        this.game.physics.arcade.enable(this.hero);
        this.hero.body.bounce.y = 0.3;
        this.hero.body.collideWorldBounds = true;
        this.hero.body.setSize(this.hero.body.halfWidth-10, this.hero.body.height-5, 18, 3);
		// this.hero.debug = true;
        //enable hero for slopes
        this.game.slopes.enable(this.hero);
        // Prefer the minimum Y offset for this physics body
        this.hero.body.slopes.preferY = true;
        // Pull the player into downwards collisions with a velocity of 50
        this.hero.body.slopes.pullDown = 50;
        //set custom property to handle which direction the sprite is facing, default 'right'
        this.hero.whichDirection = 'right';
        //set custom property to handle whether player is grabbing a ledge at the moment, default 'no'
        this.hero.isGrabbing = false;
    }
   
    makeMap() {
        this.map = this.game.add.tilemap(this._LEVELS[this._LEVEL]);
    
        //Multi-layer test
        this.tilesets = this.map.tilesets;
        //establish foreground & background tilesets
        for (let i = 0; i < this.tilesets.length; i++) {
            this.map.addTilesetImage(this.tilesets[i].name);
        }
        
        //render tile layers
        this.allLayers = this.map.layers;
        //initialize sorting group and add foregrounds to it
        this.sortGroup = this.game.add.group();
        for (let i = 0; i < this.allLayers.length; i++) {
            if (this.allLayers[i].name.includes('bg')) {
                this.backgroundLayer = this.map.createLayer(this.allLayers[i].name);
                this.backgroundLayer.sendToBack();
            } else if (this.allLayers[i].name.includes('platform-collides')) {
                this.mapLayer = this.map.createLayer(this.allLayers[i].name);
                this.mapLayer.alpha = 0;
            } else if (this.allLayers[i].name.includes('fg')) {
                this.foregroundLayer = this.map.createLayer(this.allLayers[i].name);
                this.sortGroup.add(this.foregroundLayer);
            }
        }
        //set collision with layer
        this.map.setCollisionBetween(1, 38, true, this.mapLayer);
    
        //convert tile layer to work with slopes plugin
        this.game.slopes.convertTilemapLayer(this.mapLayer, 'arcadeslopes');
    }
    
    parseObjectGroups() {
        //entry points
        this.entryPoints = this.map.objects.entryPortals;
        this.entrancesGroup = this.game.add.group();
        this.entrancesGroup.enableBody = true;
        this.entrancesGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.entryPoints.forEach(entryPt => {
            if(entryPt.type === 'levelentry' || entryPt.type === 'entryportal') {
                if (entryPt.width < entryPt.height) {
                    this.entrance = this.game.add.sprite(entryPt.x, entryPt.y, 'portal-v');
                } else if (entryPt.width > entryPt.height) {
                    this.entrance = this.game.add.sprite(entryPt.x, entryPt.y, 'portal-h');
                } else {
                    this.entrance = this.game.add.sprite(entryPt.x, entryPt.y, 'point');
                }
                this.entrance.name = entryPt.name;
                this.entrancesGroup.add(this.entrance);
                this.entrancesGroup.setAll('body.allowGravity', false);
            }
        });
    
        //exit points
        this.exitPoints = this.map.objects.exitPortals;
        this.exitsGroup = this.game.add.group();
        this.exitsGroup.enableBody = true;
        this.exitsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.exitPoints.forEach(exitPt => {
            if (exitPt.type === 'goal') {
                this.goal = this.game.add.sprite(exitPt.x, exitPt.y, 'objects', 'house');
                this.goal.name = exitPt.name;
                this.game.physics.arcade.enable(this.goal);
                this.goal.position.y = this.goal.position.y - this.goal.body.height;
                this.goal.body.allowGravity = false;
                this.goal.body.immovable = true;
                this.goal.body.moves = false;
                this.sortGroup.add(this.goal);
            } else if (exitPt.type === 'exitportal') {
                //default cases for nonspecial exits
                if (exitPt.width < exitPt.height) {
                    this.exit = this.game.add.sprite(exitPt.x, exitPt.y, 'portal-v');
                    this.exitsGroup.add(this.exit);
                    this.exit.body.width = exitPt.width;
                    this.exit.body.height = exitPt.height;
                    this.exit.name = exitPt.name;
                } else if (exitPt.width > exitPt.height) {
                    this.exit = this.game.add.sprite(exitPt.x, exitPt.y, 'portal-h');
                    this.exitsGroup.add(this.exit);
                    this.exit.body.width = exitPt.width;
                    this.exit.body.height = exitPt.height;
                    this.exit.name = exitPt.name;
                }
            }
            this.exitsGroup.setAll('body.allowGravity', false);
        });
    
        //ledge points
        this.ledgePoints = this.map.objects.ledgePoints;
        this.ledgesGroup = this.game.add.group();
        this.ledgesGroup.enableBody = true;
        this.ledgesGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.ledgePoints.forEach(ledgePt => {
            if (ledgePt.type === 'ledge') {
                this.ledge = this.game.add.sprite(ledgePt.x, ledgePt.y, 'point');
                this.ledge.anchor.x = 0.5;
                this.ledge.anchor.y = 0.5;
                this.ledgesGroup.add(this.ledge);
                this.ledgesGroup.setAll('body.allowGravity', false);
            }
        });

        //loot objects
        this.mapObjects = this.map.objects.objects;
        this.objectsGroup = this.game.add.group();
        this.objectsGroup.enableBody = true;
        this.objectsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.mapObjects.forEach(objectPt => {
            if (objectPt.type === 'loot') {
                this.map.createFromObjects('objects', objectPt.gid, 'objects', objectPt.name, true, false, this.objectsGroup);
                this.objectsGroup.setAll('body.allowGravity', false);
            }
        });
    }
    
    onGoal(hero, goal) {
        this.game.camera.fade(0x000000, 2000);
        this.game.camera.onFadeComplete.add(()=>{
            //launch end cutscene
            var data = {level: 5, newGame: false, levels: this._LEVELS}
            this.game.state.start('NPC', true, false, data);
        }, this);
    }
    
    getLoot(hero, loot) {
        loot.destroy();
        var gotLootSignal = new Phaser.Signal();
        gotLootSignal.dispatch();
    }
    
    exitStage(hero, portal) {
        if (portal.name === 'portaltocave') {
            this.game.state.restart(true, false, { level: 2, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltotree') {
            this.game.state.restart(true, false, { level: 3, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltocottage') {
            this.game.state.restart(true, false, { level: 4, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltobridge') {
            this.game.state.restart(true, false, { level: 1, levels: this._LEVELS, newGame: false });
        }
    }

    createUI() {
        this.restartButton = this.game.add.image(150, 0, "restart_button", null);
        this.restartButton.fixedToCamera = true;
        this.restartButton.bringToTop();
        //enable input
        this.restartButton.inputEnabled = true;
        this.restartButton.input.useHandCursor = true;
        this.restartButton.events.onInputDown.add(()=>{
            this.game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
        }, this);

        this.graphics = this.game.add.graphics(0, 0);
        this.easyButton = this.game.add.image(this.restartButton.width + 20, 0, "easy_button", null);
        this.easyButton.fixedToCamera = true;
        this.easyButton.bringToTop();
        //enable input
        this.easyButton.inputEnabled = true;
        this.easyButton.input.useHandCursor = true;
        this.easyButton.events.onInputDown.add(()=>{
            if(this.graphics.graphicsData.length > 0) {
                this.graphics.clear();
            } else {
                this.ledgesGroup.forEach(ledge => {
                    this.graphics.lineStyle(3, 0xff0000).beginFill(0x000000, 0).arc(ledge.x, ledge.y, ledge.width, 0, 360, true);
                    this.graphics.endFill();
                });
            }
        }, this);

        if(this.game.width > this.game.height) {
            this.restartButton.height = this.game.height/6;
            this.restartButton.scale.x = this.restartButton.scale.y;
            this.easyButton.height = this.game.height/6;
            this.easyButton.scale.x = this.easyButton.scale.y;
        } else if(this.game.width < this.game.height) {
            this.restartButton.width = this.game.width/5;
            this.restartButton.scale.y = this.restartButton.scale.x;
            this.easyButton.width = this.game.width/5;
            this.easyButton.scale.y = this.easyButton.scale.x;
        }
    }
    
    resetFade() {
        this.game.camera.resetFX();
    }

    // render() {
    //     this.game.debug.body(this.hero);
    //     this.game.debug.spriteBounds(this.hero, 'rgba(0,0,255,1)', false);
    // }
}