import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/:id", "routes/$id.tsx"),
  route("/bulk", "routes/bulk.tsx"),
] satisfies RouteConfig;
