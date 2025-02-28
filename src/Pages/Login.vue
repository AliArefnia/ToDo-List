<template>
  <main class="flex justify-center items-center h-full">
    <div>
      <section
        class="bg-zinc-600 h-[50vh] grid grid-cols-1 rounded-xl p-6 gap-4 justify-items-start"
      >
        <label for="email" class="">Email:</label>
        <input
          class="border-2 md:ml-4 h-[3rem] rounded-md bg-priamry px-3"
          type="email"
          name="email"
          placeholder="Email"
        />

        <label class="" for="password">Password:</label>
        <input
          class="border-2 md:ml-4 h-[3rem] rounded-md bg-priamry px-3"
          type="password"
          name="password"
          placeholder="Password"
        />

        <BaseButton class="w-1/6">Login</BaseButton>
      </section>
    </div>
  </main>
</template>
