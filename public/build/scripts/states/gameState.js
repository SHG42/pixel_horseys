export default class gameState extends Phaser.State {
    constructor() {
        super("gameState");
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        // this._keyboardIsActive = data.keyboardIsActive;
        // this._pointerIsActive = data.pointerIsActive;
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

        this.configure();
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

        this.heroConditions();

        this.pointerConditions();
    }

    addControls() {
        this.hero.events.onInputDown.add(()=>{ this.hero.custom.tapped = true; });
        this.hero.events.onInputUp.add(()=>{ this.hero.custom.tapped = false; }, this);
        this.hero.events.onInputOut.add(()=>{ this.hero.custom.tapped = false; }, this);

        //establish pointer
        if(this.game.device.touch) {
            this.pointer = this.game.input.pointer1;
        } else {
            this.pointer = this.game.input.mousePointer;
            this.game.input.mouse.capture = true;
        }

        this.game.input.onUp.add(()=>{
            console.log("this.hero.body.velocity, this.hero.animations.currentAnim.name, this.hero.body.blocked, this.hero.body.touching, this.hero.body.onFloor(), this.hero.body.onWall(): ");
            console.log(this.hero.body.velocity, this.hero.animations.currentAnim.name, this.hero.body.blocked, this.hero.body.touching, this.hero.body.onFloor(), this.hero.body.onWall());
        })
    }

    pointerConditions() {
        this.angle = this.game.physics.arcade.angleToPointer(this.hero);
        this.angleAbove = (this.angle > -1.3 && this.angle < -0.7);
        this.angleBelow = (this.angle > 0.7 && this.angle < 1.3);

        if(this.angle === -1 || this.angle === 1) {//prevents "spinning in place" when pointer is directly between left and right
            this.pointerUp();
        }

        this.dtp = this.game.physics.arcade.distanceToPointer(this.hero, this.pointer, true);
        this.upperlimit = this.hero.body.width*10;
        this.lowerlimit = this.hero.body.width;
        this.pointerDistanceIsCorrect = this.dtp < this.upperlimit && this.dtp > this.lowerlimit;
        
        if(this.pointer.worldX < this.hero.body.x) {
            this.pointerLeft = true;
            this.pointerRight = false;
        } else if(this.pointer.worldX > this.hero.body.x) {
            this.pointerLeft = false;
            this.pointerRight = true;
        }

        if(this.pointer.isDown) {
            this.pointerInput();
        }

        if(this.pointer.isUp) {
            this.pointerUp();
        }
    }

    heroConditions() {
        this.hero.isOnGround = (this.hero.body.blocked.down || this.hero.body.touching.down || this.hero.body.onFloor());
        this.hero.isBlocked = (this.hero.body.blocked.left || this.hero.body.blocked.right || this.hero.body.touching.left || this.hero.body.touching.right || this.hero.body.onWall());
		this.hero.isAirborne = (!this.hero.isOnGround && !this.hero.custom.isGrabbing && !this.hero.custom.isClimbing);

        if(this.hero.custom.tapped && !this.hero.isGrabbing && this.pointer.duration < 400) {
            this.tapJump();
        }

        if(this.hero.custom.tapped && this.hero.custom.isGrabbing) {
            this.hero.custom.isClimbing = true;
            if(this.hero.custom.whichDirection === "left" && this.hero.custom.grabLeft) {
                this.climbingLeft();
            } else if(this.hero.custom.whichDirection === "right" && this.hero.custom.grabRight) {
                this.climbingRight();
            }
        }

        if(this.hero.isOnGround && this.hero.custom.isJumping) {
            this.hero.custom.isJumping = false;
        }

        if(this.hero.isAirborne && (this.hero.animations.currentAnim.name.includes("idle") || this.hero.animations.currentAnim.name.includes("run"))) {
            this.hero.animations.currentAnim.stop(false, true);
        }
        if(this.hero.isOnGround && this.hero.animations.currentAnim.name.includes("jump")) {
            this.hero.animations.currentAnim.stop(false, true);
        }
    }

    pointerInput() {
        if(!this.hero.custom.tapped && this.hero.isOnGround) {
            if(!this.angleAbove && !this.angleBelow && this.pointerDistanceIsCorrect) {
                if(this.pointerLeft && !this.pointerRight) {
                    this.hero.custom.whichDirection = 'left';
                    this.hero.body.velocity.x = -150;
                    this.hero.animations.play('run-left');
                } else if(this.pointerRight && !this.pointerLeft) {
                    this.hero.custom.whichDirection = 'right';
                    this.hero.body.velocity.x = 150;
                    this.hero.animations.play('run-right');
                }
            } else if(this.angleBelow || this.angleAbove || !this.pointerDistanceIsCorrect) {
                this.pointerUp();
            }
        }
    }
    
    tapJump() {
        this.hero.custom.isJumping = true;
        this.hero.body.velocity.y = -150;
        if(this.hero.custom.whichDirection === "left") {
            this.hero.animations.play('jump-left');
            // if(!this.hero.body.blocked.left && !this.hero.body.touching.left) {
            //     this.hero.body.position.x-=3;
            // }
        } else if(this.hero.custom.whichDirection === "right") {
            this.hero.animations.play('jump-right');
            // if(!this.hero.body.blocked.left && !this.hero.body.touching.left) {
            //     this.hero.body.position.x+=3;
            // }
        }
    }

    pointerUp() {
        if(!this.hero.custom.isGrabbing && !this.hero.custom.isClimbing) {
            this.hero.body.velocity.x = 0;
            if(this.hero.custom.whichDirection === "left" && this.hero.isOnGround) {
                this.hero.animations.play('idle-left');
            } else if(this.hero.custom.whichDirection === "right" && this.hero.isOnGround) {
                this.hero.animations.play('idle-right');
            }
        }
        this.game.input.reset(true);
    }

    ledgeHit(hero, ledge) {
        if(hero.custom.tapped && hero.body.velocity.y < 0) {
            this.goUpBy = ledge.body.y - 13;
            this.getEndpoint(ledge);

            if (ledge.side === "left" && hero.custom.whichDirection === "left") {
                this.hero.animations.play('grab-left');
                hero.custom.grabLeft = true;
                hero.alignIn(ledge, Phaser.TOP_LEFT, 15, 5); //offset accounts for sprite bounding box
                hero.body.position.setTo(ledge.body.x, ledge.body.y);
                this.freeze();
            }
            if (ledge.side === "right" && hero.custom.whichDirection === "right") {
                this.hero.animations.play('grab-right');
                hero.custom.grabRight = true;
                hero.alignIn(ledge, Phaser.TOP_RIGHT, 15, 5); //offset accounts for sprite bounding box
                hero.body.position.setTo(ledge.body.x, ledge.body.y);
                this.freeze();
            }
        }
    }

    getEndpoint(ledge) {
        this.endsGroup.forEach((end)=>{
            if(end.id === ledge.end) {
                this.end = end;
            }
        });
    }

    climbingLeft() { 
        this.addTweenUp();
        this.hero.input.enabled = false;
        this.hero.animations.play('climb-left');
    }

    climbingRight() {
        this.addTweenUp();
        this.hero.input.enabled = false;
        this.hero.animations.play('climb-right');
    }

    addTweenUp() {
        this.tweenUp = this.game.add.tween(this.hero).to({ y: this.goUpBy }, 1000, 'Circ.easeOut');
        this.tweenUp.onStart.add(()=>{ this.hero.anchor.y = 0.5; this.hero.input.enabled = false; }, this);
        this.tweenUp.onComplete.add(()=>{ 
            if(this.hero.custom.whichDirection === "left") {
                this.hero.animations.play('roll-left');
            } else if(this.hero.custom.whichDirection === "right") {
                this.hero.animations.play('roll-right'); 
            }
        }, this);
    }

    freeze() {
        this.hero.custom.isGrabbing = true;
        this.hero.custom.isJumping = false;
        this.hero.custom.tapped = false;
        this.hero.input.enabled = true;
        this.hero.body.stop(); //set speed/accel/velo to 0
        this.hero.body.immovable = true; //no impact from other bodies
        this.hero.body.moves = false; //physics system does not move body, but can be moved manually 
        this.hero.body.enable = false; //won't be checked for any form of collision or overlap or have its pre/post updates run.
        this.hero.body.allowGravity = false; //body's local gravity disabled
    }

    unfreeze0() {
        this.hero.body.immovable = false;
        this.hero.body.enable = true;
        this.hero.body.moves = true;  
        this.hero.body.allowGravity = true;
    }

    unfreeze() {
        this.hero.body.reset();
        this.hero.custom.tapped = false;
        this.hero.custom.isGrabbing = false;
        this.hero.custom.isClimbing = false;
        this.hero.input.enabled = true;
        this.pointerUp();
    }

    createAnims() {
        //idle
        this.idleRight = this.hero.animations.add('idle-right', Phaser.Animation.generateFrameNames('idle-right-', 0, 3, '-1.3', 2), 2, true, false);
        this.idleLeft = this.hero.animations.add('idle-left', Phaser.Animation.generateFrameNames('idle-left-', 0, 3, '-1.3', 2), 2, true, false);
    
        //run
        this.runRight = this.hero.animations.add('run-right', Phaser.Animation.generateFrameNames('run-right-', 0, 5, '-1.3', 2), 10, true, false);
        this.runLeft = this.hero.animations.add('run-left', Phaser.Animation.generateFrameNames('run-left-', 0, 5, '-1.3', 2), 10, true, false);
    
        //jump
        this.jumpRight = this.hero.animations.add('jump-right', Phaser.Animation.generateFrameNames('jump-right-', 0, 5, '-1.3', 2), 10, false, false);
        this.jumpLeft = this.hero.animations.add('jump-left', Phaser.Animation.generateFrameNames('jump-left-', 0, 5, '-1.3', 2), 10, false, false);
    
        //grab
        this.grabLeft = this.hero.animations.add('grab-left', Phaser.Animation.generateFrameNames('crnr-grb-left-', 0, 3, '-1.3', 2), 3, true, false);
        this.grabRight = this.hero.animations.add('grab-right', Phaser.Animation.generateFrameNames('crnr-grb-right-', 0, 3, '-1.3', 2), 3, true, false);
    
        //climb
        this.climbLeft = this.hero.animations.add('climb-left', Phaser.Animation.generateFrameNames('crnr-clmb-left-', 0, 4, '-1.3', 2), 10, false, false);
        this.climbRight = this.hero.animations.add('climb-right', Phaser.Animation.generateFrameNames('crnr-clmb-right-', 0, 4, '-1.3', 2), 10, false, false);

        //roll
        this.rollLeft = this.hero.animations.add('roll-left', Phaser.Animation.generateFrameNames('smrslt-left-', 0, 3, '-1.3', 2), 10, true, false);
        this.rollRight = this.hero.animations.add('roll-right', Phaser.Animation.generateFrameNames('smrslt-right-', 0, 3, '-1.3', 2), 10, true, false);

        //up from roll
        this.slideLeft = this.hero.animations.add('slide-left', Phaser.Animation.generateFrameNames('slide-left-', 0, 4, '-1.3', 2), 10, false, false);
        this.slideRight = this.hero.animations.add('slide-right', Phaser.Animation.generateFrameNames('slide-right-', 0, 4, '-1.3', 2), 10, false, false);

        //animations settings
        //JUMP
        // this.jumpRight.onStart.add(()=>{
        //     this.hero.body.velocity.x = 160;
        // }, this);
        // this.jumpRight.onComplete.add(()=> { this.hero.animations.play('idle-right'); this.hero.body.velocity.x = 0; }, this);

        // this.jumpLeft.onStart.add(()=>{
        //     this.hero.body.velocity.x = -160;
        // }, this);
        // this.jumpLeft.onComplete.add(()=> { this.hero.animations.play('idle-left'); this.hero.body.velocity.x = 0; }, this);

        ////LEFT-HAND ROLL
        this.rollLeft.onStart.add(()=>{
            this.unfreeze0();
            this.hero.body.gravity.x = -500;
        }, this);

        this.rollLeft.onLoop.add(()=>{
            this.game.physics.arcade.moveToObject(this.hero, this.end);
            if(this.hero.body.gravity.x < 0) {
                this.hero.body.gravity.x = this.hero.body.gravity.x+10;
            };
            if(this.game.physics.arcade.collide(this.hero, this.end)) {
                this.rollLeft.stop(false, true);
            } else if(this.hero.body.blocked.left || this.hero.body.touching.left || this.hero.body.position.x <= this.end.body.position.x) {
                this.rollLeft.stop(false, true);
            }
        }, this);

        this.rollLeft.onComplete.add(()=> { this.hero.animations.play('slide-left'); }, this);

        this.slideLeft.onComplete.add(()=>{ this.hero.body.speed = 0; this.unfreeze(); if(this.hero.body.gravity.x < 0) { this.hero.body.gravity.x =  0 }; }, this);

        this.climbLeft.onStart.add(()=>{ 
            this.tweenUp.start();
        }, this);

        ////RIGHT-HAND ROLL
        this.rollRight.onStart.add(()=>{
            this.unfreeze0();
            this.hero.body.gravity.x = 500;
        }, this);
        
        this.rollRight.onLoop.add(()=>{
            this.game.physics.arcade.moveToObject(this.hero, this.end);
            if(this.hero.body.gravity.x > 0) { 
                this.hero.body.gravity.x = this.hero.body.gravity.x-10;
            };
            if(this.game.physics.arcade.collide(this.hero, this.end)) {
                this.rollRight.stop(false, true);
            } else if(this.hero.body.blocked.right || this.hero.body.touching.right || this.hero.body.position.x >= this.end.body.position.x) {
                this.rollRight.stop(false, true);
            }
        }, this);
        
        this.rollRight.onComplete.add(()=> { this.hero.animations.play('slide-right'); }, this);
        
        this.slideRight.onComplete.add(()=>{ this.hero.body.speed = 0; this.unfreeze(); if(this.hero.body.gravity.x > 0) { this.hero.body.gravity.x = 0 }; }, this);
        
        this.climbRight.onStart.add(()=>{
            this.tweenUp.start();
        }, this);
        
        //play 'idle-right' by default
        this.hero.animations.play('idle-right');
    }

    addHero() {
        //iterate over available entrances
        this.entrancesGroup.forEach(entrance => {
            if(entrance.name === 'test') {
                this.hero = this.game.add.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
            }

            if (this._NEWGAME && this._LEVEL === 1) {
                //if newGame = true and loaded level is lvl1, load character at lvl1 starting pt
                if (entrance.name === 'stage1entry') { //change back to stage1entry after testing
                    this.hero = this.game.add.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
                }
            } else if (!this._NEWGAME && this._LEVEL === 1) {
                if (entrance.name === 'portalfromcave') {
                    //if returning from cave, load sprite at return pt
                    this.hero = this.game.add.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
                }
            } 
            // else { //otherwise, use whatever coordinates come back when function runs
            //     this.hero = this.game.add.sprite(entrance.x, entrance.y, 'hero', 'idle-right-00-1.3');
            // }
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
        this.hero.inputEnabled = true;
        this.hero.hitArea = this.hero.body.width * this.hero.body.height;
        //enable hero for slopes
        this.game.slopes.enable(this.hero);
        // Prefer the minimum Y offset for this physics body
        // this.hero.body.slopes.preferY = true;
        // Pull the player into downwards collisions with a velocity of 50
        // this.hero.body.slopes.pullDown = 50;
        //set custom properties
        this.hero.custom = {
            whichDirection : 'right',
            isGrabbing : false,
            grabLeft : false,
            grabRight : false,
            isClimbing: false,
            isJumping: false,
            tapped : false
        }
    }


    makeMap() {
        this.map = this.game.add.tilemap(this._LEVELS[this._LEVEL]);
        
        this.jsonfile = this.cache.getJSON(this.map.key);
        this.jsonfile.layers.forEach((layer) => {
            if(layer.name === "endpoints") {
                this.map.endpoints = layer.objects;
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
        this.sortGroup = this.game.add.group();
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
        this.game.slopes.convertTilemapLayer(this.mapLayer, 'arcadeslopes');
    }
    
    parseObjectGroups() {
        //entry points
        this.entryPoints = this.map.objects.entryPortals;
        this.entrancesGroup = this.game.add.group(this.game.world, 'entrancesGroup', false, true, Phaser.Physics.ARCADE);
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
        this.exitsGroup = this.game.add.group(this.game.world, 'exitsGroup', false, true, Phaser.Physics.ARCADE);
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
        this.ledgepoints = this.map.objects.ledgePoints;
        this.ledgesGroup = this.game.add.group(this.game.world, 'ledgesGroup', false, true, Phaser.Physics.ARCADE);
        this.ledgepoints.forEach(ledgePt => {
            this.ledge = this.ledgesGroup.create(ledgePt.x, ledgePt.y, 'point');
            this.ledge.anchor.x = 0.5;
            this.ledge.anchor.y = 0.5;
            if(ledgePt.properties) {
                this.ledge.end = ledgePt.properties.end;
                this.ledge.side = ledgePt.properties.side;
            }
            this.ledgesGroup.setAll('body.allowGravity', false);
        });
        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.visible = false;
        this.ledgesGroup.forEach(ledge => {
            this.graphics.lineStyle(3, 0xff0000).beginFill(0x000000, 0).arc(ledge.x, ledge.y, ledge.width, 0, 360, true);
            this.graphics.endFill();
        });

        //endpoints
        this.endsGroup = this.game.add.group(this.game.world, 'endsGroup', false, true, Phaser.Physics.ARCADE);
        this.map.endpoints.forEach((end)=>{
            this.endPt = this.endsGroup.create(end.x, end.y, 'portal-v');
            this.endPt.id = end.id;
            this.endPt.anchor.x = 1;
            this.endPt.anchor.y = 1;
            this.endsGroup.setAll('body.allowGravity', false);
        });

        //loot objects
        this.mapObjects = this.map.objects.objects;
        this.objectsGroup = this.game.add.group(this.game.world, 'objectsGroup', false, true, Phaser.Physics.ARCADE);
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
        this.UIgroup = this.game.add.group();

        this.restartButton = this.game.add.button(150, 0, 'restart_button', this.onRestartClick, this, null, null, null, null, this.UIgroup);

        this.easyButton = this.game.add.button(this.restartButton.x+150, 0, 'easy_button', this.onEasyClick, this, null, null, null, null, this.UIgroup);

        this.formatButtons();
    }

    formatButtons() {
        this.UIgroup.forEach((button)=>{
            button.input.useHandCursor = true;
            button.fixedToCamera = true;
            button.hitArea = button.width*button.height;

            if(this.game.width > this.game.height) {
                button.height = this.game.height/6;
                button.scale.x = button.scale.y;
            } else if(this.game.width < this.game.height) {
                button.width = this.game.width/5;
                button.scale.y = button.scale.x;
            }
        }, this);
    }

    onRestartClick() {
        this.game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
    }

    onEasyClick() {
        this.graphics.visible = !this.graphics.visible;
    }

    configure() {
        //create tilemap
        this.makeMap();
            
        //parse Tiled object groups
        this.parseObjectGroups();

        //add hero
        this.addHero();

        // //add anims
        this.createAnims();

        // Prefer the minimum Y offset globally
        this.game.slopes.preferY = true;
        //set world bounds
        this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels+100);
        this.game.camera.setBoundsToWorld();

        //initiate keyboard controls
        this.addControls();

        //create UI buttons
        this.createUI();

        //start follow
        this.game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER);
        this.game.camera.focusOn(this.hero);
        //reset camera fade once complete
        this.game.camera.onFadeComplete.add(this.resetFade, this);
    }
    
    resetFade() {
        this.game.camera.resetFX();
    }

    render() {
        // this.game.debug.body(this.hero);
        // // this.game.debug.bodyInfo(this.hero, 32, 32);
        // this.game.debug.spriteBounds(this.hero, 'rgba(0,0,255,1)', false);
        // this.ledgesGroup.forEach((ledge)=>{
        //     this.game.debug.body(ledge);
        //     this.game.debug.spriteBounds(ledge, 'rgba(255,0,0,1)', false);
        // })
        // this.endsGroup.forEach((end)=>{
        //     this.game.debug.body(end);
        //     this.game.debug.spriteBounds(end, 'rgba(255,0,0,1)', false);
        // })
        // this.UIgroup.forEach((button)=>{
        //     this.game.debug.body(button);
        //     this.game.debug.spriteBounds(button, 'rgba(255,0,0,1)', false);
        // })
    }
}
