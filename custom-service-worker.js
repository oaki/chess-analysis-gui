const workbox = require("workbox-sw");
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    workbox.strategies.networkFirst(),
  );

  workbox.routing.registerRoute(
    "http://localhost:3000",
    workbox.strategies.networkFirst()
  )

  const bgSyncPlugin = new workbox.backgroundSync.Plugin("todoQueue", {
    maxRetentionTime: 24 * 60
  });

  workbox.routing.registerRoute(
    "http://localhost:8000/todos",
    workbox.strategies.networkFirst({
      plugins: [bgSyncPlugin]
    }),
    "POST"
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}