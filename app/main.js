window.onload = () =>{
    const mailerfomr = document.getElementById('mailer-form')
    mailerfomr.onsubmit = async (e) => {
        e.preventDefault()
        const error = document.getElementById('error')
        error.innerHTML = ''

        const formData = new FormData(mailerfomr)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
        const response = await fetch('/send', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const responseText = await response.text()
        if(response.status > 300){
            const error = document.getElementById('error')
            error.innerHTML = responseText
            return
        }

        mailerfomr.reset()
        alert('Mail sended')
    }
}