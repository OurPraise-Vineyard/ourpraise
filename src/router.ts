// Import the generated route tree
import { createRouter } from '@tanstack/react-router'

import { FileRouteTypes, routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type RoutePath = FileRouteTypes['id']

export default router
