# Autenticação Firebase

Este módulo fornece funções para autenticação usando Firebase, incluindo login com Google, email/senha, cadastro, logout e escuta de mudanças de autenticação.

## Como usar

### Importação

```js
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthChange
} from './modules/auth/auth.js'
```

### Login com Google

```js
loginWithGoogle()
  .then(user => console.log(user))
  .catch(err => alert(err.message))
```

### Login com Email/Senha

```js
loginWithEmail(email, password)
  .then(user => console.log(user))
  .catch(err => alert(err.message))
```

### Cadastro com Email/Senha

```js
registerWithEmail(email, password)
  .then(user => console.log(user))
  .catch(err => alert(err.message))
```

### Logout

```js
logout()
```

### Escutar Mudanças de Autenticação

```js
onAuthChange(user => {
  if (user) {
    // Usuário autenticado
  } else {
    // Usuário deslogado
  }
})
```
