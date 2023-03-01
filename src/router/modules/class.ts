const Layout = () => import("@/layout/index.vue");

export default {
  path: "/class",
  name: "数科20级",
  component: Layout,
  redirect: "/class/ds2001",
  meta: {
    icon: "homeFilled",
    title: "数科20级",
    rank: 0
  },
  children: [
    {
      path: "/class/ds2001",
      name: "数科2001班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2001班"
      }
    },
    {
      path: "/class/ds2002",
      name: "数科2002班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2002班"
      }
    },
    {
      path: "/class/ds2003",
      name: "数科2003班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2003班"
      }
    },
    {
      path: "/class/ds2004",
      name: "数科2004班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2004班"
      }
    }
  ]
} as RouteConfigsTable;
