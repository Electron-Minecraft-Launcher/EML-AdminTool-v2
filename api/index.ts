import App from './src/app'
import DefaultRouter from '$routers/default.router'
import ConfigureRouter from '$routers/configure.router'
import EnvRouter from '$routers/env.router'
import AuthRouter from '$routers/auth.router'
import AdminRouter from '$routers/admin.router'

const app = new App([
  new DefaultRouter(),
  new ConfigureRouter(),
  new AuthRouter(),
  new AdminRouter(),
  new EnvRouter(),
])

app.listen()
