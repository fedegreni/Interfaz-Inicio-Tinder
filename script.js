const DECISION_THRESHOLD = 75
let isAnimating = false;
let pullDeltaX = 0 //distancia que la card se esta animando

function startDrag(event) {
    if (isAnimating) return

    //recuperando el primer elemento de articulo
    const actualCard = event.target.closest('article');
    
    //obteniendo la posicion de la card
    const startX = event.pageX ?? event.touches[0].pageX
    console.log(startX)

    //escuchar touch y movimiento
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove,  { passive: true })
    document.addEventListener('touchend', onEnd,  { passive: true })

    function onMove(event) {
        const currentX = event.pageX ?? event.touches[0].pageX
        pullDeltaX = currentX - startX

        if (pullDeltaX === 0) return

        isAnimating = true
        //distancia
        const deg = pullDeltaX / 14
        //aplicando la transformacion
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        //cambio de cursor
        actualCard.style.cursor = "grabbing"

        //cambiar opacidad
        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0

        const choiseEl = isRight
        ? actualCard.querySelector(".choice.like")
        : actualCard.querySelector(".choice.nope")
        choiseEl.style.opacity = opacity

        }
        function onEnd(event) {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onEnd)

            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('touchend', onEnd)

          // saber si el usuario tomo una decisión
      const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

      if (decisionMade) {
        const goRight = pullDeltaX >= 0

        // add class according to the decision
        actualCard.classList.add(goRight ? 'go-right' : 'go-left')
        actualCard.addEventListener('transitionend', () => {
          actualCard.remove()
        })
      } else {
        actualCard.classList.add('reset')
        actualCard.classList.remove('go-right', 'go-left')

        actualCard.querySelectorAll('.choice').forEach(choice => {
          choice.style.opacity = 0
        })
      }

        //reset variable
        actualCard.addEventListener("transitionend", () => {
            actualCard.removeAttribute("style")
            actualCard.classList.remove("reset")

        pullDeltaX = 0
        isAnimating = false
        })
    }
}

    document.addEventListener('mousedown', startDrag)
    document.addEventListener('touchstart', startDrag, { passive: true })
 