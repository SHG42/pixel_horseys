import makeMap from "./configurators/makeMap.js";

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
            
        // //parse Tiled object groups
        // this.parseObjectGroups(game, Phaser);

        // //add hero
        // this.addHero(game, Phaser);

        // // //add anims
        // this.createAnims(game, Phaser);

        // // Prefer the minimum Y offset globally
        // game.slopes.preferY = true;
        // //set world bounds
        // game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels+100);
        // game.camera.setBoundsToWorld();

        // //initiate keyboard controls
        // this.addControls(game, Phaser);

        // //create UI buttons
        // this.createUI(game, Phaser);

        // //start follow
        // game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER);
        // game.camera.focusOn(this.hero);
        // //reset camera fade once complete
        // game.camera.onFadeComplete.add(this.resetFade, this);
    }

    createAnims(game, Phaser) {
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

    addHero(game, Phaser) {
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
        this.hero.body.slopes.preferY = true;
        // Pull the player into downwards collisions with a velocity of 50
        this.hero.body.slopes.pullDown = 50;
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
    
    parseObjectGroups(game, Phaser) {
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

    createUI(game, Phaser) {
        this.UIgroup = this.game.add.group();

        this.restartButton = this.game.add.button(150, 0, 'restart_button', this.onRestartClick, this, null, null, null, null, this.UIgroup);

        this.easyButton = this.game.add.button(this.restartButton.x+150, 0, 'easy_button', this.onEasyClick, this, null, null, null, null, this.UIgroup);

        this.formatButtons();
    }

    formatButtons(game, Phaser) {
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

    onRestartClick(game, Phaser) {
        game.state.restart(true, false, { level: this._LEVEL, levels: this._LEVELS, newGame: false });
    }

    onEasyClick(game, Phaser) {
        this.graphics.visible = !this.graphics.visible;
    }
}