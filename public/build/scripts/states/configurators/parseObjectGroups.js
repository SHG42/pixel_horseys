export default class parseObjectGroups {
    constructor(game, Phaser, map) {
        //entry points
        this.entryPoints = map.map.objects.entryPortals;
        this.entrancesGroup = game.add.group(game.world, 'entrancesGroup', false, true, Phaser.Physics.ARCADE);
        this.entryPoints.forEach(entryPt => {
            if (entryPt.type === 'levelentry' || entryPt.type === 'entryportal') {
                if (entryPt.width < entryPt.height) {
                    this.entrance = game.add.sprite(entryPt.x, entryPt.y, 'portal-v');
                } else if (entryPt.width > entryPt.height) {
                    this.entrance = game.add.sprite(entryPt.x, entryPt.y, 'portal-h');
                } else {
                    this.entrance = game.add.sprite(entryPt.x, entryPt.y, 'point');
                }
                this.entrance.name = entryPt.name;
                this.entrancesGroup.add(this.entrance);
                this.entrancesGroup.setAll('body.allowGravity', false);
            }
        });

        //exit points
        this.exitPoints = map.map.objects.exitPortals;
        this.exitsGroup = game.add.group(game.world, 'exitsGroup', false, true, Phaser.Physics.ARCADE);
        this.exitPoints.forEach(exitPt => {
            if (exitPt.type === 'goal') {
                this.goal = game.add.sprite(exitPt.x, exitPt.y, 'objects', 'house');
                this.goal.name = exitPt.name;
                game.physics.arcade.enable(this.goal);
                this.goal.position.y = this.goal.position.y - this.goal.body.height;
                this.goal.body.allowGravity = false;
                this.goal.body.immovable = true;
                this.goal.body.moves = false;
                map.sortGroup.add(this.goal);
            } else if (exitPt.type === 'exitportal') {
                //default cases for nonspecial exits
                this.exit = game.add.sprite(exitPt.x, exitPt.y, 'point');
                this.exitsGroup.add(this.exit);
                this.exit.body.width = exitPt.width;
                this.exit.body.height = exitPt.height;
                this.exit.name = exitPt.name;
                if (exitPt.width < exitPt.height) {
                    this.exit.loadTexture("portal-v");
                } else if (exitPt.width > exitPt.height) {
                    this.exit.loadTexture("portal-h");
                }
            }
            this.exitsGroup.setAll('body.allowGravity', false);
        });

        //ledge points
        this.ledgepoints = map.map.objects.ledgePoints;
        this.ledgesGroup = game.add.group(game.world, 'ledgesGroup', false, true, Phaser.Physics.ARCADE);
        this.ledgepoints.forEach(ledgePt => {
            this.ledge = this.ledgesGroup.create(ledgePt.x, ledgePt.y, 'point');
            this.ledge.anchor.x = 0.5;
            this.ledge.anchor.y = 0.5;
            if (ledgePt.properties) {
                this.ledge.end = ledgePt.properties.end;
                this.ledge.side = ledgePt.properties.side;
            }
            this.ledgesGroup.setAll('body.allowGravity', false);
        });
        this.graphics = game.add.graphics(0, 0);
        this.graphics.visible = false;
        this.ledgesGroup.forEach(ledge => {
            this.graphics.lineStyle(3, 0xff0000).beginFill(0x000000, 0).arc(ledge.x, ledge.y, ledge.width, 0, 360, true);
            this.graphics.endFill();
        });

        //endpoints
        this.endsGroup = game.add.group(game.world, 'endsGroup', false, true, Phaser.Physics.ARCADE);
        map.map.objects.endpoints.forEach((end) => {
            this.endPt = this.endsGroup.create(end.x, end.y, 'portal-v');
            this.endPt.id = end.id;
            this.endPt.anchor.x = 1;
            this.endPt.anchor.y = 1;
            this.endsGroup.setAll('body.allowGravity', false);
        });

        //loot objects
        this.mapObjects = map.map.objects.objects;
        this.objectsGroup = game.add.group(game.world, 'objectsGroup', false, true, Phaser.Physics.ARCADE);
        this.mapObjects.forEach(objectPt => {
            if (objectPt.type === 'loot') {
                map.map.createFromObjects('objects', objectPt.gid, 'objects', objectPt.name, true, false, this.objectsGroup);
                this.objectsGroup.setAll('body.allowGravity', false);
            }
        });
    }
}
