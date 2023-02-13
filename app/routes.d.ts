declare module "routes-gen" {
  export type RouteParams = {
    "/testimonial/add": Record<string, never>;
    "/blog/:postSlug": { "postSlug": string };
    "/courses": Record<string, never>;
    "/about": Record<string, never>;
    "/": Record<string, never>;
    "/login": Record<string, never>;
    "/blog": Record<string, never>;
    "/join": Record<string, never>;
  };

  export function route<
    T extends
      | ["/testimonial/add"]
      | ["/blog/:postSlug", RouteParams["/blog/:postSlug"]]
      | ["/courses"]
      | ["/about"]
      | ["/"]
      | ["/login"]
      | ["/blog"]
      | ["/join"]
  >(...args: T): typeof args[0];
}
