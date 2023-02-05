declare namespace NodeJS {
  export interface ProcessEnv {
    MONGODB_URL?: string;
    DO_SPACE_ENDPOINT?: string;
    DO_SPACE_ACCESS_KEY_ID?: string;
    DO_SPACE_SECRET_ACCESS_KEY?: string;
    DO_SPACE_BUCKET?: string;
    DO_SPACE_REGION?: string;
    STRIPE_API_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_MODE?: string;
  }
}
