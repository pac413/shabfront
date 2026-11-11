// export const isLocal = import.meta.env.VITE_APP_ENVIRONMENT === 'local'

// This is a temporary stand-in for the above code until we fix the .env variable issues for local development
export const isLocal = false // ['local', 'dev'].includes(import.meta.env.VITE_APP_ENVIRONMENT)
