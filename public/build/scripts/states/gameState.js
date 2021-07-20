export default class gameState extends Phaser.Scene {
    constructor() {
        super("gameState");
    }

    init(data) {
        //initialize data
        this._LEVEL = data.level;
        this._LEVELS = data.levels;
        this._NEWGAME = data.newGame;
        this.events.emit('displayUI');
        //emit event to reset if game over occurs and new game starts, check to see if new game
        if(this._NEWGAME) {
            this.events.emit('newGame');
        }
    }
    
    create() {
        //set smoothing for canvas rendering
        Phaser.Display.Canvas.Smoothing.disable(this);

        this.configure();
    }

    update() {
        //fade out and restart level if sprite falls outside world bounds y
        if (this.hero.body.position.y > this.map.heightInPixels) {
            this.cameras.main.fade(2000, 0, 0, 0);
            this.cameras.main.on('camerafadeoutcomplete', ()=>{
                this.scene.restart({level: this._LEVEL, levels: this._LEVELS, newGame: false});
            });
        }

        // this.heroConditions();
        // this.pointerConditions();
        this.keyboardConditions();
    }

    addControls() {
        //establish pointer
        if(this.sys.game.device.input.touch) {
            this.pointer = this.input.addPointer();
        } else {
            this.pointer = this.input.activePointer;
            this.input.mouse.capture = true;
        }

        //establish keyboard
        //initiate cursor keys
        this.controls = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addCapture([37, 38, 39, 40 ]);

        //add special controls for grab and climb
        this.ledgeKeys = this.input.keyboard.addKeys({ 'grab': Phaser.Input.Keyboard.KeyCodes.G, 'climb': Phaser.Input.Keyboard.KeyCodes.C });

        //anim-specific settings
        this.controls.left.on('up', ()=> { this.hero.anims.play('idle-left'); }, this);
        this.controls.right.on('up', ()=> { this.hero.anims.play('idle-right'); }, this);

        this.controls.left.on('down', ()=> { this.hero.custom.whichDirection = 'left'; }, this);
        this.controls.right.on('down', ()=> { this.hero.custom.whichDirection = 'right'; }, this);

        this.ledgeKeys.climb.on('down', ()=> {
            if (this.hero.custom.whichDirection == 'left' && this.hero.custom.isGrabbing) {
                // this.climbingLeft();
            } else if (this.hero.custom.whichDirection == 'right' && this.hero.custom.isGrabbing) {
                // this.climbingRight();
            }
        })
    }

    keyboardConditions() {
        if(this.controls.up.isUp) {
            if(this.controls.left.isDown && this.controls.right.isUp) {
                this.hero.anims.play("run-left", true);
                this.hero.setVelocityX(-3);
            } else if(this.controls.right.isDown && this.controls.left.isUp) {
                this.hero.anims.play("run-right", true);
                this.hero.setVelocityX(3);
            }
        }
    }

    createAnims() {
        //idle
        this.idleRight = this.hero.anims.create({ key: 'idle-right', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'idle-right-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 2 });
        this.idleLeft = this.hero.anims.create({ key: 'idle-left', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'idle-left-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 2 });
    
        //run
        this.runRight = this.hero.anims.create({ key: 'run-right', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'run-right-', end: 5, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.runLeft = this.hero.anims.create({ key: 'run-left', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'run-left-', end: 5, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
    
        //jump
        this.jumpRight = this.hero.anims.create({ key: 'jump-right', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'jump-right-', end: 5, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.jumpLeft = this.hero.anims.create({ key: 'jump-left', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'jump-left-', end: 5, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
    
        //grab
        this.grabRight = this.hero.anims.create({ key: 'grab-right', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'crnr-grb-right-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 3 });
        this.grabLeft = this.hero.anims.create({ key: 'grab-left', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'crnr-grb-left-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 3 });
    
        //climb
        this.climbRight = this.hero.anims.create({ key: 'climb-right', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'crnr-clmb-right-', end: 4, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.climbLeft = this.hero.anims.create({ key: 'climb-left', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'crnr-clmb-left-', end: 4, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });

        //roll
        this.rollRight = this.hero.anims.create({ key: 'roll-right', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'smrslt-right-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.rollLeft = this.hero.anims.create({ key: 'roll-left', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'smrslt-left-', end: 3, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        
        //up from roll
        this.slideRight = this.hero.anims.create({ key: 'slide-right', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'slide-right-', end: 4, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.slideLeft = this.hero.anims.create({ key: 'slide-left', repeat: 0, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'slide-left-', end: 4, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });

        //drop
        this.fallRight = this.hero.anims.create({ key: 'fall-right', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'fall-right-', end: 1, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });
        this.fallLeft = this.hero.anims.create({ key: 'fall-left', repeat: -1, frames: this.hero.anims.generateFrameNames('hero', { prefix: 'fall-left-', end: 1, suffix: '-1.3', zeroPad: 2 }), frameRate: 10 });

        // //animations settings
        this.hero.on('animationstart', (anim)=> {
            this.events.emit(`animationstart_${anim.key}`, [anim]);
        }, this);

        // this.hero.on('animationstart_run-right', this.run, this);
        
        //play 'idle-right' by default
        this.hero.anims.play('idle-right');
    }

    addColliders() {
        // this.matter.world.on("collisionstart", function(event, bodyA, bodyB){
        //     if((bodyA.label == "diamond" &amp;&amp; bodyB.label != "car") || (bodyB.label == "diamond" &amp;&amp; bodyA.label != "car")){
        //         this.scene.start("PlayGame")
        //     }
 
        // }.bind(this));
    }

    addHero() {
        //iterate over available entrances
        this.entryPoints.objects.forEach(entry => {
            if(this._LEVEL === 2) { //remove after testing
                if(entry.name === 'test') {
                    this.hero = this.matter.add.sprite(entry.x, entry.y, 'hero', 'idle-right-00-1.3');
                }
            }

            if (this._NEWGAME && this._LEVEL === 1) {
                //if newGame = true and loaded level is lvl1, load character at lvl1 starting pt
                if (entry.name === 'stage1entry') { //change back to stage1entry after testing
                    this.hero = this.matter.add.sprite(entry.x, entry.y, 'hero', 'idle-right-00-1.3');
                }
            } else if (!this._NEWGAME && this._LEVEL === 1) {
                if (entry.name === 'portalfromcave') {
                    //if returning from cave, load sprite at return pt
                    this.hero = this.matter.add.sprite(entry.x, entry.y, 'hero', 'idle-right-00-1.3');
                }
            } else { //otherwise, use whatever coordinates come back when function runs
                this.hero = this.matter.add.sprite(entry.x, entry.y, 'hero', 'idle-right-00-1.3');
            }
        });
    
        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.hero;

        var cx = w / 2;
        var cy = h / 2;
        const mainBody = Bodies.rectangle(cx, cy, w * 0.3, h-5, { chamfer: { radius: 10 } });
        this.hero.sensors = {
            bottom: Bodies.rectangle(cx, h, w * 0.25, 2, { isSensor: true }),
            top: Bodies.rectangle(cx, cy * 0.25, w * 0.25, 2, { isSensor: true }),
            left: Bodies.rectangle(cx-(cx/3), cy, 2, h*0.75, { isSensor: true }),
            right: Bodies.rectangle(cx+(cx/3), cy, 2, h*0.75, { isSensor: true }),
            // leftCorner: Bodies.rectangle( { isSensor: true, label: 'leftCorner' }),
            // rightCorner: Bodies.rectangle( { isSensor: true, label: 'rightCorner' })
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.hero.sensors.bottom, this.hero.sensors.top, this.hero.sensors.left, this.hero.sensors.right,/* this.hero.sensors.leftCorner, this.hero.sensors.rightCorner*/],
            frictionStatic: 0.20, // 0-> , def. 0.5
            frictionAir: 0.020, //0-> , def. 0.01
            friction: 0.95, //0 - 1 , def. 0.1
            density: 0.2, //0.001-> , def. 0.001
            restitution: 0.05, //0->1, def. 0,
        });
        this.hero.setExistingBody(compoundBody).setFixedRotation();

        this.hero.setDepth(2);
        this.hero.setInteractive(mainBody)
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
        this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] });
        
        this.jsonfile = this.cache.json.get(this._LEVELS[this._LEVEL]);
        
        //Multi-layer
        this.tilesets = this.map.tilesets;
        //establish foreground & background tilesets
        for (let i = 0; i < this.tilesets.length; i++) {
            this.map.addTilesetImage(this.tilesets[i].name);
        }
        
        //render tile layers
        this.backgroundLayer = this.map.createLayer(`${this._LEVELS[this._LEVEL]}-bg`, `${this._LEVELS[this._LEVEL]}_bg`);

        this.mapLayer = this.map.createLayer(`${this._LEVELS[this._LEVEL]}-platform-collides`, 'arcade-slopes-16');
        this.mapLayer.visible = false;
        //convert collider layer to matter
        this.mapLayer.setCollisionByProperty({ collides: true});
        this.matter.world.convertTilemapLayer(this.mapLayer);

        this.foregroundLayer = this.map.createLayer(`${this._LEVELS[this._LEVEL]}-fg`, `${this._LEVELS[this._LEVEL]}_fg`);
        this.foregroundLayer.setDepth(5);
    }
    
    parseObjectGroups() {
        //entry points
        this.entryPoints = this.map.getObjectLayer('entryPortals');
        this.entryPoints.objects.forEach(entryPt => {
            this.entrance = this.add.zone(entryPt.x, entryPt.y, entryPt.width, entryPt.height);
            this.entrance.name = entryPt.name;
        });
    
        //exit points
        this.exitPoints = this.map.getObjectLayer('exitPortals');
        this.exitGroup = this.add.group();
        this.exitPoints.objects.forEach(exitPt => { //add onCollideCallback in matter.image call
            if (exitPt.type === 'goal') {
                this.goal = this.matter.add.image(exitPt.x, exitPt.y, 'objects', 'house', { ignoreGravity: true, label: exitPt.name });
                this.goal.setDepth(3);
            } else if (exitPt.type === 'exitportal') {
                //default cases for nonspecial exits
                this.exit = this.add.zone(exitPt.x, exitPt.y, exitPt.width, exitPt.height);
                this.exitGroup.add(this.exit);
            }
        });
    
        //ledge points
        this.ledges = this.map.getObjectLayer('ledgePoints');
        this.ledgeTargets = this.add.graphics();
        this.ledgeTargets.visible = false;

        this.ledges.objects.forEach(ledge => { //add onCollideCallback in matter.image call
            this.ledge = this.matter.add.image(ledge.x, ledge.y, 'point', null, { isSensor: true, label: ledge.name, ignoreGravity: true });

            var a = new Phaser.Geom.Point(this.ledge.x, this.ledge.y);
            var radius = this.ledge.width;
            this.ledgeTargets.lineStyle(3, 0xff0000, 1).strokeCircle(a.x, a.y, radius).setDepth(142);

            if(ledge.properties) {
                this.ledge.end = ledge.properties[0];
                this.ledge.side = ledge.properties[1];
                
                if(this.ledge.side.value === "left") {
                    this.ledge.originX = 0;
                    this.ledge.originY = 0;
                } else if(this.ledge.side.value === "right") {
                    this.ledge.originX = 0;
                    this.ledge.originY = 1;
                }
            }
        });

        //endpoints
        this.ends = this.map.getObjectLayer("endpoints");
        this.ends.objects.forEach((end)=>{
            this.endPt = this.matter.add.image(end.x, end.y, 'point', null, { isSensor: true, label: end.name, ignoreGravity: true });
            this.endPt.id = end.id;
            this.endPt.originX = 1;
            this.endPt.originY = 1;
        });

        //loot objects
        this.loot = this.map.getObjectLayer("objects");
        this.loot.objects.forEach(objectPt => {
            this.frame = objectPt.name;
            this.loot = this.matter.add.image(objectPt.x, objectPt.y, 'objects', this.frame, { isSensor: true, label: objectPt.name, ignoreGravity: true });
            this.loot.setDepth(24);
        });
    }
    
    onGoal(hero, goal) {
        this.cameras.main.fadeOut(2000, 0,0,0);
        this.cameras.main.on("camerafadeoutcomplete", ()=>{
            //launch end cutscene
            var data = {level: 5, newGame: false, levels: this._LEVELS}
            this.game.scene.start('NPC', data);
        }, this);
    }
    
    getLoot(hero, loot) {
        loot.destroy();
    }
    
    exitStage(hero, portal) {
        if (portal.name === 'portaltocave') {
            this.scene.restart({ level: 2, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltotree') {
            this.scene.restart({ level: 3, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltocottage') {
            this.scene.restart({ level: 4, levels: this._LEVELS, newGame: false });
        } else if (portal.name === 'portaltobridge') {
            this.scene.restart({ level: 1, levels: this._LEVELS, newGame: false });
        }
    }

    configure() {
        //create tilemap
        this.makeMap();
            
        //parse Tiled object groups
        this.parseObjectGroups();

        // //add hero
        this.addHero();

        // // //add anims
        this.createAnims();

        // //initiate controls
        this.addControls();

        //initiate colliders
        this.addColliders();

        //bring UI scene above game scene
        // this.scene.bringToTop('UI');

        //establish camera and bounds
        // //set world bounds
        this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //establish camera follow
        this.cameras.main.startFollow(this.hero);

        // if(this.cameras.main.width < this.cameras.main.height) {
        //     this.cameras.main.setZoom(2);
        // }
        
        // //reset camera fade once complete
        this.cameras.main.on("camerafadeoutcomplete", this.resetFade, this)

        // this.matter.world.createDebugGraphic();
        // this.matter.world.drawDebug = true;
        // this.input.enableDebug(this.restartButton);
        // this.input.enableDebug(this.easyButton);
    }
    
    resetFade() {
        this.cameras.main.resetFX();
    }
}
