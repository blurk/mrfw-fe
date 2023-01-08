declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_FILES_URL: string;
      NEXT_PUBLIC_SERVER_URL: string;
      NEXT_PUBLIC_DOMAIN: string;
      MY_SECRET_TOKEN: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
