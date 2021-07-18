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
        // //fade out and restart level if sprite falls outside world bounds y
        // if (this.hero.body.position.y > this.map.heightInPixels) {
        //     this.cameras.main.fade(2000, 0, 0, 0);
        //     this.cameras.main.on('camerafadeoutcomplete', ()=>{
        //         this.scene.restart({level: this._LEVEL, levels: this._LEVELS, newGame: false});
        //     });
        // }

        // this.heroConditions();

        // if(this._pointerIsActive && !this._keyboardIsActive) {
        //     this.pointerConditions();
        // } else if(!this._pointerIsActive && this._keyboardIsActive) {
        //     this.keyboardConditions();
        // }
    }

    addControls() {
        if(this._pointerIsActive && !this._keyboardIsActive) {
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
        } else if(!this._pointerIsActive && this._keyboardIsActive) {
            //establish keyboard
            //initiate cursor keys
            this.controls = this.game.input.keyboard.createCursorKeys();
            //add special controls for grab and climb
            this.grabKey = this.game.input.keyboard.addKey(71); //'G'
            this.climbKey = this.game.input.keyboard.addKey(67); //'C'

            this.game.input.keyboard.addKeyCapture([37, 38, 39, 40 ]);

            //anim-specific settings
            this.controls.left.onUp.add(()=> { this.hero.animations.play('idle-left'); }, this);
            this.controls.right.onUp.add(()=> { this.hero.animations.play('idle-right'); }, this);

            this.controls.left.onDown.add(()=> { this.hero.custom.whichDirection = 'left' }, this);
            this.controls.right.onDown.add(()=> { this.hero.custom.whichDirection = 'right' }, this);

            this.climbKey.onDown.add(()=> {
                if (this.hero.custom.whichDirection == 'left' && this.hero.custom.isGrabbing) {
                    this.climbingLeft();
                } else if (this.hero.custom.whichDirection == 'right' && this.hero.custom.isGrabbing) {
                    this.climbingRight();
                }
            })
        }
    }

    keyboardConditions() {
        //Running anims
        if(this.controls.up.isUp && this.hero.isOnGround) {
            if (this.controls.left.isDown && this.controls.right.isUp) {
                this.hero.body.velocity.x = -150;
                this.hero.animations.play('run-left');
            } else if (this.controls.right.isDown && this.controls.left.isUp) {
                this.hero.body.velocity.x = 150;
                this.hero.animations.play('run-right');
            } 
        } 

        if(this.controls.up.isDown && (this.hero.animations.currentAnim.name.includes("idle") || this.hero.animations.currentAnim.name.includes("run"))) {
            this.hero.animations.currentAnim.stop(false, true);
        }

        //Jumping
        if (this.controls.up.justDown && this.hero.isOnGround) {
            this.hero.body.velocity.y = -325;
            if(this.hero.body.velocity.y < -325) {
                this.hero.body.velocity.y = -325;
            }
        }

        if(this.controls.left.isUp && this.controls.right.isUp) {
            if (this.hero.isAirborne && this.hero.custom.whichDirection == "left") {
                this.hero.body.velocity.x = 0;
                this.hero.animations.play('quick-jump-left');
            } else if (this.hero.isAirborne && this.hero.custom.whichDirection == "right") {
                this.hero.body.velocity.x = 0;
                this.hero.animations.play('quick-jump-right');
            }
        }

        if(this.hero.custom.whichDirection == "left" && this.hero.isAirborne && this.controls.left.isDown && this.controls.right.isUp) {
            this.hero.body.velocity.x = -180;
            this.hero.animations.play('slow-jump-left');
        } else if(this.hero.custom.whichDirection == "right" && this.hero.isAirborne && this.controls.right.isDown && this.controls.left.isUp) {
            this.hero.body.velocity.x = 180;
            this.hero.animations.play('slow-jump-right');
        }

        //ledge release
        if(this.controls.down.isDown && (this.hero.body.immovable || !this.hero.body.moves || this.hero.custom.isGrabbing)) {
            this.hero.body.immovable = false;
            this.hero.body.moves = true;
            this.hero.custom.isGrabbing = false;
            this.hero.body.enable = true;
            this.controls.left.enabled = true;
            this.controls.right.enabled = true;
        }
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
            if(!this.hero.body.blocked.left && !this.hero.body.touching.left) {
                this.hero.body.position.x-=3;
            }
        } else if(this.hero.custom.whichDirection === "right") {
            this.hero.animations.play('jump-right');
            if(!this.hero.body.blocked.left && !this.hero.body.touching.left) {
                this.hero.body.position.x+=3;
            }
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
        if((hero.custom.tapped || (this.grabKey.enabled && this.grabKey.isDown)) && hero.body.velocity.y < 0) {
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
        this.jumpRight.onStart.add(()=>{
            this.hero.body.velocity.x = 160;
        }, this);
        this.jumpRight.onComplete.add(()=> { this.hero.animations.play('idle-right'); this.hero.body.velocity.x = 0; }, this);

        this.jumpLeft.onStart.add(()=>{
            this.hero.body.velocity.x = -160;
        }, this);
        this.jumpLeft.onComplete.add(()=> { this.hero.animations.play('idle-left'); this.hero.body.velocity.x = 0; }, this);

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
            } 
            // else { //otherwise, use whatever coordinates come back when function runs
            //     this.hero = this.add.sprite(entry.x, entry.y, 'hero', 'idle-right-00-1.3');
            // }
        });
    
        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = this.hero;
        var top = this.matter.bodyBounds.getTopCenter(this.hero);
        var topLeft = this.matter.bodyBounds.getTopLeft(this.hero);
        var topRight = this.matter.bodyBounds.getTopRight(this.hero);
        var bottom = this.matter.bodyBounds.getBottomCenter(this.hero);        
        var left = this.matter.bodyBounds.getLeftCenter(this.hero);        
        var right = this.matter.bodyBounds.getRightCenter(this.hero);

        //top
        //x: 0
        //y: 18.5
        // bottom
        //x: 0
        //y: -18.5

        var cx = w / 2;
        var cy = h / 2;
        const mainBody = Bodies.rectangle(cx, cy, w * 0.3, h-5, { chamfer: { radius: 10 } });
        this.sensors = {
            bottom: Bodies.rectangle(cx, h, w * 0.25, 2, { isSensor: true }),
            top: Bodies.rectangle(cx, cy * 0.25, w * 0.25, 2, { isSensor: true }),
            left: Bodies.rectangle(cx-(cx/3), cy, 2, h*0.75, { isSensor: true }),
            right: Bodies.rectangle(cx+(cx/3), cy, 2, h*0.75, { isSensor: true }),
            // leftCorner: Bodies.rectangle( { isSensor: true, label: 'leftCorner' }),
            // rightCorner: Bodies.rectangle( { isSensor: true, label: 'rightCorner' })
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.top, this.sensors.left, this.sensors.right,/* this.sensors.leftCorner, this.sensors.rightCorner*/],
            frictionStatic: 0.9, // 0-> , def. 0.5
            frictionAir: 0.07, //0-> , def. 0.01
            friction: 0.9, //0 - 1 , def. 0.1
            density: 0.1, //0.001-> , def. 0.001
            restitution: 0.05
        });
        this.hero
            .setExistingBody(compoundBody)
            .setFixedRotation() // Sets inertia to infinity so the player can't rotate
            .setIgnoreGravity(true);


        // this.hero.body.setSize(this.hero.body.halfWidth-10, this.hero.body.height-5, 18, 3);
        this.hero.setDepth(3);
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
        this.backgroundLayer.setDepth(1);

        this.mapLayer = this.map.createLayer(`${this._LEVELS[this._LEVEL]}-platform-collides`, 'arcade-slopes-16');
        this.mapLayer.visible = false;
        this.mapLayer.setDepth(2);
        //convert collider layer to matter
        this.mapLayer.setCollisionByProperty({collides: true});
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
        // this.createAnims();

        // //initiate keyboard controls
        // this.addControls();

        //initiate colliders
        //this.addColliders();

        //bring UI scene above game scene
        // this.scene.bringToTop('UI');

        //establish camera and bounds
        // //set world bounds
        this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //establish camera follow
        // this.cameras.main.startFollow(this.hero);

        // if(this.cameras.main.width < this.cameras.main.height) {
        //     this.cameras.main.setZoom(2);
        // }
        
        // //reset camera fade once complete
        // this.cameras.main.on("camerafadeoutcomplete", this.resetFade, this)

        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug = true;
        // this.input.enableDebug(this.restartButton);
        // this.input.enableDebug(this.easyButton);
    }
    
    resetFade() {
        this.cameras.main.resetFX();
    }
}
