document.getElementById('btn').addEventListener('click', () => {
  const initData = window.Telegram.WebApp.initDataUnsafe

  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(initData)
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Network response was not ok')
      }
    })
    .then((data) => {
      console.log('Response from server:', data)
      document.getElementById('response').innerText = JSON.stringify(data)

      // Если в ответе есть токен, сохраняем его
      const token = data.body

      // Сохраняем токен в localStorage, sessionStorage или переменной, в зависимости от ваших требований
      localStorage.setItem('token', token)
    })
    .catch((error) => {
      console.error('Error:', error)
      document.querySelector('h1').style.color = 'red'
      document.getElementById('response').innerText = JSON.stringify(error)
    })
})

document.getElementById('btnsec').addEventListener('click', () => {
  // Получаем токен из localStorage, sessionStorage или переменной, в зависимости от того, где вы его сохраняли
  const token = localStorage.getItem('token')

  if (!token) {
    console.error('Token is not available')
    return
  }

  fetch('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({}) // Отправляем пустое тело, так как токен передаем через заголовок
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Network response was not ok')
      }
    })
    .then((data) => {
      console.log('Response from server with token:', data)
      document.getElementById('responseToken').innerText = JSON.stringify(data)
    })
    .catch((error) => {
      console.error('Error:', error)
      document.querySelector('h1').style.color = 'red'
      document.getElementById('responseToken').innerText = JSON.stringify(error)
    })
})
