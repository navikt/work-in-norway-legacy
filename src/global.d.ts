declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CMS_SITE_URL: string;
        }
    }
}

export {};
