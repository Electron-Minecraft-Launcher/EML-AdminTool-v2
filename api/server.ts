import App from "./app";
import DefaultRouter from "./app/routers/default.router";
import ConfigureRouter from "./app/routers/configure.router";
import EnvRouter from "./app/routers/env.router";
import AuthRouter from "./app/routers/auth.router";
import AdminRouter from "./app/routers/admin.router";

const app = new App(
  [
    new DefaultRouter(),
    new ConfigureRouter(),
    new AuthRouter(),
    new AdminRouter(),
    new EnvRouter()
  ]
)

app.listen()
