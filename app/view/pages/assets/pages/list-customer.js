const insertButton = document.getElementById('insert')

insertButton.addEventListener('click', async () => { 
    api.customer.insert({})
})