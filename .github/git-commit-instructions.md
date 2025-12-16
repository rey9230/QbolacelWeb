# 🧠 Instrucciones para IA: Redacción de mensajes de commit en Git

## 🎯 Objetivo general
Generar **mensajes de commit de Git en español, hablado como un cubano**, con un tono **natural, claro y desenfadado**, explicando **qué cambió y por qué** de forma comprensible para otros desarrolladores.

## 🗂️ Formato general del commit
Cada mensaje debe seguir esta estructura:

`resumen breve y natural del cambio`
`explicación corta y clara de lo que se hizo y por qué`

shell
Copy code

### 💡 Ejemplo
Actualizo el flujo del checkout para manejar errores de red 🛠️

Ahora el sistema muestra un mensaje claro cuando falla la conexión con el backend, y el usuario puede reintentar sin perder sus datos.

markdown
Copy code

## 💬 Estilo de redacción
- Usa **lenguaje natural y cercano**, como si se lo explicaras a un compañero de equipo.  
- Evita tecnicismos innecesarios o frases genéricas como “cambios menores”.  
- Puedes usar **emojis** con moderación para dar contexto o tono (por ejemplo: 🛠️, 🚀, 🔧, 🐛, ✨, 💬, 🧹, etc.).  
- **Siempre escribe en español.**  
- Explica de forma breve **qué se cambió** y **por qué**.  
- Si el commit corrige un error, usa 🐛.  
  Si mejora rendimiento o interfaz, usa ✨ o ⚡️.  
- Prioriza la **claridad** y **utilidad práctica**.

## 📘 Ejemplos de commits bien escritos

### 🐛 Corrección de error
Corrijo bug al guardar los datos del perfil 🐛

El formulario no estaba validando correctamente el email, ahora se muestra un mensaje claro si el formato es inválido.

shell
Copy code

### ✨ Nueva funcionalidad
Agrego selector de país en el registro ✨

Los usuarios ahora pueden elegir su país desde un menú desplegable. También se actualizó la API para recibir este dato.

shell
Copy code

### 🔧 Refactor o mejora de código
Refactorizo el manejo de tokens en el backend 🔧

Centralizo toda la lógica de validación de tokens en una sola clase para evitar duplicación y mejorar mantenimiento.

shell
Copy code

### 🧹 Limpieza o mantenimiento
Limpio código no usado y mejoro logs internos 🧹

Elimino funciones duplicadas y organizo los mensajes de log para que sean más útiles al depurar.

shell
Copy code

### 🚀 Mejora de rendimiento
Optimizo carga de contactos en pantalla principal 🚀

Ahora los contactos se cargan en segundo plano y la interfaz responde más rápido al abrir la app.

markdown
Copy code

## 🧩 Commits con varios tipos de cambios
- Divide la explicación en **párrafos o frases cortas**, mencionando cada parte del cambio.  
- Si un commit incluye varios temas (por ejemplo, corrección + mejora visual), descríbelos de forma clara y separada.  
- Siempre prioriza la **comprensión humana** sobre la descripción técnica.  

## ⚙️ Ejemplo de solicitud completa
> “Explica este commit siguiendo las reglas anteriores:  
> Cambié el componente `<Select>` para que mantenga un tamaño fijo, limite el texto a 15 caracteres, seleccione la primera opción por defecto y actualice su valor cuando se cargan los datos.”

👉 **Resultado esperado:**
Mejoro el comportamiento del componente `<Select>` 🧩

Ahora mantiene un tamaño constante, muestra solo los primeros 15 caracteres, selecciona la primera opción por defecto y se actualiza cuando llegan los datos. Así se ve más limpio y consistente.

markdown
Copy code

## ✅ Resumen final
- Lenguaje natural y fluido.  
- Siempre en español.  
- Explica **qué cambió** y **por qué**.  
- Usa emojis de forma **moderada y contextual**.  
- Evita tecnicismos innecesarios.  
- Busca que el commit sea **entendible, breve y útil**.

## ✨ Ejemplo de commit perfecto
Añado validación de teléfono en el formulario de registro 📱

Se valida que el número tenga 8 dígitos y empiece con +53. También se muestra un mensaje claro si el formato es incorrecto.

yaml
Copy code

---

Guarda todo este contenido en formato **Markdown (.md)**, con una estructura limpia y legible, lista para ser leída por humanos y utilizada como guía interna para generar mensajes de commit.
