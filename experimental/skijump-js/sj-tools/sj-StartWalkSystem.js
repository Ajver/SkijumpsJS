
SJ.StartWalkSystem =
class {
    constructor() {
        this.walkTimer = new SJ.Timer(3000, true);
        this.walkTimer.onTimeout(() => {
            this._isWalking = false;
            SJ.jumper.animationPlayer.play("wave")
        })

        this._isWalking = true; 

        this.diffPosition = {
            x: 200,
            y: 100
        }
        
        const targetPosition = SJ.V.jumperPosition;

        this.startPosition = {
            x: targetPosition.x - this.diffPosition.x,
            y: targetPosition.y - this.diffPosition.y
        }
    }

    update() {
        if(this._isWalking) {
            this.walkTimer.tick();

            const progress = this.walkTimer.getProgress();
            const curPos = Matter.Vector.create(
                this.startPosition.x + this.diffPosition.x * progress,
                this.startPosition.y + this.diffPosition.y * progress
            );

            SJ.jumper.body.position = Matter.Vector.add(curPos, SJ.jumper.offsetPoint);
        }
    }
}