import { clerkMiddleware, createRouteMatcher  } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { role } from './Types';
import { adminRoutes, authRoutes , userRoutes , staffRoutes } from './Routes';

// Define route matchers for public and protected routes
const isPublicRoute = createRouteMatcher(['/auth(.*)', '/' , '/api/v1/webhook/register']);
const isAuthRoute = createRouteMatcher(['/auth(.*)'])
const isUserRoute = createRouteMatcher(['/user(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isStaffRoute = createRouteMatcher(['/staff(.*)'])

export default clerkMiddleware(async (auth, req) => {

  const user = await auth()
  const userRole = (user.sessionClaims?.unsafeMetadata as {role?:string})?.role

  if (user.userId && isAuthRoute(req)) {
    // Redirect authenticated users to the home page or a dashboard based on their role
    switch (userRole){
      case role.ADMIN:
        return NextResponse.redirect(new URL(adminRoutes.dashboard, req.url));
      case role.USER:
        return NextResponse.redirect(new URL(userRoutes.dashboard, req.url));
      case role.STAFF:
        return NextResponse.redirect(new URL(staffRoutes.dashboard, req.url));
      default:
        break;
    }
    // const redirectTo = userRole === role.ADMIN ? adminRoutes.dashboard : userRole === role.STAFF ? staffRoutes.dashboard : userRoutes.dashboard;  // Adjust this as needed
    // return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  switch (true){
    case isAdminRoute(req) && req.nextUrl.pathname === '/admin' || req.nextUrl.pathname === '/dashboard':
      return NextResponse.redirect(new URL(adminRoutes.dashboard, req.url));
    case isStaffRoute(req) && req.nextUrl.pathname === '/staff' || req.nextUrl.pathname === '/dashboard':
      return NextResponse.redirect(new URL(staffRoutes.dashboard, req.url));
    case isUserRoute(req) && req.nextUrl.pathname === '/user' || req.nextUrl.pathname === '/dashboard':
      return NextResponse.redirect(new URL(userRoutes.dashboard, req.url));
  }

  // if (isAdminRoute(req) && req.nextUrl.pathname === '/admin' || req.nextUrl.pathname === '/dashboard') {
  //   return NextResponse.redirect(new URL(adminRoutes.dashboard, req.url));
  // }

  // if (isStaffRoute(req) && req.nextUrl.pathname === '/staff' || req.nextUrl.pathname === '/dashboard') {
  //   return NextResponse.redirect(new URL(staffRoutes.dashboard, req.url));
  // }

  // if (isUserRoute(req) && req.nextUrl.pathname === '/user' || req.nextUrl.pathname === '/dashboard') {
  //   return NextResponse.redirect(new URL(userRoutes.dashboard, req.url));
  // }


  switch (true) {
    case isAdminRoute(req) && userRole !== role.ADMIN:
      return NextResponse.redirect(new URL(authRoutes.signin, req.url));
    case isStaffRoute(req) && userRole !== role.STAFF:
      return NextResponse.redirect(new URL(authRoutes.signin, req.url));
    case isUserRoute(req) && userRole !== role.USER:
      return NextResponse.redirect(new URL(authRoutes.signin, req.url));
  }
  // if (isAdminRoute(req) && userRole !== role.ADMIN) {
  //   const url = new URL(authRoutes.signin, req.url);
  //   return NextResponse.redirect(url);
  // }

  // // Staff access control
  // if (isStaffRoute(req) && userRole !== role.STAFF) {
  //   const url = new URL(authRoutes.signin, req.url);
  //   return NextResponse.redirect(url);
  // }

  // // User access control
  // if (isUserRoute(req) && userRole !== role.USER) {
  //   const url = new URL(authRoutes.signin, req.url);
  //   return NextResponse.redirect(url);
  // }

  if (isPublicRoute(req)) {
    if(req.nextUrl.pathname === '/auth'){
      return NextResponse.redirect(new URL (authRoutes.signin , req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
