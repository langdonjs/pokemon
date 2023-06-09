class Sprite{
    constructor({position, image, frames = {max: 1} , sprites = [], isEnemy}){
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.sprites = sprites

        this.image.onload = () => {
            this.width = this.image.width /  this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.opacity = 1
        this.health = 100
        this.isEnemy = isEnemy
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image, 
            this.frames.val * this.width, 
            0, 
            this.image.width/this.frames.max, 
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max, 
            this.image.height
        )
        c.restore()

        if(!this.moving) return
        if(this.frames.max > 1) {
            this.frames.elapsed++
        }

        if(this.frames.elapsed % 10 === 0){
        if(this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }
    }   

    attack({attack, recipient}){
        switch(attack.name){
            case 'Hydro Pump':
            case 'Tackle':
            const tl = gsap.timeline()

            this.health -= attack.damage

            let movementDistance = 20
            if(this.isEnemy) movementDistance = -20

            let healthBar ='#enemyHealthBar'
            if(this.isEnemy) healthBar = '#playerHealthBar'

            tl.to(this.position, {
                x: this.position.x-movementDistance
            }).to(this.position, {
                x: this.position.x + movementDistance * 3,
                duration: 0.1,
                onComplete:  () => {
                    gsap.to(healthBar, {
                        width: this.health + '%'
                    })
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    })

                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo: true,
                        duration: 0.08
                    })
                }
            }).to(this.position, {
                x: this.position.x
            })
            if(this.health <= 0) {
                document.querySelector('#dialogueBox').style.display = 'block'
                document.querySelector('#dialogueBox').addEventListener('click', () => {
                    console.log('clicked')
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                          cancelAnimationFrame(battleAnimationId)
                          animate()
                          document.querySelector('#userInterface').style.display = 'none'
          
                          gsap.to('#overlappingDiv', {
                            opacity: 0
                          })
          
                          battle.initiated = false
                        }
                      })
                })
            }
            break;
        }
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({position}){
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}