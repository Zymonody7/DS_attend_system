const Layout = () => import("@/layout/index.vue");

export default {
  path: "/class",
  name: "数科21级",
  component: Layout,
  redirect: "/class/ds2001",
  meta: {
    icon: "homeFilled",
    title: "数科21级",
    rank: 0
  },
  children: [
    {
      path: "/class/ds2101",
      name: "数科2101班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2101班"
      }
    },
    {
      path: "/class/ds2102",
      name: "数科2102班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2102班"
      }
    },
    {
      path: "/class/ds2103",
      name: "数科2103班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2103班"
      }
    },
    {
      path: "/class/ds2104",
      name: "数科2104班",
      component: () => import("@/views/class/index.vue"),
      meta: {
        title: "数科2104班"
      }
    }
  ]
} as RouteConfigsTable;
