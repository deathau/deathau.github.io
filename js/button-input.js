function buttonInputClick() {
  this.style.display = 'none'

  const buttonInput = document.createElement('div')
  buttonInput.classList.add('button-input-container')

  if(this.dataset.instruction){
    const label = document.createElement('label')
    buttonInput.appendChild(label)
    label.innerText = this.dataset.instruction
  }
  
  const input = document.createElement('input')
  buttonInput.appendChild(input)
  input.type = 'text'
  if(this.dataset.placeholder){
    input.placeholder = this.dataset.placeholder
  }

  const button = document.createElement('button')
  buttonInput.appendChild(button)
  button.innerText = "Submit"
  button.addEventListener('click', () => {
    if(this.onsubmit){
      const event = new Event('button-input-value')
      event.value = input.value
      this.onsubmit(event)
    }

    buttonInput.parentNode.removeChild(buttonInput)
    if(this.dataset.success){
      const span = document.createElement('span')
      span.classList.add('success')
      span.innerText = this.dataset.success
      setTimeout(() => {
        span.parentNode.removeChild(span)
        this.style.display = null
      }, 5000);
      this.parentNode.insertBefore(span, this.nextSibling)
    }
    else{
      this.style.display = null
    }
  })

  this.parentNode.insertBefore(buttonInput, this.nextSibling)
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.button-input').forEach(button => {
    button.addEventListener('click', buttonInputClick) 
  });
}, false);