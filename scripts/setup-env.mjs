import { copyFile, constants } from "node:fs/promises";

try {
  await copyFile(".env.example", ".env.local", constants.COPYFILE_EXCL);
  console.log(
    "Created .env.local. Add your Firebase web configuration, or set VITE_DEMO_MODE=true.",
  );
} catch (error) {
  if (error?.code === "EEXIST") {
    console.log(".env.local already exists; it was left unchanged.");
  } else {
    throw error;
  }
}
