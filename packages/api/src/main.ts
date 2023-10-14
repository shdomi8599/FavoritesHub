import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { CLIENT_ADDRESS } from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: ["http://localhost:3000", CLIENT_ADDRESS],
    credentials: true,
  };

  app.use(cookieParser());
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle("FavoritesHub Example")
    .setDescription("The FavoritesHub API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(8080);
}
bootstrap();
