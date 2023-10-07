import confetti from 'canvas-confetti'

export const confettiBasicCannon = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}

export const confettiRealisticLook = (): void => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 }
  }

  const confettiFire = (
    particleRatio: number,
    opts: {
      spread: number
      startVelocity?: number
      decay?: number
      scalar?: number
    }
  ): void => {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      })
    )
  }

  confettiFire(0.25, {
    spread: 26,
    startVelocity: 55
  })
  confettiFire(0.2, {
    spread: 60
  })
  confettiFire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })
  confettiFire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })
  confettiFire(0.1, {
    spread: 120,
    startVelocity: 45
  })
}

export const confettiStar = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  }

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    })

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    })
  }

  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
  setTimeout(shoot, 200)
}
