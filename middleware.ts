import { clerkMiddleware } from '@clerk/nextjs/server'

const isPublicRoute = (pathname: string) =>
  /^\/(sign-in|sign-up|api\/chat)(\/.*)?$/.test(pathname)

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request.nextUrl.pathname)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}