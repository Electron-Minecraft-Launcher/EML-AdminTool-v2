import App from "./app";
import DefaultRouter from "./app/routers/default.router";
import ConfigureRouter from "./app/routers/configure.router";
import EnvRouter from "./app/routers/env.router";

const app = new App(
  [
    new DefaultRouter(),
    new ConfigureRouter(),
    new EnvRouter()
  ]
)

app.listen()
